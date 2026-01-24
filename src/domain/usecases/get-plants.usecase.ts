import { IPlantRepository } from '../repositories/plant.repository';
import { Plant } from '../entities/plant.entity';

export class GetPlantsUseCase {
    constructor(private plantRepository: IPlantRepository) { }

    async execute(params?: { category?: string; search?: string }): Promise<Plant[]> {
        const { plants } = await this.plantRepository.getPlants(params);
        return plants;
    }
}
