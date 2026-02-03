'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { Category } from '@/domain/entities/plant.entity';
import { supabase } from '@/data/datasources/supabase.client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PlantForm, PlantFormData } from '../../_components/plant-form';
import { Heading1 } from '@/presentation/components/admin/heading_1';

export default function EditPlantPage() {
    const router = useRouter();
    const params = useParams();
    const plantId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetchingPlant, setFetchingPlant] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    // We'll pass the full Plant entity to PlantForm, it handles mapping
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const repo = new SupabasePlantRepository();

            // Fetch categories
            const cats = await repo.getCategories();
            setCategories(cats);

            // Fetch plant data
            const plant = await repo.getPlantById(plantId);

            if (plant) {
                setInitialData(plant);
            } else {
                alert('Plant not found');
                router.push('/admin/plants');
            }

            setFetchingPlant(false);
        };

        fetchData();
    }, [plantId, router]);

    const handleSubmit = async (formData: PlantFormData, newImages: File[], keptExistingImages: string[]) => {
        setLoading(true);

        try {
            let imageUrls: string[] = [...keptExistingImages];

            // Upload new images if provided
            if (newImages.length > 0) {
                const uploadPromises = newImages.map(async (file) => {
                    const fileName = `plant-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                    const { error } = await supabase.storage
                        .from('plants')
                        .upload(fileName, file);

                    if (error) throw error;

                    const { data: { publicUrl } } = supabase.storage
                        .from('plants')
                        .getPublicUrl(fileName);

                    return publicUrl;
                });

                const newUploadedUrls = await Promise.all(uploadPromises);
                imageUrls = [...imageUrls, ...newUploadedUrls];
            }

            // Update Plant
            const repo = new SupabasePlantRepository();
            const price = parseFloat(formData.price) || 0;
            const stock = parseInt(formData.stock) || 0;

            await repo.updatePlant(plantId, {
                name: formData.name,
                price: price,
                discountPrice: formData.discount ? parseFloat(formData.discount) : undefined,
                description: formData.description,
                careInstructions: formData.careInstructions,
                fertilizingInfo: formData.fertilizingInfo,
                categoryId: formData.categoryId,
                images: imageUrls,
                stock: stock,
                isActive: formData.isActive,
                // Add tag fields if needed
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],

                // Map variants
                variants: formData.variants.map(v => ({
                    id: v.id.startsWith('temp-') ? crypto.randomUUID() : v.id, // Generate ID if temp, else keep existing
                    // Note: Supabase might ignore ID on insert, but update needs it? 
                    // Actually updatePlant deletes all and re-inserts in our current repo implementation, 
                    // so ID is re-generated or we can pass it if we want to try to preserve (but repo ignores it on insert usually).
                    // The repo.updatePlant implementation says:
                    // "Delete existing... Insert new"
                    // So we effectively replace them. 

                    size: v.size,
                    price: parseFloat(v.price) || price,
                    discountPrice: v.discount ? parseFloat(v.discount) : undefined,
                    growthRate: undefined, // Or add to form if needed
                    height: v.height,
                    weight: v.weight,
                    potSize: undefined, // Removed from form
                    quantityInStock: parseInt(v.stock) || stock,
                    isAvailable: v.isAvailable,
                    coverImages: [] // Can extend later
                }))
            });

            alert('Plant updated successfully!');
            router.push('/admin/plants');
            router.refresh();

        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingPlant) {
        return (
            <div className="max-w-4xl mx-auto p-6 md:p-8 flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto  md:p-8 pb-20">
            <div className="flex gap-4">
                <Link href="/admin/plants" className="mt-1">
                    <ArrowLeft size={24} />
                </Link>
                <Heading1 title="Edit Plant" headingClassName="text-xl" />
            </div>

            <PlantForm
                initialData={initialData}
                categories={categories}
                onSubmit={handleSubmit}
                isLoading={loading}
                submitLabel="Update Plant"
            />
        </div>
    );
}
