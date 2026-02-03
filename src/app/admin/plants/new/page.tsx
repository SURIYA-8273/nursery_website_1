'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { Category } from '@/domain/entities/plant.entity';
import { supabase } from '@/data/datasources/supabase.client';
import { ArrowLeft } from 'lucide-react';
import { APP_CONFIG } from '@/core/config/constants';
import Link from 'next/link';
import { PlantForm, PlantFormData } from '../_components/plant-form';
import { Heading1 } from '@/presentation/components/admin/heading_1';

export default function NewPlantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCats = async () => {
            const repo = new SupabasePlantRepository();
            const cats = await repo.getCategories();
            setCategories(cats);
        };
        fetchCats();
    }, []);

    const handleSubmit = async (formData: PlantFormData, newImages: File[], keptExistingImages: string[]) => {
        setLoading(true);

        try {
            let imageUrls: string[] = [];

            // 1. Upload Images
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

                imageUrls = await Promise.all(uploadPromises);
            }


            // 2. Create Plant
            const repo = new SupabasePlantRepository();
            const price = parseFloat(formData.price) || 0;
            const stock = parseInt(formData.stock) || 0;

            await repo.createPlant({
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
                isAvailable: formData.isActive,
                // Add tag fields if needed
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],

                // Map variants
                variants: formData.variants.map(v => ({
                    id: v.id, // Repo will likely ignore/regenerate this
                    size: v.size,
                    price: parseFloat(v.price) || price,
                    discountPrice: v.discount ? parseFloat(v.discount) : undefined,
                    growthRate: undefined,
                    height: v.height,
                    weight: v.weight,
                    quantityInStock: parseInt(v.stock) || stock,
                    isAvailable: v.isAvailable,
                    coverImages: [] // Can extend to support per-variant images later
                }))
            });

            router.push(APP_CONFIG.routes.admin.dashboard);
            router.refresh();

        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto md:p-6 lg:p-8 pb-20">
            <div className="flex gap-4">
                <Link href={APP_CONFIG.routes.admin.dashboard} className="mt-1">
                    <ArrowLeft size={24} />
                </Link>
                <Heading1 title="Add New Plant" headingClassName="text-xl" />
            </div>

            <PlantForm
                categories={categories}
                onSubmit={handleSubmit}
                isLoading={loading}
                submitLabel="Save Plant"
            />
        </div>
    );
}

