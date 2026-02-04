import { supabase } from '../datasources/supabase.client';

export interface StoreSettings {
    id?: number;
    business_name: string;
    instagram_url: string; // Renamed from instagram_id
    mobile_number: string;
    whatsapp_number: string; // New
    address: string;
    map_url: string; // New
    logo_url?: string;
    store_hours?: string; // New
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
                    instagram_url: settings.instagram_url,
                    mobile_number: settings.mobile_number,
                    whatsapp_number: settings.whatsapp_number,
                    address: settings.address,
                    map_url: settings.map_url,
                    logo_url: settings.logo_url,
                    store_hours: settings.store_hours
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
                    instagram_url: settings.instagram_url,
                    mobile_number: settings.mobile_number,
                    whatsapp_number: settings.whatsapp_number,
                    address: settings.address,
                    map_url: settings.map_url,
                    logo_url: settings.logo_url,
                    store_hours: settings.store_hours
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
