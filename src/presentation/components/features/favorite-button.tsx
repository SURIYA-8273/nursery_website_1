'use client';

import { useEffect, useState } from 'react';
import { useFavoritesStore } from '@/presentation/store/favorites.store';
import { Plant } from '@/domain/entities/plant.entity';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    plant: Plant;
    className?: string;
    iconSize?: number;
}

export const FavoriteButton = ({ plant, className, iconSize = 20 }: Props) => {
    const { isFavorite, toggleFavorite, refreshFavorites } = useFavoritesStore();
    // The `mounted` state and its `useEffect` are removed as per instruction.
    // `refreshFavorites` is still called on mount to ensure store is up-to-date.
    useEffect(() => {
        refreshFavorites();
    }, [refreshFavorites]);


    const active = isFavorite(plant.id);

    return (
        <button
            onClick={(e) => {
                e.preventDefault(); // Prevent navigating if inside a card link
                e.stopPropagation();
                toggleFavorite(plant);
            }}
            className={cn(
                "rounded-full p-2 transition-all duration-300 transform active:scale-90 hover:bg-white/50",
                active ? "text-red-500" : "text-gray-400 hover:text-red-400",
                className
            )}
        >
            <Heart
                size={iconSize}
                fill={active ? "currentColor" : "none"}
                className={cn("transition-all", active && "animate-pulse-once")}
            />
        </button>
    );
};
