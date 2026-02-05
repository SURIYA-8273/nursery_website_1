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
import { toast } from 'react-toastify';

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
                toast.error('Plant not found');
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

            await repo.updatePlant(plantId, {
                name: formData.name,
                description: formData.description,
                careInstructions: formData.careInstructions,
                fertilizingInfo: formData.fertilizingInfo,
                categoryId: formData.categoryId,
                images: imageUrls,
                isActive: formData.isActive,
                averageRating: formData.averageRating ? parseFloat(formData.averageRating) : 0,
                totalReviews: formData.totalReviews ? parseInt(formData.totalReviews) : 0,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],

                // Map variants
                variants: formData.variants.map(v => ({
                    id: v.id.startsWith('temp-') ? crypto.randomUUID() : v.id,
                    size: v.size,
                    price: parseFloat(v.price) || 0,
                    discountPrice: v.finalPrice ? parseFloat(v.finalPrice) : undefined,
                    growthRate: undefined,
                    height: v.height,
                    weight: v.weight,
                    potSize: undefined,
                    quantityInStock: parseInt(v.stock) || 0,
                    isAvailable: v.isAvailable,
                    coverImages: []
                }))
            });

            toast.success('Plant updated successfully!');
            router.push('/admin/plants');
            router.refresh();

        } catch (error: any) {
            toast.error('Error: ' + error.message);
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
