'use client';

import { WishlistItem as WishlistItemType } from '@/domain/entities/wishlist.entity';
import { Trash2, ShoppingBag } from 'lucide-react';
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

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(plant, 1);
    };

    if (viewMode === 'list') {
        return (
            <div className="flex gap-4 md:gap-8 p-4 md:p-6 bg-white rounded-[32px] border border-secondary/5 group relative shadow-sm hover:shadow-md transition-all duration-300">
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
                            <span className="text-[10px] md:text-xs font-bold text-[#4A5D54] tracking-widest uppercase">
                                {plant.categoryId || 'Indoor Plants'}
                            </span>
                            <h3 className="font-serif font-bold text-lg md:text-3xl text-[#1A2E26] leading-tight mt-1">{plant.name}</h3>
                            <p className="text-xs md:text-base text-[#4A5D54] leading-relaxed mt-2 line-clamp-2 max-w-xl">
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
                        <span className="font-serif font-bold text-xl md:text-3xl text-[#1A2E26]">
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
        <div className="group relative bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-secondary/5">
            <Link href={`/plants/${plant.id}`} className="block">
                <div className="aspect-square bg-[#FAF9F6] relative overflow-hidden">
                    {plant.images[0] && (
                        <img
                            src={plant.images[0]}
                            alt={plant.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    )}

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            removeFromWishlist(plant.id);
                        }}
                        className="absolute top-4 right-4 bg-[#FF4D4D] text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg active:scale-90"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="p-4 md:p-6">
                    <span className="text-[10px] font-bold text-[#4A5D54] tracking-widest uppercase">
                        {plant.categoryId || 'Indoor Plants'}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1A2E26] mt-1 line-clamp-1">{plant.name}</h3>

                    <div className="flex items-center justify-between mt-4">
                        <span className="font-serif font-bold text-lg text-[#1A2E26]">₹{plant.price}</span>
                        <button
                            onClick={handleAddToCart}
                            className="bg-[#D36E45] text-white p-2.5 rounded-xl hover:bg-[#B85A35] transition-all"
                        >
                            <ShoppingBag size={18} />
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};
