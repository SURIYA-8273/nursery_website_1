'use client';

import { useState, useEffect } from 'react';
import { useWishlist } from '@/presentation/context/wishlist-context';
import { WishlistItem } from '@/presentation/components/features/wishlist-item';
import { Heart, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Heading } from '@/presentation/components/home/heading';

export function WishlistClient() {
    const { wishlist, isLoading } = useWishlist();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-[#2D5A42] animate-spin" />
            </div>
        );
    }

    if (wishlist.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center mt-30 p-4 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mb-6">
                    <Heart size={32} className="text-[#D36E45]" />
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">Your Wishlist is Empty</h1>
                <p className="text-[var(--color-text-secondary)] max-w-md mb-8">
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
        <main className="min-h-screen bg-[var(--color-surface)]">
            <div className='mb-4'></div>


            {/* Header Section */}
            <Heading title="Your Wishlist" subtitle={`${wishlist.totalItems} ${wishlist.totalItems === 1 ? 'plant' : 'plants'} saved`} />

            {/* Controls & List Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 md:py-10">
                <div className="flex justify-end mb-4">
                    <div className="flex p-1 bg-[var(--color-surface-hover)] rounded-2xl border border-white/5">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'list' ? "bg-[var(--color-primary)] shadow-sm text-white" : "text-[var(--color-text-muted)]"
                            )}
                        >
                            <ListIcon size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                viewMode === 'grid' ? "bg-[var(--color-primary)] shadow-sm text-white" : "text-[var(--color-text-muted)]"
                            )}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>

                <div className={cn(
                    "gap-2 md:gap-6",
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
