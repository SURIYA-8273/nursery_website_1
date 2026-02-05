'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Wishlist, WishlistItem } from '@/domain/entities/wishlist.entity';
import { LocalWishlistRepository } from '@/data/repositories/local-wishlist.repository';
import { Plant } from '@/domain/entities/plant.entity';
import { toast } from 'react-toastify';

interface WishlistContextType {
    wishlist: Wishlist;
    isLoading: boolean;
    addToWishlist: (plant: Plant) => Promise<void>;
    removeFromWishlist: (plantId: string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    refreshWishlist: () => Promise<void>;
    isInWishlist: (plantId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);


export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const repository = useMemo(() => new LocalWishlistRepository(), []);
    const [wishlist, setWishlist] = useState<Wishlist>({ items: [], totalItems: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const refreshWishlist = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await repository.getWishlist();
            setWishlist(data);
        } catch (error) {
            console.error("Failed to load wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [repository]);

    const addToWishlist = useCallback(async (plant: Plant) => {
        try {
            await repository.addItem({
                plant,
                addedAt: new Date()
            });
            await refreshWishlist();
            toast.success('Added to wishlist');
        } catch (error) {
            console.error("Failed to add to wishlist:", error);
            toast.error('Failed to add to wishlist');
        }
    }, [repository, refreshWishlist]);

    const removeFromWishlist = useCallback(async (plantId: string) => {
        try {
            await repository.removeItem(plantId);
            await refreshWishlist();
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
            toast.error('Failed to remove from wishlist');
        }
    }, [repository, refreshWishlist]);

    const clearWishlist = useCallback(async () => {
        try {
            await repository.clearWishlist();
            setWishlist({ items: [], totalItems: 0 });
            toast.success('Wishlist cleared');
        } catch (error) {
            console.error("Failed to clear wishlist:", error);
        }
    }, [repository]);

    const isInWishlist = useCallback((plantId: string) => {
        return wishlist.items.some(item => item.plant.id === plantId);
    }, [wishlist.items]);

    // Initial load
    useEffect(() => {
        refreshWishlist();

        // Listen for cross-tab or external updates if the repo emits events (LocalWishlistRepository does emit 'wishlist-updated')
        const handleWishlistUpdated = () => {
            refreshWishlist();
        };

        window.addEventListener('wishlist-updated', handleWishlistUpdated);
        return () => {
            window.removeEventListener('wishlist-updated', handleWishlistUpdated);
        };
    }, [refreshWishlist]);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            isLoading,
            addToWishlist,
            removeFromWishlist,
            clearWishlist,
            refreshWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
