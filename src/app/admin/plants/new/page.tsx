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
import { toast } from 'react-toastify';

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

            await repo.createPlant({
                name: formData.name,
                description: formData.description,
                careInstructions: formData.careInstructions,
                fertilizingInfo: formData.fertilizingInfo,
                categoryId: formData.categoryId,
                images: imageUrls,
                isActive: formData.isActive,
                isAvailable: formData.isActive,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],

                // Map variants
                variants: formData.variants.map(v => ({
                    id: crypto.randomUUID(),
                    size: v.size,
                    price: parseFloat(v.price) || 0,
                    discountPrice: v.finalPrice ? parseFloat(v.finalPrice) : undefined,
                    growthRate: undefined,
                    height: v.height,
                    weight: v.weight,
                    quantityInStock: parseInt(v.stock) || 0,
                    isAvailable: v.isAvailable,
                    coverImages: []
                }))
            });

            toast.success('Plant created successfully!');
            router.push("/admin/plants");
            router.refresh();

        } catch (error: any) {
            toast.error('Error: ' + error.message);
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

