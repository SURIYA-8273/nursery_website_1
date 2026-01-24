import { notFound } from 'next/navigation';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import Link from 'next/link';
import { Share2, Heart, Star } from 'lucide-react';
import { WhatsAppService } from '@/data/services/whatsapp.service';
import { Metadata } from 'next';
import { ProductGallery } from '@/presentation/components/features/product-gallery';
import { ProductTabs } from '@/presentation/components/features/product-tabs';
import { RelatedPlants } from '@/presentation/components/features/related-plants';
import { AddToCartButton } from '@/presentation/components/features/add-to-cart-button';

interface Props {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const repo = new SupabasePlantRepository();
    const plant = await repo.getPlantBySlug(resolvedParams.slug);

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
    const plant = await repo.getPlantBySlug(resolvedParams.slug);

    if (!plant) {
        notFound();
    }

    const discountPercentage = plant.discountPrice
        ? Math.round(((plant.price - plant.discountPrice) / plant.price) * 100)
        : 0;
    const currentPrice = plant.discountPrice || plant.price;

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
                    {/* Header - Responsive */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                                {plant.name}
                            </h1>
                            <div className="flex gap-1 md:gap-2 flex-shrink-0">
                                <button className="p-2 md:p-3 rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-red-500">
                                    <Heart size={20} className="md:w-6 md:h-6" />
                                </button>
                                <button className="p-2 md:p-3 rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-primary">
                                    <Share2 size={20} className="md:w-6 md:h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Rating - Responsive */}
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" className="md:w-4 md:h-4" />)}
                            </div>
                            <span className="text-text-muted">(No reviews yet)</span>
                        </div>

                        {/* Price - Responsive */}
                        <div className="flex items-end gap-3 md:gap-4 border-b border-secondary/10 pb-4 md:pb-6">
                            <span className="text-3xl sm:text-4xl font-bold text-text-primary">
                                ₹{currentPrice}
                            </span>
                            {plant.discountPrice && (
                                <div className="flex flex-col mb-1">
                                    <span className="text-base md:text-lg text-text-muted line-through">₹{plant.price}</span>
                                    <span className="text-xs font-bold text-accent">Save ₹{plant.price - plant.discountPrice}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description - Responsive */}
                    <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                        {plant.description.slice(0, 150)}...
                    </p>

                    {/* Actions - Responsive */}
                    <div className="flex flex-col gap-3 md:gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <AddToCartButton plant={plant} />
                            <a
                                href={WhatsAppService.generateBuyNowLink(plant)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary font-bold py-3 md:py-3.5 rounded-full hover:bg-primary/5 transition-all text-center text-sm md:text-base"
                            >
                                Buy on WhatsApp
                            </a>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-text-muted mt-1 md:mt-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            In Stock & Ready to Ship
                        </div>
                    </div>

                    {/* Features Grid - Responsive */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4 py-4 md:py-6 border-y border-secondary/10">
                        <div className="text-center space-y-1.5 md:space-y-2">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-surface rounded-full flex items-center justify-center mx-auto text-primary">
                                <span className="text-lg md:text-xl">☀️</span>
                            </div>
                            <p className="text-[10px] sm:text-xs font-bold text-text-secondary leading-tight">Light Lover</p>
                        </div>
                        <div className="text-center space-y-1.5 md:space-y-2">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-surface rounded-full flex items-center justify-center mx-auto text-primary">
                                <span className="text-lg md:text-xl">💧</span>
                            </div>
                            <p className="text-[10px] sm:text-xs font-bold text-text-secondary leading-tight">Water Weekly</p>
                        </div>
                        <div className="text-center space-y-1.5 md:space-y-2">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-surface rounded-full flex items-center justify-center mx-auto text-primary">
                                <span className="text-lg md:text-xl">🐾</span>
                            </div>
                            <p className="text-[10px] sm:text-xs font-bold text-text-secondary leading-tight">Pet Friendly</p>
                        </div>
                    </div>

                    {/* Tabs Component */}
                    <ProductTabs description={plant.description} care={plant.careInstructions || ''} />
                </div>
            </div>

            {/* Related Products */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
                <RelatedPlants />
            </div>
        </main>
    );
}
