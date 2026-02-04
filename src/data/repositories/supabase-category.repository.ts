import { ICategoryRepository } from '@/domain/repositories/category.repository';
import { Category } from '@/domain/entities/plant.entity';
import { supabase } from '@/data/datasources/supabase.client';

export class SupabaseCategoryRepository implements ICategoryRepository {
    async getCategories(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;

        return data.map(this._mapToEntity);
    }

    async getCategoryById(id: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return this._mapToEntity(data);
    }

    async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
        const { data, error } = await supabase
            .from('categories')
            .insert({
                name: category.name,
                image: category.image,
                description: category.description,
            })
            .select()
            .single();

        if (error) throw error;
        return this._mapToEntity(data);
    }

    async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
        const updates: any = {};
        if (category.name) updates.name = category.name;
        if (category.image) updates.image = category.image;
        if (category.description) updates.description = category.description;

        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return this._mapToEntity(data);
    }

    async deleteCategory(id: string): Promise<void> {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }


    async countCategories(): Promise<number> {
        const { count, error } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return count || 0;
    }

    private _mapToEntity(row: any): Category {
        return {
            id: row.id,
            name: row.name,
            image: row.image,
            description: row.description,
        };
    }
}
