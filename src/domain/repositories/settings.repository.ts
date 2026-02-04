import { BusinessSettings } from '../entities/settings.entity';

export interface ISettingsRepository {
    getSettings(): Promise<BusinessSettings | null>;
    updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings>;
}
