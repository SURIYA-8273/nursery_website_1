import { notFound } from 'next/navigation';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import Link from 'next/link';
import { Share2, Heart, Star } from 'lucide-react';
import { WhatsAppService } from '@/data/services/whatsapp.service';
import { Metadata } from 'next';
import { ProductGallery } from '@/presentation/components/features/product-gallery';
import { ProductTabs } from '@/presentation/components/features/product-tabs';
import { RelatedPlants } from '@/presentation/components/features/related-plants';
import { ProductInfo } from '@/presentation/components/features/product-info';

interface Props {
    params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const repo = new SupabasePlantRepository();
    const plant = await repo.getPlantById(resolvedParams.id);

    if (!plant) {
        return {
            title: 'Plant Not Found',
        };
    }

    return {
        title: `${plant.name} | Plant Shop`,
        description: plant.description.slice(0, 160),
        openGraph: {
            title: plant.name,
            description: plant.description.slice(0, 160),
            images: plant.images.length > 0 ? [plant.images[0]] : [],
        },
    };
}

export default async function PlantDetailsPage({ params }: Props) {
    const resolvedParams = await params;
    const repo = new SupabasePlantRepository();
    const plant = await repo.getPlantById(resolvedParams.id);

    if (!plant) {
        notFound();
    }

    const price = plant.price || 0;
    const discountPrice = plant.discountPrice;
    const discountPercentage = discountPrice
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;
    const currentPrice = discountPrice || price;

    return (
        <main className="min-h-screen bg-white pb-12 md:pb-20 pt-20 md:pt-24">

            {/* Breadcrumb / Nav - Responsive */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6 md:mb-8">
                <div className="flex items-center gap-2 text-xs md:text-sm text-text-muted">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/plants" className="hover:text-primary transition-colors">Plants</Link>
                    <span>/</span>
                    <span className="text-primary font-medium truncate">{plant.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 xl:gap-20">

                {/* Left Column: Gallery */}
                <div>
                    <ProductGallery
                        images={plant.images}
                        name={plant.name}
                        discount={discountPercentage}
                    />
                </div>

                {/* Right Column: Sticky Product Info */}
                <div className="lg:sticky lg:top-28 h-fit space-y-6 md:space-y-8">
                    <ProductInfo plant={plant} />

                    {/* Tabs Component */}
                    <ProductTabs description={plant.description} care={plant.careInstructions || ''} />
                </div>
            </div>

            {/* Related Products */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
                <RelatedPlants />
            </div>
        </main >
    );
}
