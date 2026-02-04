import { IPlantRepository } from '../repositories/plant.repository';
import { Plant, Category } from '../entities/plant.entity';

export interface CatalogData {
    featuredPlants: Plant[];
    categories: Category[];
}

export class GetCatalogDataUseCase {
    constructor(private plantRepository: IPlantRepository) { }

    async execute(): Promise<CatalogData> {
        const [featuredPlants, categories] = await Promise.all([
            this.plantRepository.getFeaturedPlants(),
            this.plantRepository.getCategories()
        ]);
        return { featuredPlants, categories };
    }
}
