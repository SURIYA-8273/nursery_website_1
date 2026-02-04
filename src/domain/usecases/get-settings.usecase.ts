import { ISettingsRepository } from '../repositories/settings.repository';
import { BusinessSettings } from '../entities/settings.entity';

export class GetSettingsUseCase {
    constructor(private settingsRepository: ISettingsRepository) { }

    async execute(): Promise<Partial<BusinessSettings> | null> {
        return await this.settingsRepository.getSettings();
    }
}
