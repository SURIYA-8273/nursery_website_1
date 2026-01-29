import { create } from 'zustand';
import { Wishlist, WishlistItem } from '@/domain/entities/wishlist.entity';
import { IWishlistRepository } from '@/domain/repositories/wishlist.repository';
import { LocalWishlistRepository } from '@/data/repositories/local-wishlist.repository';
import { Plant } from '@/domain/entities/plant.entity';

interface WishlistState {
    wishlist: Wishlist;
    isLoading: boolean;
    addToWishlist: (plant: Plant) => Promise<void>;
    removeFromWishlist: (plantId: string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    refreshWishlist: () => Promise<void>;
    isInWishlist: (plantId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => {
    const repository: IWishlistRepository = new LocalWishlistRepository();

    return {
        wishlist: { items: [], totalItems: 0 },
        isLoading: true,

        refreshWishlist: async () => {
            set({ isLoading: true });
            const wishlist = await repository.getWishlist();
            set({ wishlist, isLoading: false });
        },

        addToWishlist: async (plant: Plant) => {
            await repository.addItem({
                plant,
                addedAt: new Date()
            });
            await get().refreshWishlist();
        },

        removeFromWishlist: async (plantId: string) => {
            await repository.removeItem(plantId);
            await get().refreshWishlist();
        },

        clearWishlist: async () => {
            await repository.clearWishlist();
            set({ wishlist: { items: [], totalItems: 0 } });
        },

        isInWishlist: (plantId: string) => {
            return get().wishlist.items.some(item => item.plant.id === plantId);
        }
    };
});
