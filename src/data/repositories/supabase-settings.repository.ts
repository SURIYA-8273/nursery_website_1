import { BusinessSettings } from '@/domain/entities/settings.entity';
import { supabase } from '../datasources/supabase.client';

export class SupabaseSettingsRepository {

    async getSettings(): Promise<BusinessSettings | null> {
        const { data, error } = await supabase
            .from('settings')
            .select('*');

        if (error) return null; // Or throw

        // Default empty settings
        const settings: BusinessSettings = {
            id: 'global', // KV store doesn't really have a single row ID
            businessName: '',
            updatedAt: new Date()
        };

        // Map KV rows to entity
        data.forEach((row: any) => {
            switch (row.setting_key) {
                // ... other cases
                case 'business_name':
                    settings.businessName = row.setting_value;
                    break;
                case 'logo_url':
                    settings.logoUrl = row.setting_value;
                    break;
                case 'instagram_url':
                    settings.instagramUrl = row.setting_value;
                    break;
                case 'mobile_number':
                    settings.mobileNumber = row.setting_value;
                    break;
                case 'secondary_number':
                    settings.secondaryNumber = row.setting_value;
                    break;
                case 'whatsapp_number':
                    settings.whatsappNumber = row.setting_value;
                    break;
                case 'email':
                    settings.email = row.setting_value;
                    break;
                case 'address':
                    settings.address = row.setting_value;
                    break;
                case 'facebook_url':
                    settings.facebookUrl = row.setting_value;
                    break;
                case 'youtube_url':
                    settings.youtubeUrl = row.setting_value;
                    break;
                case 'map_url':
                    settings.mapUrl = row.setting_value;
                    break;
                case 'map_embed_url':
                    settings.mapEmbedUrl = row.setting_value;
                    break;
                case 'store_hours':
                    settings.storeHours = row.setting_value;
                    break;
                case 'hero_title':
                    settings.heroTitle = row.setting_value;
                    break;
                case 'hero_description':
                    settings.heroDescription = row.setting_value;
                    break;
                case 'hero_image':
                    settings.heroImage = row.setting_value;
                    break;
                case 'hero_background_color':
                    settings.heroBackgroundColor = row.setting_value;
                    break;
                case 'hero_show_background_shape':
                    settings.heroShowBackgroundShape = row.setting_value === 'true';
                    break;
                case 'about_us_description':
                    settings.aboutUsDescription = row.setting_value;
                    break;
                case 'about_us_features':
                    try {
                        settings.aboutUsFeatures = JSON.parse(row.setting_value);
                    } catch (e) {
                        console.error('Failed to parse about_us_features', e);
                        settings.aboutUsFeatures = [];
                    }
                    break;
            }

            // Map gallery images
            if (row.setting_key.startsWith('gallery_image_')) {
                const index = parseInt(row.setting_key.split('_')[2]) - 1;
                if (!settings.galleryImages) settings.galleryImages = [];
                try {
                    settings.galleryImages[index] = JSON.parse(row.setting_value);
                } catch (e) {
                    console.error('Failed to parse gallery image', e);
                }
            }
        });

        // Ensure array has 6 slots even if empty
        if (!settings.galleryImages) {
            settings.galleryImages = new Array(6).fill(null);
        } else {
            // Fill holes if any
            for (let i = 0; i < 6; i++) {
                if (!settings.galleryImages[i]) settings.galleryImages[i] = null as any;
            }
        }

        return settings;
    }

    async saveGalleryImage(index: number, image: any): Promise<void> {
        const key = `gallery_image_${index + 1}`;
        const { error } = await supabase.from('settings').upsert({
            setting_key: key,
            setting_value: JSON.stringify(image),
            setting_type: 'text',
            updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' });

        if (error) throw error;
    }

    async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
        const updates: PromiseLike<any>[] = [];

        // Helper to queue upsert
        const queueUpdate = (key: string, value: string | undefined, type: string) => {
            if (value !== undefined) {
                updates.push(supabase.from('settings').upsert({
                    setting_key: key,
                    setting_value: value,
                    setting_type: type,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'setting_key' }).then());
            }
        };

        queueUpdate('business_name', settings.businessName, 'text');
        queueUpdate('logo_url', settings.logoUrl, 'url');
        queueUpdate('instagram_url', settings.instagramUrl, 'url');
        queueUpdate('facebook_url', settings.facebookUrl, 'url');
        queueUpdate('youtube_url', settings.youtubeUrl, 'url');

        queueUpdate('mobile_number', settings.mobileNumber, 'phone');
        queueUpdate('secondary_number', settings.secondaryNumber, 'phone');
        queueUpdate('whatsapp_number', settings.whatsappNumber, 'phone');

        queueUpdate('email', settings.email, 'email');
        queueUpdate('address', settings.address, 'text');
        queueUpdate('map_url', settings.mapUrl, 'url');
        queueUpdate('map_embed_url', settings.mapEmbedUrl, 'url');
        queueUpdate('store_hours', settings.storeHours, 'text');

        queueUpdate('hero_title', settings.heroTitle, 'text');
        queueUpdate('hero_description', settings.heroDescription, 'text');
        queueUpdate('hero_image', settings.heroImage, 'image');
        queueUpdate('hero_background_color', settings.heroBackgroundColor, 'text');

        if (settings.heroShowBackgroundShape !== undefined) {
            queueUpdate('hero_show_background_shape', String(settings.heroShowBackgroundShape), 'boolean');
        }

        queueUpdate('about_us_description', settings.aboutUsDescription, 'text');

        if (settings.aboutUsFeatures) {
            queueUpdate('about_us_features', JSON.stringify(settings.aboutUsFeatures), 'text');
        }

        await Promise.all(updates);

        const fresh = await this.getSettings();
        if (!fresh) throw new Error('Failed to retrieve settings after update');
        return fresh;
    }
}

