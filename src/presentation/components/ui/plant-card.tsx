'use client';

import Link from 'next/link';
import { Plant } from '@/domain/entities/plant.entity';
import { FavoriteButton } from '@/presentation/components/features/favorite-button';
import { Star, ShoppingBag, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/presentation/store/cart.store';
import { useState } from 'react';
import { Button } from './button';

interface PlantCardProps {
    plant: Plant;
    badgeTitle?: string;
}

export const PlantCard = ({ plant, badgeTitle }: PlantCardProps) => {
    const price = plant.price || 0;
    const discountPrice = plant.discountPrice;

    // Within last 30 days
    const isNew = new Date().getTime() - new Date(plant.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

    // Mock data for ratings/reviews if they don't exist yet in DB
    const rating = plant.rating || 4.8;
    const reviewCount = plant.reviewCount || 128;

    // Map categories to display labels
    const categoryLabel = plant.category || "Indoor Plants";

    const addToCart = useCartStore((state) => state.addToCart);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);
        await addToCart(plant, 1);

        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    return (
        <div className="group block h-full bg-[var(--color-surface-hover)] p-1 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm hover:border-[var(--color-primary)]">
            <Link href={`/plants/${plant.id}`} className="block relative mb-3">
                {/* Image Container */}
                <div className="aspect-square bg-[#FAF9F6] relative overflow-hidden rounded-[10px]">
                    {plant.images[0] ? (
                        <img
                            src={plant.images[0]}
                            alt={plant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            No Image
                        </div>
                    )}

                    {/* Badge */}
                    {
                        badgeTitle && (
                            <div className="absolute top-2 left-2 z-20">
                                <span className="bg-[#2D5A42] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg border border-white/10 backdrop-blur-sm">
                                    <Star size={10} fill="white" className="text-white" /> {badgeTitle}
                                </span>
                            </div>
                        )
                    }

                    {/* Like button overlay */}
                    <div className="absolute top-2 right-2 z-20 opacity-100 transition-opacity">
                        <FavoriteButton
                            plant={plant}
                            className="bg-white/90 backdrop-blur-md shadow-sm"
                        />
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 px-2 pb-1">
                <span className="text-[10px] md:text-[11px] font-bold text-[#D36E45] uppercase tracking-[0.1em] mb-1 font-sans opacity-80">
                    {categoryLabel}
                </span>

                <Link href={`/plants/${plant.id}`}>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1 mb-1">
                        {plant.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2 font-sans">
                    <Star size={14} fill="#D36E45" className="text-[#D36E45]" />
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">{rating}</span>
                    <span className="text-[var(--color-text-muted)] text-sm">•</span>
                    <span className="text-[var(--color-text-muted)] text-sm">{reviewCount} reviews</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-1">
                    <div className="flex items-baseline gap-2 font-sans">
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">₹{discountPrice || price}</span>
                        {discountPrice && (
                            <span className="text-sm text-[var(--color-text-muted)] line-through font-medium">₹{price}</span>
                        )}
                    </div>
                    <Button onClick={handleAddToCart} disabled={isAdding} className='px-3'>
                        {isAdding ? <Loader2 size={20} className="animate-spin" /> : <ShoppingBag size={20} />}

                    </Button>
                </div>
            </div>
        </div>
    );
};
