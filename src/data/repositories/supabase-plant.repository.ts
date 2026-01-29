import { IPlantRepository } from '@/domain/repositories/plant.repository';
import { Plant, Category, PlantVariant } from '@/domain/entities/plant.entity';
import { supabase } from '../datasources/supabase.client';

export class SupabasePlantRepository implements IPlantRepository {
    async getPlants(params?: { category?: string; search?: string; page?: number; limit?: number }): Promise<{ plants: Plant[]; total: number }> {
        let query = supabase
            .from('plants')
            .select('*, categories(name), plant_variants(*), plant_images(*)', { count: 'exact' })
            .eq('is_active', true);

        if (params?.category) {
            // Filter by category name via join if possible, or category_custom
            // Since Supabase join filtering is tricky with raw syntax, we might filter by category_id if provided
            // or perform a separate lookup. For now, let's try to filter by category_custom or ignore if complex.
            // If params.category is an ID:
            query = query.or(`category_id.eq.${params.category},category_custom.ilike.%${params.category}%`);
        }

        if (params?.search) {
            query = query.ilike('name', `%${params.search}%`);
        }

        // Pagination
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching plants:', error);
            // Return empty or mock for now if table doesn't exist
            return { plants: [], total: 0 };
        }

        const plants: Plant[] = data.map((row: any) => this._mapToEntity(row));

