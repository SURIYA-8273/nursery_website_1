'use client';

import { useState, useEffect } from 'react';
import { useWishlistStore } from '@/presentation/store/wishlist.store';
import { WishlistItem } from '@/presentation/components/features/wishlist-item';
import { Heart, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function WishlistClient() {
    const { wishlist, isLoading, refreshWishlist } = useWishlistStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#2D5A42] animate-spin" />
            </div>
        );
    }

    if (wishlist.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-6">
                    <Heart size={32} className="text-[#D36E45]" />
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#1A2E26] mb-4">Your Wishlist is Empty</h1>
                <p className="text-[#4A5D54] max-w-md mb-8">
                    Save your favorite plants to your wishlist and we'll keep them here for you until you're ready to grow your jungle.
                </p>
                <Link
                    href="/plants"
                    className="bg-[#2D5A42] text-white px-8 py-3 rounded-full hover:bg-[#234734] transition-all shadow-lg active:scale-95 font-bold"
                >
                    Explore Plants
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Header Section */}
            <header className="bg-[#FAF9F6] pt-24 md:pt-32 pb-12 md:pb-16 flex flex-col items-center justify-center text-center px-4">
                <div className="flex items-center gap-2 text-[#D36E45] mb-4 font-bold tracking-widest uppercase text-xs">
                    <Heart size={16} fill="currentColor" />
                    <span>Saved Items</span>
                </div>
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#1A2E26] mb-4">Your Wishlist</h1>
                <p className="text-[#4A5D54] font-medium opacity-80">
                    {wishlist.totalItems} {wishlist.totalItems === 1 ? 'plant' : 'plants'} saved
                </p>
            </header>

            {/* Controls & List Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex justify-end mb-8">
                    <div className="flex p-1 bg-[#FAF9F6] rounded-2xl border border-secondary/5">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'list' ? "bg-white shadow-sm text-[#2D5A42]" : "text-gray-400"
                            )}
                        >
                            <ListIcon size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'grid' ? "bg-white shadow-sm text-[#2D5A42]" : "text-gray-400"
                            )}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>

                <div className={cn(
                    "gap-6 md:gap-8",
                    viewMode === 'list' ? "grid grid-cols-1" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                )}>
                    {wishlist.items.map((item) => (
                        <WishlistItem
                            key={item.plant.id}
                            item={item}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
