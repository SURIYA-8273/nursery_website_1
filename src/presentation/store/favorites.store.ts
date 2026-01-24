import { create } from 'zustand';
import { Plant } from '@/domain/entities/plant.entity';
import { IFavoritesRepository, LocalFavoritesRepository } from '@/data/repositories/local-favorites.repository';

interface FavoritesState {
    favorites: Plant[];
    isLoading: boolean;
    toggleFavorite: (plant: Plant) => Promise<boolean>;
    refreshFavorites: () => Promise<void>;
    isFavorite: (plantId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => {
    const repository: IFavoritesRepository = new LocalFavoritesRepository();

    return {
        favorites: [],
        isLoading: true,

        refreshFavorites: async () => {
            set({ isLoading: true });
            const favorites = await repository.getFavorites();
            set({ favorites, isLoading: false });
        },

        toggleFavorite: async (plant: Plant) => {
            await repository.toggleFavorite(plant);
            await get().refreshFavorites();
            return get().favorites.some(p => p.id === plant.id);
        },

        isFavorite: (plantId: string) => {
            return get().favorites.some(p => p.id === plantId);
        },
    };
});
