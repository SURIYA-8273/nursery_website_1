import { Plant, Category } from '../entities/plant.entity';

export interface IPlantRepository {
    getPlants(params?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ plants: Plant[]; total: number }>;

    getPlantById(id: string): Promise<Plant | null>;

    getFeaturedPlants(): Promise<Plant[]>;

    getCategories(): Promise<Category[]>;

    createPlant(plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plant>;
    updatePlant(id: string, plant: Partial<Plant>): Promise<Plant>;
    deletePlant(id: string): Promise<void>;
}
