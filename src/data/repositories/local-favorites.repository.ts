import { Plant } from '@/domain/entities/plant.entity';

const FAVORITES_STORAGE_KEY = 'plant_shop_favorites';

export interface IFavoritesRepository {
    getFavorites(): Promise<Plant[]>;
    toggleFavorite(plant: Plant): Promise<boolean>; // Returns true if added, false if removed
    isFavorite(plantId: string): Promise<boolean>;
}

export class LocalFavoritesRepository implements IFavoritesRepository {
    async getFavorites(): Promise<Plant[]> {
        if (typeof window === 'undefined') return [];

        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    async toggleFavorite(plant: Plant): Promise<boolean> {
        const favorites = await this.getFavorites();
        const exists = favorites.some(p => p.id === plant.id);
        let newFavorites;
        let added = false;

        if (exists) {
            newFavorites = favorites.filter(p => p.id !== plant.id);
            added = false;
        } else {
            newFavorites = [...favorites, plant];
            added = true;
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
            window.dispatchEvent(new Event('favorites-updated'));
        }
        return added;
    }

    async isFavorite(plantId: string): Promise<boolean> {
        const favorites = await this.getFavorites();
        return favorites.some(p => p.id === plantId);
    }
}
