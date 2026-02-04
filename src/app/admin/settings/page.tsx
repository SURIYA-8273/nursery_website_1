'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/data/datasources/supabase.client';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { Loader2, Save, Upload, Info, Building, Instagram, Phone, MapPin, Mail, Globe, Facebook, Youtube } from 'lucide-react';
import { BusinessSettings } from '@/domain/entities/settings.entity';
import { toast } from 'react-toastify';
import { Input } from '@/presentation/components/admin/form/input';
import { TextArea } from '@/presentation/components/admin/form/text_area';
import { ImagePicker } from '@/presentation/components/admin/form/image_picker';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Button } from '@/presentation/components/admin/button';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [settings, setSettings] = useState<Partial<BusinessSettings>>({
        businessName: '',
        instagramUrl: '',
        mobileNumber: '',
        address: '',
        mapUrl: '',
        mapEmbedUrl: '',
        secondaryNumber: '',
        whatsappNumber: '',
        email: '',
        facebookUrl: '',
        youtubeUrl: '',
        storeHours: ''
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

        // Validation
        if (!settings.businessName || !settings.mobileNumber || !settings.whatsappNumber || !settings.address || !settings.mapUrl || !settings.instagramUrl || !settings.mapEmbedUrl) {
            toast.error('Please fill in all required fields.');
            return;
        }

        if (!settings.logoUrl && !logoFile && !previewLogo) {
            toast.error('Store Logo is required.');
            return;
        }

        setLoading(true);

        try {
            let logoUrl = settings.logoUrl;

            // 1. Upload Logo if changed
            if (logoFile) {
                const fileName = `logo-${Date.now()}`;
                const { error: uploadError } = await supabase.storage
                    .from('common_images')
                    .upload(fileName, logoFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('common_images')
                    .getPublicUrl(fileName);
                logoUrl = publicUrl;
            }

            // 2. Update Settings
            const repo = new SupabaseSettingsRepository();
            await repo.updateSettings({
                ...settings,
                logoUrl,
            });

            toast.success('Settings updated successfully!');

        } catch (error: any) {
            console.error(error);
            toast.error('Error updating settings: ' + error.message);
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
            <div className="mb-4">
                <Heading1
                    title="Business Settings"
                    description="Manage your app's global configuration."
                />
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-sm border border-black/30 space-y-8">

                {/* Branding Section */}
                <section className="space-y-6">

                    <Heading1
                        title="Branding" headingClassName='text-xl'

                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-black">Store Logo <span className="text-red-500">*</span></label>
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <div className="w-32 h-32">
                                    {previewLogo ? (
                                        <div className="relative w-full h-full rounded-lg border-2 border-secondary/30 overflow-hidden bg-black/30 group">
                                            <img src={previewLogo} alt="Logo Preview" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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

                        <div className="">
                            <div className="">
                                <Input
                                    label="Business Name"
                                    name="businessName"
                                    value={settings.businessName || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Inner Loop Technologies"
                                    leadingIcon={<Building className="w-4 h-4 text-primary" />}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </section>


                {/* Contact Information */}
                <section className="space-y-6">

                    <Heading1
                        headingClassName="text-xl"
                        title="Contact Information"

                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                            label="Primary Mobile Number"
                            name="mobileNumber"
                            value={settings.mobileNumber || ''}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            leadingIcon={<Phone className="w-4 h-4 text-primary" />}
                            required
                        />

                        <Input
                            label="Secondary Mobile Number"
                            name="secondaryNumber"
                            value={settings.secondaryNumber || ''}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            leadingIcon={<Phone className="w-4 h-4 text-primary" />}
                        />

                        <Input
                            label="WhatsApp Number"
                            name="whatsappNumber"
                            value={settings.whatsappNumber || ''}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            leadingIcon={<Phone className="w-4 h-4 text-primary" />}
                            required
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={settings.email || ''}
                            onChange={handleChange}
                            placeholder="contact@example.com"
                            leadingIcon={<Mail className="w-4 h-4 text-primary" />}
                        />

                        <div className="md:col-span-2 space-y-2">
                            <TextArea
                                label="Store Address"
                                name="address"
                                value={settings.address || ''}
                                onChange={handleChange}
                                placeholder="123 Plant Street, Green City..."
                                leadingIcon={<MapPin className="w-4 h-4 text-primary" />}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Input
                                label="Store Hours"
                                name="storeHours"
                                value={settings.storeHours || ''}
                                onChange={handleChange}
                                placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                                leadingIcon={<Building className="w-4 h-4 text-primary" />}
                            />
                        </div>
                    </div>
                </section>

                {/* Map Settings */}
                <section className="">

                    <Heading1
                        headingClassName="text-xl"
                        title="Map Configuration"

                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="">
                            <Input
                                label="Map Link"
                                name="mapUrl"
                                value={settings.mapUrl || ''}
                                onChange={handleChange}
                                placeholder="https://maps.app.goo.gl/..."
                                leadingIcon={<Globe className="w-4 h-4 text-primary" />}
                                required
                            />
                            <p className="text-xs text-black/60 ">Used for the 'Open in Google Maps' button.</p>
                        </div>
                        <div className="">
                            <Input
                                label="Map Embed URL (src)"
                                name="mapEmbedUrl"
                                value={settings.mapEmbedUrl || ''}
                                onChange={handleChange}
                                placeholder="https://maps.google.com/maps?q=..."
                                leadingIcon={<Globe className="w-4 h-4 text-primary" />}
                                required
                            />
                            <p className="text-xs text-black/60 ">The 'src' attribute for the iframe.</p>
                        </div>
                    </div>
                </section>

                {/* Social Media */}
                <section className="">


                    <Heading1
                        headingClassName="text-xl"
                        title="Social Media"

                    />


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                            label="Instagram Link"
                            name="instagramUrl"
                            value={settings.instagramUrl || ''}
                            onChange={handleChange}
                            placeholder="https://instagram.com/..."
                            leadingIcon={<Instagram className="w-4 h-4 text-primary" />}
                            required
                        />

                        <Input
                            label="Facebook URL"
                            name="facebookUrl"
                            value={settings.facebookUrl || ''}
                            onChange={handleChange}
                            placeholder="https://facebook.com/..."
                            leadingIcon={<Facebook className="w-4 h-4 text-primary" />}
                        />

                        <Input
                            label="YouTube URL"
                            name="youtubeUrl"
                            value={settings.youtubeUrl || ''}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                            leadingIcon={<Youtube className="w-4 h-4 text-primary" />}
                        />
                    </div>
                </section>

                <Button
                    type="submit"

                    className='w-full'

                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>



            </form>
        </div>
    );
}
