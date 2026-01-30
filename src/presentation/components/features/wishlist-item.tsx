'use client';

import { useState } from 'react';
import { WishlistItem as WishlistItemType } from '@/domain/entities/wishlist.entity';
import { Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '@/presentation/store/cart.store';
import { useWishlistStore } from '@/presentation/store/wishlist.store';
import Link from 'next/link';

interface WishlistItemProps {
    item: WishlistItemType;
    viewMode: 'grid' | 'list';
}

export const WishlistItem = ({ item, viewMode }: WishlistItemProps) => {
    const { addToCart } = useCartStore();
    const { removeFromWishlist } = useWishlistStore();
    const { plant } = item;
    const { price, discountPrice } = plant;

    const [isRemoving, setIsRemoving] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

    // Basic isNew logic - if created within last 30 days
    const isNew = plant.createdAt ? (Date.now() - new Date(plant.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000 : false;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMoving(true);
        await addToCart(plant, 1);
        setIsMoving(false);
    };

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsRemoving(true);
        await removeFromWishlist(plant.id);
        setIsRemoving(false);
    };

    // Alias for the handleAddToCart to match grid view usage
    const handleMoveToCart = handleAddToCart;

    if (viewMode === 'list') {
        return (
            <div className="flex gap-4 md:gap-8 p-2 md:p-6 bg-[var(--color-surface-hover)] rounded-[10px] border border-black/10 shadow-sm  group relative shadow-sm hover:shadow-md transition-all duration-300">
                {/* Image */}
                <div className="w-32 h-32 md:w-48 md:h-48 bg-[#FAF9F6] rounded-2xl md:rounded-[24px] overflow-hidden shrink-0 relative">
                    {plant.images[0] && (
                        <img
                            src={plant.images[0]}
                            alt={plant.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    )}
                    {/* Bestseller/Sale badge if you have them in data */}
                    {/* This can be extended later */}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col pt-1 md:pt-2">
                    <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">

                            <h3 className="font-serif font-bold text-lg md:text-3xl text-[var(--color-text-primary)] leading-tight mt-1">{plant.name}</h3>
                            <p className="text-xs md:text-base text-[var(--color-text-secondary)] leading-relaxed mt-2 line-clamp-2 max-w-xl">
                                {plant.description || 'The iconic plant with beautiful leaves.'}
                            </p>
                        </div>
                        <button
                            onClick={() => removeFromWishlist(plant.id)}
                            className="bg-[#FF4D4D] text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-sm active:scale-95"
                            title="Remove from wishlist"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="font-serif font-bold text-xl md:text-3xl text-[var(--color-text-primary)]">
                            ₹{plant.price}
                        </span>

                        <button
                            onClick={handleAddToCart}
                            className="bg-[#D36E45] text-white p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-[#B85A35] transition-all shadow-md active:scale-95 flex items-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            <span className="hidden md:inline font-bold">Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div className="group relative bg-[var(--color-surface-hover)] rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-white/5 p-2">
            <Link href={`/plants/${plant.id}`} className="block">
                <div className="aspect-square bg-[var(--color-surface)] relative overflow-hidden">
                    {plant.images[0] && (
                        <img
                            src={plant.images[0]}
                            alt={plant.name}
                            className="w-full rounded-[10px] h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                        {isNew && (
                            <span className="bg-[#2D5A42] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                New
                            </span>
                        )}
                        {plant.discountPrice && (
                            <span className="bg-[#D36E45] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm ml-1">
                                Sale
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-4 md:p-6">

                    <h3 className="font-serif font-bold text-lg text-[var(--color-text-primary)] mt-1 line-clamp-1">{plant.name}</h3>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-[var(--color-text-primary)]">₹{Number(discountPrice || price).toFixed(2)}</span>
                            {discountPrice && (
                                <span className="text-xs text-[var(--color-text-muted)] line-through">₹{Number(price).toFixed(2)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-full text-red-400 hover:bg-white/20 transition-all z-20"
            >
                {isRemoving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>

            <button
                onClick={handleMoveToCart}
                disabled={isMoving}
                className="absolute bottom-4 right-4 bg-[#D36E45] text-white p-2 rounded-full shadow-lg hover:bg-[#B85C36] transition-all transform active:scale-95 z-20"
            >
                {isMoving ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
            </button>
        </div>
    );
};
