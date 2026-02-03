'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Building, Instagram, Phone, MapPin } from 'lucide-react';
import { SupabaseStoreSettingsRepository, StoreSettings } from '@/data/repositories/supabase-store-settings.repository';
import { Input } from '@/presentation/components/admin/form/input';
import { TextArea } from '@/presentation/components/admin/form/text_area';
import { ImagePicker } from '@/presentation/components/admin/form/image_picker';
import { Heading1 } from '@/presentation/components/admin/heading_1';

export function SettingsForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<StoreSettings>({
        business_name: '',
        instagram_id: '',
        mobile_number: '',
        address: '',
        logo_url: ''
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const repository = new SupabaseStoreSettingsRepository();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await repository.getSettings();
            if (data) {
                setSettings(data);
                if (data.logo_url) {
                    setPreviewUrl(data.logo_url);
                }
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let logoUrl = settings.logo_url;

            if (logoFile) {
                logoUrl = await repository.uploadLogo(logoFile);
            }

            const updatedSettings = {
                ...settings,
                logo_url: logoUrl
            };

            await repository.updateSettings(updatedSettings);

            // Reload to ensure sync
            await loadSettings();
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 bg-white p-6 rounded-xl shadow-sm border border-secondary/10">
            <Heading1
                title="Store Settings"
                description="Manage your store details and branding."
            />

            {/* Logo Upload */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-text-primary">Store Logo</label>
                <div className="flex items-center gap-6">
                    <div className="w-32 h-32">
                        {previewUrl ? (
                            <div className="relative w-full h-full rounded-lg border-2 border-secondary/30 overflow-hidden bg-surface">
                                <img src={previewUrl} alt="Store Logo" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImagePicker
                                        handleImageChange={handleLogoChange}
                                        title="Change"
                                    />
                                </div>
                            </div>
                        ) : (
                            <ImagePicker
                                handleImageChange={handleLogoChange}
                                title="Upload Logo"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <Input
                    label="Business Name"
                    name="business_name"
                    value={settings.business_name}
                    onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                    placeholder="My Awesome Nursery"
                    required
                    leadingIcon={<Building className="w-4 h-4 text-primary" />}
                />

                <Input
                    label="Instagram ID"
                    name="instagram_id"
                    value={settings.instagram_id}
                    onChange={(e) => setSettings({ ...settings, instagram_id: e.target.value })}
                    placeholder="username"
                    leadingIcon={<Instagram className="w-4 h-4 text-primary" />}
                />

                <Input
                    label="Mobile Number"
                    name="mobile_number"
                    value={settings.mobile_number}
                    onChange={(e) => setSettings({ ...settings, mobile_number: e.target.value })}
                    placeholder="+91 98765 43210"
                    leadingIcon={<Phone className="w-4 h-4 text-primary" />}
                />

                <TextArea
                    label="Store Address"
                    name="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    placeholder="123 Green Street, Garden City..."
                    leadingIcon={<MapPin className="w-4 h-4 text-primary" />}
                    rows={4}
                />
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white hover:bg-black/90 active:scale-95 transition-all rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
