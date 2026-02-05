'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/data/datasources/supabase.client';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { Loader2, Save, Info, Trash2 } from 'lucide-react';
import { BusinessSettings } from '@/domain/entities/settings.entity';
import { toast } from 'react-toastify';
import { Input } from '@/presentation/components/admin/form/input';
import { TextArea } from '@/presentation/components/admin/form/text_area';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Button } from '@/presentation/components/admin/button';
import { ImagePicker } from '@/presentation/components/admin/form/image_picker';

export default function HomeContentPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [settings, setSettings] = useState<Partial<BusinessSettings>>({
        heroTitle: '',
        heroDescription: '',
        heroImage: '',
        heroBackgroundColor: '',
        heroShowBackgroundShape: true,
        aboutUsDescription: '',
        aboutUsFeatures: []
    });

    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [previewHeroImage, setPreviewHeroImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            if (data) {
                setSettings(data);
                if (data.heroImage) setPreviewHeroImage(data.heroImage);
            }
            setFetching(false);
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setHeroImageFile(file);
            setPreviewHeroImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveHeroImage = () => {
        setHeroImageFile(null);
        setPreviewHeroImage(null);
        setSettings(prev => ({ ...prev, heroImage: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let heroImageUrl = settings.heroImage;

            // Upload Hero Image if changed
            if (heroImageFile) {
                const fileExt = heroImageFile.name.split('.').pop();
                const fileName = `hero-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('common_images')
                    .upload(fileName, heroImageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('common_images')
                    .getPublicUrl(fileName);
                heroImageUrl = publicUrl;
            }

            const repo = new SupabaseSettingsRepository();
            await repo.updateSettings({
                ...settings,
                heroImage: heroImageUrl
            });
            toast.success('Content updated successfully!');
        } catch (error: any) {
            console.error(error);
            toast.error('Error updating content: ' + error.message);
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
                    title="Home Page Content"
                    description="Manage text and features for your home page."
                />
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-sm border border-black/30 space-y-8">

                {/* Hero Configuration */}
                <section className="space-y-6">
                    <Heading1 headingClassName="text-xl" title="Hero Section Configuration" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-black">Hero Image</label>
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <div className="w-full max-w-sm">
                                    {previewHeroImage ? (
                                        <div className="relative w-full h-full rounded-lg border-2 border-secondary/30 overflow-hidden bg-black/5 group">
                                            <img src={previewHeroImage} alt="Hero Preview" className="w-full h-full object-contain" />
                                            {/* Hover Overlay with Actions */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                {/* Change Button */}
                                                <div className="w-24 h-24 flex items-center justify-center">
                                                    <ImagePicker
                                                        handleImageChange={handleHeroImageChange}
                                                        title="Change"
                                                    />
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveHeroImage}
                                                    className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
                                                    title="Remove Image"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <ImagePicker
                                            handleImageChange={handleHeroImageChange}
                                            title="Upload Hero Image"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Hero Title"
                                name="heroTitle"
                                value={settings.heroTitle || ''}
                                onChange={handleChange}
                                placeholder="e.g. Bring Nature Home"
                            />
                            <TextArea
                                label="Hero Description"
                                name="heroDescription"
                                value={settings.heroDescription || ''}
                                onChange={handleChange}
                                placeholder="Short description..."
                                rows={2}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">Background Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            name="heroBackgroundColor"
                                            value={settings.heroBackgroundColor || '#22c55e'}
                                            onChange={handleChange}
                                            className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                                        />
                                        <span className="text-sm font-mono text-gray-500">{settings.heroBackgroundColor || '#22c55e'}</span>
                                    </div>
                                    <p className="text-xs text-black/60 mt-1">Select color or enter hex/rgba</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-black mb-1">Show Background Shape</label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="heroShowBackgroundShape"
                                                value="true"
                                                checked={settings.heroShowBackgroundShape === true}
                                                onChange={() => setSettings(prev => ({ ...prev, heroShowBackgroundShape: true }))}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="heroShowBackgroundShape"
                                                value="false"
                                                checked={settings.heroShowBackgroundShape === false}
                                                onChange={() => setSettings(prev => ({ ...prev, heroShowBackgroundShape: false }))}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">No</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Us Configuration */}
                <section className="space-y-6">
                    <Heading1 headingClassName="text-xl" title="About Us" />
                    <div className="space-y-4">
                        <TextArea
                            label="About Us Description"
                            name="aboutUsDescription"
                            value={settings.aboutUsDescription || ''}
                            onChange={handleChange}
                            placeholder="Tell your customers about your story..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Heading1 headingClassName="text-lg" title="Why Choose Us (Features)" />
                            <Button
                                type="button"
                                className="bg-[var(--color-primary)] text-white px-3 py-1 text-sm rounded-md"
                                onClick={() => {
                                    setSettings(prev => ({
                                        ...prev,
                                        aboutUsFeatures: [...(prev.aboutUsFeatures || []), { title: '', description: '' }]
                                    }));
                                }}
                            >
                                + Add Feature
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {settings.aboutUsFeatures?.map((feature, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 border border-black/30 rounded-md relative group">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            label="Feature Title"
                                            name={`feature_title_${index}`}
                                            value={feature.title}
                                            onChange={(e) => {
                                                const newFeatures = [...(settings.aboutUsFeatures || [])];
                                                newFeatures[index].title = e.target.value;
                                                setSettings(prev => ({ ...prev, aboutUsFeatures: newFeatures }));
                                            }}
                                            placeholder="e.g. Quality Plants"
                                        />
                                        <TextArea
                                            label="Description"
                                            name={`feature_desc_${index}`}
                                            value={feature.description}
                                            onChange={(e) => {
                                                const newFeatures = [...(settings.aboutUsFeatures || [])];
                                                newFeatures[index].description = e.target.value;
                                                setSettings(prev => ({ ...prev, aboutUsFeatures: newFeatures }));
                                            }}
                                            placeholder="Short description..."
                                            rows={2}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newFeatures = settings.aboutUsFeatures?.filter((_, i) => i !== index);
                                            setSettings(prev => ({ ...prev, aboutUsFeatures: newFeatures }));
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {(!settings.aboutUsFeatures || settings.aboutUsFeatures.length === 0) && (
                                <p className="text-sm text-gray-500 italic text-center py-4">No features added yet.</p>
                            )}
                        </div>
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
