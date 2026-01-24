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
        <main className="min-h-screen bg-white pb-20 pt-24"> {/* Added pt-24 for sticky navbar offset */}

            {/* Breadcrumb / Nav */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/plants" className="hover:text-primary transition-colors">Plants</Link>
                    <span>/</span>
                    <span className="text-primary font-medium">{plant.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

                {/* Left Column: Gallery */}
                <div>
                    <ProductGallery
                        images={plant.images}
                        name={plant.name}
                        discount={discountPercentage}
                    />
                </div>

                {/* Right Column: Sticky Product Info */}
                <div className="lg:sticky lg:top-28 h-fit space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                                {plant.name}
                            </h1>
                            <div className="flex gap-2">
                                <button className="p-3 rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-red-500">
                                    <Heart size={24} />
                                </button>
                                <button className="p-3 rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-primary">
                                    <Share2 size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Rating Placeholder */}
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span className="text-text-muted">(No reviews yet)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-4 border-b border-secondary/10 pb-6">
                            <span className="text-4xl font-bold text-text-primary">
                                ₹{currentPrice}
                            </span>
                            {plant.discountPrice && (
                                <div className="flex flex-col mb-1">
                                    <span className="text-lg text-text-muted line-through">₹{plant.price}</span>
                                    <span className="text-xs font-bold text-accent">Save ₹{plant.price - plant.discountPrice}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description Snippet */}
                    <p className="text-text-secondary leading-relaxed">
                        {plant.description.slice(0, 150)}...
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <AddToCartButton plant={plant} />
                            <a
                                href={WhatsAppService.generateBuyNowLink(plant)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary font-bold py-3 rounded-full hover:bg-primary/5 transition-all text-center"
                            >
                                Buy on WhatsApp
                            </a>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-text-muted mt-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            In Stock & Ready to Ship
                        </div>
                    </div>

                    {/* Features Grid (Mini) */}
                    <div className="grid grid-cols-3 gap-4 py-6 border-y border-secondary/10">
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center mx-auto text-primary">
                                <span className="text-xl">☀️</span>
                            </div>
                            <p className="text-xs font-bold text-text-secondary">Light Lover</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center mx-auto text-primary">
                                <span className="text-xl">💧</span>
                            </div>
                            <p className="text-xs font-bold text-text-secondary">Water Weekly</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center mx-auto text-primary">
                                <span className="text-xl">🐾</span>
                            </div>
                            <p className="text-xs font-bold text-text-secondary">Pet Friendly</p>
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
