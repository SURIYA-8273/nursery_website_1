'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useFavoritesStore } from '@/presentation/store/favorites.store';
import { PlantCard } from '@/presentation/components/ui/plant-card';

export default function FavoritesPage() {
    const { favorites, isLoading, refreshFavorites } = useFavoritesStore();

    useEffect(() => {
        refreshFavorites();
    }, [refreshFavorites]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center">
                <h1 className="font-serif text-3xl font-bold text-primary">Your Wishlist is Empty</h1>
                <p className="text-text-secondary max-w-md">
                    Save your favorite plants here to keep track of what you love.
                </p>
                <Link
                    href="/"
                    className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-hover transition-colors shadow-lg"
                >
                    Explore Plants
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen max-w-7xl mx-auto p-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
                        Your Favorites
                    </h1>
                    <p className="text-text-secondary">
                        {favorites.length} {favorites.length === 1 ? 'plant' : 'plants'} saved
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {favorites.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} />
                ))}
            </div>
        </main>
    );
}
