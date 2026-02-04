'use client';

import { useState, useEffect } from 'react';
import { Plant, PlantVariant } from '@/domain/entities/plant.entity';
import { WhatsAppService } from '@/data/services/whatsapp.service';
import { Heart, Share2, Star, Tag, Maximize, ArrowUpToLine, Weight, ShoppingBag, Check, Plus, Minus, Droplets, Sprout, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/presentation/context/wishlist-context';
import { useCart } from '@/presentation/context/cart-context';
import { Button } from '@/presentation/components/ui/button';
import { toast } from 'react-toastify';

interface ProductInfoProps {
    plant: Plant;
}

export const ProductInfo = ({ plant }: ProductInfoProps) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isCopied, setIsCopied] = useState(false);

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
        <div className="space-y-3 md:space-y-8">

            <div className="">

                <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#D36E45]/10 text-[#D36E45] text-xs font-bold uppercase tracking-wider">
                        {plant.category}
                    </span>
                    {(plant.averageRating && plant.averageRating > 0) && (
                        <div className="flex items-center gap-1">
                            <Star size={14} fill="currentColor" className="text-yellow-400" />
                            <span className="text-xs font-medium text-text-secondary">
                                {plant.averageRating.toFixed(1)} ({plant.totalReviews || 0} reviews)
                            </span>
                        </div>
                    )}
                </div>


                <div className="flex justify-between items-start gap-4">
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                        {plant.name}
                    </h1>


                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={toggleWishlist}
                            className={cn(
                                "p-2.5 rounded-full border border-gray-100 hover:border-secondary/20 hover:bg-surface transition-all duration-300 active:scale-95",
                                isWishlisted ? "text-[#D36E45] bg-[#D36E45]/5 border-[#D36E45]/10" : "text-text-secondary"
                            )}
                        >
                            <Heart
                                size={20}
                                fill={isWishlisted ? "currentColor" : "none"}
                            />
                        </button>
                        <button
                            onClick={async () => {
                                const url = window.location.href;
                                if (navigator.share) {
                                    try {
                                        await navigator.share({
                                            title: plant.name,
                                            text: `Check out ${plant.name} on GreenRoots!`,
                                            url,
                                        });
                                    } catch (err) {
                                        console.error('Error sharing:', err);
                                    }
                                } else {
                                    try {
                                        if (navigator.clipboard && navigator.clipboard.writeText) {
                                            await navigator.clipboard.writeText(url);
                                            setIsCopied(true);
                                            toast.success("Link copied to clipboard!");
                                            setTimeout(() => setIsCopied(false), 2000);
                                        } else {
                                            // Fallback for older browsers or non-secure contexts
                                            const textArea = document.createElement("textarea");
                                            textArea.value = url;
                                            document.body.appendChild(textArea);
                                            textArea.select();
                                            document.execCommand('copy');
                                            document.body.removeChild(textArea);
                                            setIsCopied(true);
                                            toast.success("Link copied to clipboard!");
                                            setTimeout(() => setIsCopied(false), 2000);
                                        }
                                    } catch (err) {
                                        console.error('Failed to copy: ', err);
                                        toast.error("Failed to copy link.");
                                    }
                                }
                            }}
                            className="p-2.5 rounded-full border border-gray-100 hover:border-secondary/20 hover:bg-surface transition-all duration-300 text-text-secondary hover:text-primary active:scale-95 relative"
                        >
                            {isCopied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
                            {isCopied && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                    Copied!
                                </span>
                            )}
                        </button>

                    </div>
                </div>





                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-2">
                    <span className="text-4xl font-bold text-primary">₹{finalPrice}</span>
                    {originalPrice && (
                        <>
                            <span className="text-lg text-text-muted line-through decoration-gray-300">₹{originalPrice}</span>
                            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                {discountPercentage}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Variant Selector */}
            {plant.variants && plant.variants.length > 0 && (
                <div className="space-y-3">
                    <span className="text-sm font-bold text-text-secondary ">Select Size</span>
                    <div className="flex flex-wrap gap-3 pt-2">
                        {plant.variants.map((variant) => {
                            const isSelected = selectedVariant?.id === variant.id;
                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center bg-[var(--color-surface-hover)] p-4 rounded-[10px] border border-black/10 shadow-sm hover:border-[var(--color-primary)] min-w-[120px] transition-all",
                                        // "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-w-[120px] text-center",
                                        isSelected
                                            ? "border border-primary"
                                            : ""
                                    )}
                                >
                                    {isSelected && (
                                        <div className="absolute top-[-6px] right-[-6px] bg-primary text-white rounded-full p-0.5">
                                            <Check size={12} />
                                        </div>
                                    )}
                                    <span className={cn(
                                        "text-text-muted font-bold mb-1",
                                        isSelected ? "text-text-muted" : "text-text-muted"
                                    )}>
                                        {variant.size}
                                    </span>
                                    {variant.height && (
                                        <span className="font-serif font-bold text-primary text-lg">
                                            {variant.height}
                                        </span>
                                    )}
                                    {variant.potSize && (
                                        <span className="text-sm text-text-muted">
                                            {variant.potSize}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Description */}
            <p className="text-md md:text-base text-text-secondary leading-relaxed">
                {plant.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
                {plant.tags && plant.tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wide bg-secondary/10 text-primary border border-secondary/10 uppercase"
                    >
                        <Tag size={13} className="mr-1.5" />
                        {tag}
                    </span>
                ))}
            </div>


            {/* Product Details Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 py-2">
                <div className="group bg-[var(--color-surface-hover)] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm hover:border-[var(--color-primary)] flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <Maximize size={16} />
                    </div>
                    <div>
                        <span className="block text-text-muted text-[10px] uppercase font-bold tracking-widest mb-0.5">Bag Size</span>
                        <p className="font-serif font-bold text-primary text-lg">{selectedVariant?.size || '-'}</p>
                    </div>
                </div>
                <div className="group bg-[var(--color-surface-hover)] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm hover:border-[var(--color-primary)] flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <ArrowUpToLine size={16} />
                    </div>
                    <div>
                        <span className="block text-text-muted text-[10px] uppercase font-bold tracking-widest mb-0.5">Height</span>
                        <p className="font-serif font-bold text-primary text-lg">{selectedVariant?.height || '-'} CM</p>
                    </div>
                </div>
                <div className="group bg-[var(--color-surface-hover)] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm hover:border-[var(--color-primary)] flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <Weight size={16} />
                    </div>
                    <div>
                        <span className="block text-text-muted text-[10px] uppercase font-bold tracking-widest mb-0.5">Weight</span>
                        <p className="font-serif font-bold text-primary text-lg">{selectedVariant?.weight || '-'} KG</p>
                    </div>
                </div>
            </div>

            {/* Actions */}

            <div className='flex gap-2'>

                <div className="flex bg-primary text-white items-center px-2 justify-between  rounded-md border border-secondary/20 min-w-[140px]">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-primary/30 rounded-full p-1 border border-white/60"
                        disabled={quantity <= 1}
                    >
                        <Minus size={18} />
                    </button>
                    <span className="font-bold text-lg min-w-[2ch] text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                        className="bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-primary/30 rounded-full p-1 border border-white/60"
                        disabled={quantity >= stock}
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <Button
                    variant="default"
                    className='w-full rounded-md'
                    onClick={async () => {
                        setIsAddingToCart(true);
                        await addToCart(plant, quantity, selectedVariant ? {
                            id: selectedVariant.id,
                            size: selectedVariant.size,
                            price: finalPrice
                        } : undefined);
                        setTimeout(() => setIsAddingToCart(false), 1000);
                    }}
                    disabled={isAddingToCart || isOutOfStock}
                    isLoading={isAddingToCart}
                >
                    Add to Cart
                </Button>

            </div>



            <Button
                variant="default"
                className='rounded-md w-full'
                onClick={() => {
                    window.open(WhatsAppService.generateBuyNowLink(plant), '_blank');
                }}
            >
                Buy on WhatsApp
            </Button>

            {/* Care & Fertilizing Info (Moved from Tabs) */}
            {/* Care & Fertilizing Info */}
            <div className="space-y-4 pt-2">
                {plant.careInstructions && (
                    <div className="bg-[var(--color-surface-hover)] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm hover:border-[var(--color-primary)]">
                        <h4 className="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                <Droplets size={18} />
                            </div>
                            Care Guide
                        </h4>
                        <ul className="space-y-3">
                            {plant.careInstructions.split('.').filter(line => line.trim().length > 0).map((line, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed group">
                                    <div className="mt-0.5 p-1 bg-blue-50 rounded-full text-blue-500 group-hover:bg-blue-100 transition-colors shrink-0">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                    <span>{line.trim()}.</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {plant.fertilizingInfo && (
                    <div className="bg-[var(--color-surface-hover)] p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm hover:border-[var(--color-primary)]">
                        <h4 className="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full text-green-600">
                                <Sprout size={18} />
                            </div>
                            Fertilizing Guide
                        </h4>
                        <ul className="space-y-3">
                            {plant.fertilizingInfo.includes('.') ? (
                                plant.fertilizingInfo.split('.').filter(line => line.trim().length > 0).map((line, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed group">
                                        <div className="mt-0.5 p-1 bg-green-50 rounded-full text-green-600 group-hover:bg-green-100 transition-colors shrink-0">
                                            <Sprout size={10} strokeWidth={3} />
                                        </div>
                                        <span>{line.trim()}.</span>
                                    </li>
                                ))
                            ) : (
                                <li className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed group">
                                    <div className="mt-0.5 p-1 bg-green-50 rounded-full text-green-600 group-hover:bg-green-100 transition-colors shrink-0">
                                        <Sprout size={10} strokeWidth={3} />
                                    </div>
                                    <span>{plant.fertilizingInfo}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div >
    );
};
