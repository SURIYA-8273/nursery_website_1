'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/data/datasources/supabase.client';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { Loader2, Save, Info } from 'lucide-react';
import { BusinessSettings } from '@/domain/entities/settings.entity';
import { toast } from 'sonner';
import { Input } from '@/presentation/components/admin/form/input';
import { TextArea } from '@/presentation/components/admin/form/text_area';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Button } from '@/presentation/components/admin/button';

export default function HomeContentPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [settings, setSettings] = useState<Partial<BusinessSettings>>({
        heroTitle: '',
        heroDescription: '',
        aboutUsDescription: '',
        aboutUsFeatures: []
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            if (data) {
                setSettings(data);
            }
            setFetching(false);
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const repo = new SupabaseSettingsRepository();
            await repo.updateSettings(settings);
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
                    <Heading1 headingClassName="text-xl" title="Hero Section" />
                    <div className="space-y-4">
                        <TextArea
                            label="Hero Title"
                            name="heroTitle"
                            value={settings.heroTitle || ''}
                            onChange={handleChange}
                            placeholder="A Beautiful Plant Is Like Having A Friend Around The House."
                            rows={3}
                        />
                        <TextArea
                            label="Hero Description"
                            name="heroDescription"
                            value={settings.heroDescription || ''}
                            onChange={handleChange}
                            placeholder="Discover everything you need to know about your plants..."
                            rows={3}
                        />
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
