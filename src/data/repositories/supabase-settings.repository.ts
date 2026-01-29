import { BusinessSettings } from '@/domain/entities/settings.entity';
import { supabase } from '../datasources/supabase.client';

export class SupabaseSettingsRepository {
    private readonly SINGLETON_ID = '1';

    async getSettings(): Promise<BusinessSettings | null> {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', this.SINGLETON_ID)
            .single();

        if (error || !data) return null;

        return this._mapToEntity(data);
    }

    async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
        const updates: any = { updated_at: new Date().toISOString() };

        if (settings.businessName !== undefined) updates.business_name = settings.businessName;
        if (settings.logoUrl !== undefined) updates.logo_url = settings.logoUrl;
        if (settings.instagramUrl !== undefined) updates.instagram_url = settings.instagramUrl;
        if (settings.mobileNumber !== undefined) updates.mobile_number = settings.mobileNumber;
        if (settings.address !== undefined) updates.address = settings.address;

        // Upsert logic: try to update, if not found (and using fixed ID), insert?
        // Actually for simplicity, let's assume specific ID '1' exists or we create it.
        // We'll use upsert with the ID.

        const { data, error } = await supabase
            .from('settings')
            .upsert({ id: this.SINGLETON_ID, ...updates })
            .select()
            .single();

        if (error) throw error;

        return this._mapToEntity(data);
    }

    private _mapToEntity(row: any): BusinessSettings {
        return {
            id: row.id,
            businessName: row.business_name,
            logoUrl: row.logo_url,
            instagramUrl: row.instagram_url,
            mobileNumber: row.mobile_number,
            address: row.address,
            updatedAt: new Date(row.updated_at),
        };
    }
}
