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

    const handleSubmit = async (formData: PlantFormData, imageFile: File | null) => {
        setLoading(true);

        try {
            let imageUrls: string[] = [];

            // 1. Upload Image if exists
            if (imageFile) {
                const fileName = `plant-${Date.now()}`;
                const { data, error } = await supabase.storage
                    .from('plants')
                    .upload(fileName, imageFile);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('plants')
                    .getPublicUrl(fileName);

                imageUrls.push(publicUrl);
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
                categoryId: formData.categoryId,
                images: imageUrls,
                stock: stock,
                isActive: formData.isActive,
                isAvailable: formData.isActive,
                // Add tag fields if needed
                tags: [],

                // Map variants
                variants: formData.variants.map(v => ({
                    id: v.id, // Repo will likely ignore/regenerate this
                    size: v.size,
                    price: parseFloat(v.price) || price,
                    discountPrice: v.discount ? parseFloat(v.discount) : undefined,
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
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pb-20">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <Link href={APP_CONFIG.routes.admin.dashboard} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">Add New Plant</h1>
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

