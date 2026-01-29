'use client';

import { useState, useEffect } from 'react';
import { Plant, PlantVariant } from '@/domain/entities/plant.entity';
import { AddToCartButton } from './add-to-cart-button';
import { WhatsAppService } from '@/data/services/whatsapp.service';
import { Heart, Share2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/presentation/store/wishlist.store';

interface ProductInfoProps {
    plant: Plant;
}

export const ProductInfo = ({ plant }: ProductInfoProps) => {
    const { isInWishlist, addToWishlist, removeFromWishlist, refreshWishlist } = useWishlistStore();

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const isWishlisted = isInWishlist(plant.id);

    const toggleWishlist = async () => {
        if (isWishlisted) {
            await removeFromWishlist(plant.id);
        } else {
            await addToWishlist(plant);
        }
    };

    // Default to first variant if exists, else undefined
    const [selectedVariant, setSelectedVariant] = useState<PlantVariant | undefined>(
        plant.variants && plant.variants.length > 0 ? plant.variants[0] : undefined
    );

    const basePrice = plant.price || 0;
    const baseDiscountPrice = plant.discountPrice;

    // Determine current price based on variant or base
    const priceToDisplay = selectedVariant ? selectedVariant.price : basePrice;
    const discountPriceToDisplay = selectedVariant ? selectedVariant.discountPrice : baseDiscountPrice;

    // Calculate display values
    const finalPrice = discountPriceToDisplay || priceToDisplay;
    const originalPrice = discountPriceToDisplay ? priceToDisplay : null;
    const discountPercentage = discountPriceToDisplay
        ? Math.round(((priceToDisplay - discountPriceToDisplay) / priceToDisplay) * 100)
        : 0;

    const stock = selectedVariant ? selectedVariant.quantityInStock : (plant.stock || 0);
    const isOutOfStock = stock <= 0;

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                        {plant.name}
                    </h1>
                    <div className="flex gap-1 md:gap-2 flex-shrink-0">
                        <button
                            onClick={toggleWishlist}
                            className={cn(
                                "p-2 md:p-3 rounded-full hover:bg-surface transition-all duration-300 transform active:scale-90",
                                isWishlisted ? "text-[#D36E45]" : "text-text-secondary hover:text-[#D36E45]"
                            )}
                        >
                            <Heart
                                size={20}
                                className="md:w-6 md:h-6"
                                fill={isWishlisted ? "currentColor" : "none"}
                            />
                        </button>
                        <button className="p-2 md:p-3 rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-primary">
                            <Share2 size={20} className="md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 text-xs md:text-sm">
                    <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" className="md:w-4 md:h-4" />)}
                    </div>
                    <span className="text-text-muted">(No reviews yet)</span>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 md:gap-4 border-b border-secondary/10 pb-4 md:pb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-text-primary">
                        ₹{finalPrice}
                    </span>
                    {originalPrice && (
                        <div className="flex flex-col mb-1">
                            <span className="text-base md:text-lg text-text-muted line-through">₹{originalPrice}</span>
                            <span className="text-xs font-bold text-accent">Save ₹{originalPrice - finalPrice} ({discountPercentage}% off)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Variant Selector */}
            {plant.variants && plant.variants.length > 0 && (
                <div className="space-y-3">
                    <span className="text-sm font-bold text-text-secondary">Select Size</span>
                    <div className="flex flex-wrap gap-2">
                        {plant.variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedVariant?.id === variant.id
                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                    : 'border-secondary/20 hover:border-primary/50 text-text-secondary'
                                    }`}
                            >
                                {variant.size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Description */}
            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                {plant.description.slice(0, 150)}...
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <AddToCartButton
                        plant={plant}
                        selectedVariant={selectedVariant ? {
                            id: selectedVariant.id,
                            size: selectedVariant.size,
                            price: finalPrice // Use the final discounted price if applied
                        } : undefined}
                    />
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
                    <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    {isOutOfStock ? 'Out of Stock' : 'In Stock & Ready to Ship'}
                </div>
            </div>

            {/* Features (moved from page.tsx or kept there? kept here for layout consistency) */}
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
        </div >
    );
};
