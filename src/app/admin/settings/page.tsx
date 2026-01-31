'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/data/datasources/supabase.client';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { Loader2, Save, Upload, Info } from 'lucide-react';
import { BusinessSettings } from '@/domain/entities/settings.entity';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [settings, setSettings] = useState<Partial<BusinessSettings>>({
        businessName: '',
        instagramUrl: '',
        mobileNumber: '',
        address: '',
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            if (data) {
                setSettings(data);
                if (data.logoUrl) setPreviewLogo(data.logoUrl);
            }
            setFetching(false);
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let logoUrl = settings.logoUrl;

            // 1. Upload Logo if changed
            if (logoFile) {
                const fileName = `logo-${Date.now()}`;
                const { error: uploadError } = await supabase.storage
                    .from('app-assets') // Assuming 'app-assets' bucket exists, or use 'plants' for now if specific bucket not ready
                    .upload(fileName, logoFile);

                if (uploadError) {
                    // Fallback to 'plants' bucket if 'app-assets' doesn't exist/fails
                    // Ideally check bucket existence but let's try standard path
                    const { error: retryError } = await supabase.storage
                        .from('plants')
                        .upload(`settings/${fileName}`, logoFile);

                    if (retryError) throw retryError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('plants')
                        .getPublicUrl(`settings/${fileName}`);
                    logoUrl = publicUrl;
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('app-assets')
                        .getPublicUrl(fileName);
                    logoUrl = publicUrl;
                }
            }

            // 2. Update Settings
            const repo = new SupabaseSettingsRepository();
            await repo.updateSettings({
                ...settings,
                logoUrl,
            });

            alert('Settings updated successfully!');

        } catch (error: any) {
            console.error(error);
            alert('Error updating settings: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-primary">Business Settings</h1>
                <p className="text-text-secondary mt-2">Manage your app's global configuration.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-secondary/10 space-y-8">

                {/* Branding Section */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-primary border-b border-secondary/10 pb-2">Branding</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-text-secondary">App Logo</label>
                            <div className="flex flex-col gap-4">
                                {previewLogo && (
                                    <div className="w-32 h-32 bg-gray-50 rounded-xl border border-secondary/20 flex items-center justify-center p-2 overflow-hidden relative group">
                                        <img src={previewLogo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-secondary/30 rounded-xl hover:bg-surface/50 transition-colors cursor-pointer text-text-secondary hover:text-primary">
                                    <Upload size={20} />
                                    <span className="text-sm font-medium">Change Logo</span>
                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary">Business Name</label>
                                <input
                                    name="businessName"
                                    value={settings.businessName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    placeholder="e.g. Inner Loop Technologies"
                                />
                            </div>
                            <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex gap-3">
                                <Info className="shrink-0 mt-0.5" size={18} />
                                <p>Used in invoices, page titles, and footers.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-primary border-b border-secondary/10 pb-2">Contact Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-secondary">Mobile Number</label>
                            <input
                                name="mobileNumber"
                                value={settings.mobileNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-secondary">Instagram URL</label>
                            <input
                                name="instagramUrl"
                                value={settings.instagramUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-text-secondary">Store Address</label>
                            <textarea
                                name="address"
                                rows={3}
                                value={settings.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                                placeholder="123 Plant Street, Green City..."
                            />
                        </div>
                    </div>
                </section>

                <div className="pt-4 border-t border-secondary/10 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-soft active:scale-95 transition-all text-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

            </form>
        </div>
    );
}
