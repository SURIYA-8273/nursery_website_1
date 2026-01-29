'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/presentation/store/wishlist.store';
import { Plant } from '@/domain/entities/plant.entity';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    plant: Plant;
    className?: string;
    iconSize?: number;
}

export const FavoriteButton = ({ plant, className, iconSize = 20 }: Props) => {
    const { isInWishlist, addToWishlist, removeFromWishlist, refreshWishlist } = useWishlistStore();

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const active = isInWishlist(plant.id);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
            await removeFromWishlist(plant.id);
        } else {
            await addToWishlist(plant);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            className={cn(
                "rounded-full p-2 transition-all duration-300 transform active:scale-90 hover:bg-white/50",
                active ? "text-[#D36E45]" : "text-gray-400 hover:text-[#D36E45]",
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
