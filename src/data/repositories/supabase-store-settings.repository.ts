import { supabase } from '../datasources/supabase.client';

export interface StoreSettings {
    id?: number;
    business_name: string;
    instagram_id: string;
    mobile_number: string;
    address: string;
    logo_url?: string;
}

export class SupabaseStoreSettingsRepository {
    async getSettings(): Promise<StoreSettings | null> {
        const { data, error } = await supabase
            .from('store_settings')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching store settings:', error);
            return null;
        }

        return data as StoreSettings;
    }

    async updateSettings(settings: StoreSettings): Promise<StoreSettings | null> {
        // Check if settings exist, if not insert, else update.
        // Assuming single row. 
        // We can use upsert if we force an ID or check count.

        // First check if any row exists
        const existing = await this.getSettings();

        let result;
        if (existing) {
            const { data, error } = await supabase
                .from('store_settings')
                .update({
                    business_name: settings.business_name,
                    instagram_id: settings.instagram_id,
                    mobile_number: settings.mobile_number,
                    address: settings.address,
                    logo_url: settings.logo_url
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            result = data;
        } else {
            const { data, error } = await supabase
                .from('store_settings')
                .insert({
                    business_name: settings.business_name,
                    instagram_id: settings.instagram_id,
                    mobile_number: settings.mobile_number,
                    address: settings.address,
                    logo_url: settings.logo_url
                })
                .select()
                .single();

            if (error) throw error;
            result = data;
        }

        return result as StoreSettings;
    }

    async uploadLogo(file: File): Promise<string> {
        const fileName = `store-logo-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
            .from('plant-images') // Reusing existing bucket or create 'store-assets'
            .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('plant-images')
            .getPublicUrl(fileName);

        return publicUrl;
    }
}
