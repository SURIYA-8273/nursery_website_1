'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Upload, Building, Instagram, Phone, MapPin } from 'lucide-react';
import { SupabaseStoreSettingsRepository, StoreSettings } from '@/data/repositories/supabase-store-settings.repository';

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
            <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-black">Store Settings</h2>
                <p className="text-secondary">Manage your store details and branding.</p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-text-primary">Store Logo</label>
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-secondary/30 flex items-center justify-center overflow-hidden bg-surface group hover:border-primary/50 transition-colors">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Store Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Upload className="w-8 h-8 text-secondary group-hover:text-primary transition-colors" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-black">Upload new logo</p>
                        <p className="text-xs text-secondary">Recommended size: 500x500px. JPG, PNG allowed.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Business Name */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                        <Building className="w-4 h-4 text-primary" />
                        Business Name
                    </label>
                    <input
                        type="text"
                        value={settings.business_name}
                        onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-secondary/50"
                        placeholder="My Awesome Nursery"
                        required
                    />
                </div>

                {/* Instagram ID */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                        <Instagram className="w-4 h-4 text-primary" />
                        Instagram ID
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">@</span>
                        <input
                            type="text"
                            value={settings.instagram_id}
                            onChange={(e) => setSettings({ ...settings, instagram_id: e.target.value })}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-secondary/50"
                            placeholder="username"
                        />
                    </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                        <Phone className="w-4 h-4 text-primary" />
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        value={settings.mobile_number}
                        onChange={(e) => setSettings({ ...settings, mobile_number: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-secondary/50"
                        placeholder="+91 98765 43210"
                    />
                </div>

                {/* Address */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                        <MapPin className="w-4 h-4 text-primary" />
                        Store Address
                    </label>
                    <textarea
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-secondary/50 min-h-[100px] resize-none"
                        placeholder="123 Green Street, Garden City..."
                    />
                </div>
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