        return { plants, total: count || 0 };
    }

    async getPlantById(id: string): Promise<Plant | null> {
        const { data, error } = await supabase
            .from('plants')
            .select('*, categories(name), plant_variants(*), plant_images(*)')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        return this._mapToEntity(data);
    }

    async getFeaturedPlants(): Promise<Plant[]> {
        // Basic implementation: get 5 random or latest
        const { data } = await supabase
            .from('plants')
            .select('*, categories(name), plant_variants(*), plant_images(*)')
            .eq('is_active', true)
            .limit(4);

        if (!data) return [];

        return data.map((row: any) => this._mapToEntity(row));
    }

    async getCategories(): Promise<Category[]> {
        const { data } = await supabase.from('categories').select('*');
        if (!data) return [];

        return data.map((row: any) => ({
            id: row.id,
            name: row.name,
            image: row.image,
        }));
    }
    async createPlant(plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plant> {
        // 1. Insert Plant
        const { data: plantData, error: plantError } = await supabase
            .from('plants')
            .insert({
                name: plant.name,
                // price, discount, stock are optional/legacy root fields
                price: plant.price,
                discount: plant.discountPrice,
                description: plant.description,
                care_instructions: plant.careInstructions,
                fertilizing_info: plant.fertilizingInfo,
                usage_info: plant.usageInfo,
                category_id: plant.categoryId || null,
                stock: plant.stock,
                is_active: plant.isActive,
                tags: plant.tags,
            })
            .select()
            .single();

        if (plantError) throw plantError;

        // 2. Insert Images (Normalized)
        if (plant.images && plant.images.length > 0) {
            const imagesToInsert = plant.images.map((url, index) => ({
                plant_id: plantData.id,
                image_url: url,
                is_primary: index === 0,
                display_order: index
            }));

            const { error: imagesError } = await supabase
                .from('plant_images')
                .insert(imagesToInsert);

            if (imagesError) {
                console.error("Error inserting images", imagesError);
            }
        }

        // 3. Insert Variants
        if (plant.variants && plant.variants.length > 0) {
            const variantsToInsert = plant.variants.map(v => ({
                plant_id: plantData.id,
                size: v.size,
                price: v.price,

                discount: v.discountPrice, // value
                // discount_percentage removed from schema

                stock: v.quantityInStock,
                is_active: v.isAvailable,
                // images removed from schema

                growth_rate: v.growthRate,
                height: v.height,
                weight: v.weight
            }));

            const { error: variantsError } = await supabase
                .from('plant_variants')
                .insert(variantsToInsert);

            if (variantsError) {
                console.error("Error inserting variants", variantsError);
                // Optional: rollback plant creation? 
            }
        }

        // Return complete entity (re-fetch or construct)
        // For simplicity, returning map of what we have, but retrieving fresh is better to get joins.
        return this.getPlantById(plantData.id) as Promise<Plant>;
    }

    async updatePlant(id: string, plant: Partial<Plant>): Promise<Plant> {
        const updates: any = {};
        if (plant.name) updates.name = plant.name;
        // slug removed

        if (plant.price !== undefined) updates.price = plant.price;
        if (plant.discountPrice !== undefined) updates.discount = plant.discountPrice;

        if (plant.description) updates.description = plant.description;
        if (plant.careInstructions) updates.care_instructions = plant.careInstructions;
        if (plant.fertilizingInfo) updates.fertilizing_info = plant.fertilizingInfo;
        if (plant.usageInfo) updates.usage_info = plant.usageInfo;

        if (plant.categoryId !== undefined) updates.category_id = plant.categoryId || null;

        if (plant.stock !== undefined) updates.stock = plant.stock;
        if (plant.isActive !== undefined) updates.is_active = plant.isActive;

        if (plant.tags) updates.tags = plant.tags;

        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('plants')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Handle Images Update (Replace Strategy)
        if (plant.images) {
            // Delete existing
            await supabase.from('plant_images').delete().eq('plant_id', id);

            // Insert new
            if (plant.images.length > 0) {
                const imagesToInsert = plant.images.map((url, index) => ({
                    plant_id: id,
                    image_url: url,
                    is_primary: index === 0,
                    display_order: index
                }));

                await supabase.from('plant_images').insert(imagesToInsert);
            }
        }

        // Handle Variants Update (Simplified: If variants provided, replace all? Or Upsert?)
        // For a full implementation, we need diffing. check IDs, update existing, insert new, delete missing.
        // For this task, I will implement a "Delete All and Re-insert" for the plant's variants IF variants array is provided.
        // This is destructive but ensures consistency with the provided array.
        if (plant.variants) {
            // Delete existing
            await supabase.from('plant_variants').delete().eq('plant_id', id);

            // Insert new
            if (plant.variants.length > 0) {
                const variantsToInsert = plant.variants.map(v => ({
                    plant_id: id,
                    size: v.size,
                    price: v.price,
                    discount: v.discountPrice,
                    // discount_percentage removed
                    stock: v.quantityInStock,
                    is_active: v.isAvailable,
                    // images removed
                    growth_rate: v.growthRate,
                    height: v.height,
                    weight: v.weight
                }));

                await supabase.from('plant_variants').insert(variantsToInsert);
            }
        }

        // Return updated complete entity
        return this.getPlantById(id) as Promise<Plant>;
    }

    async deletePlant(id: string): Promise<void> {
        const { error } = await supabase
            .from('plants')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    private _mapToEntity(row: any): Plant {
        // Construct a default variant if none exist, using the legacy root fields

        // Map images from normalized table
        let images: string[] = [];
        if (row.plant_images && Array.isArray(row.plant_images)) {
            images = row.plant_images
                .sort((a: any, b: any) => a.display_order - b.display_order)
                .map((img: any) => img.image_url);
        } else if (row.images && Array.isArray(row.images)) {
            // Fallback to legacy array if table not populated
            images = row.images;
        }

        const defaultVariant: PlantVariant = {
            id: `${row.id}-default`,
            size: 'Standard',
            price: row.price || 0,
            discountPrice: row.discount,
            discount: row.discount ? Math.round(((row.price - row.discount) / row.price) * 100) : 0,
            quantityInStock: row.stock || 0,
            isAvailable: row.is_active,
            coverImages: images // Use mapped or legacy
        };

        const variants: PlantVariant[] = row.plant_variants && Array.isArray(row.plant_variants)
            ? row.plant_variants.map((v: any) => ({
                id: v.id,
                size: v.size,
                price: v.price,
                discountPrice: v.discount,
                discount: v.discount ? Math.round(((v.price - v.discount) / v.price) * 100) : 0,
                ratings: v.ratings,
                reviewsCount: v.reviews_count,
                growthRate: v.growth_rate,
                height: v.height,
                weight: v.weight,
                quantityInStock: v.stock, // db column is 'stock' now? check schema.
                // Schema says: stock integer variants.stock
                // Previous code: v.quantity_in_stock ??
                // Let's check schema: stock integer not null default 0
                // So property is v.stock
                isAvailable: v.is_active,
                coverImages: [] // Removed from schema
            }))
            : [defaultVariant];

        return {
            id: row.id,
            name: row.name,
            description: row.description,

            category: row.categories ? row.categories.name : undefined,
            categoryId: row.category_id,
            tags: row.tags || [],

            careInstructions: row.care_instructions,
            fertilizingInfo: row.fertilizing_info,
            usageInfo: row.usage_info,

            images: images,

            isAvailable: row.is_active,
            isActive: row.is_active,

            variants: variants,

            // Legacy fields
            price: row.price,
            discountPrice: row.discount,
            stock: row.stock,

            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at || row.created_at),
        };
    }
}
