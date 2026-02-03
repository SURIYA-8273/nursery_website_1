'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { BusinessSettings, GalleryImage } from '@/domain/entities/settings.entity';
import { supabase } from '@/data/datasources/supabase.client';
import { Loader2, ArrowLeft, Upload, Save, Trash, Link } from 'lucide-react';
import { Button } from '@/presentation/components/admin/button';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { ImagePicker } from '@/presentation/components/admin/form/image_picker';



interface PageProps {
    params: Promise<{
        id: string; // 1-6
    }>;
}

export default function GalleryEditPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const index = parseInt(id) - 1;
    const slotId = index + 1;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState<GalleryImage | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Layout guide text
    const layoutDescriptions = [
        "Featured Large - Stretches 2 cols x 2 rows.",
        "Standard Square - 1 col x 1 row.",
        "Standard Square - 1 col x 1 row.",
        "Vertical Tall - 1 col x 2 rows.",
        "Standard Square - 1 col x 1 row.",
        "Standard Square - 1 col x 1 row.",
    ];

    const repository = new SupabaseSettingsRepository();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const settings = await repository.getSettings();
            if (settings?.galleryImages && settings.galleryImages[index]) {
                setImage(settings.galleryImages[index]);
                setPreviewUrl(settings.galleryImages[index].src);
            } else {
                // Initialize empty
                setImage({
                    src: '',
                    alt: '',
                    className: '' // Will use default based on index
                });
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreviewUrl(URL.createObjectURL(f));
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            let imageUrl = image?.src || '';

            // Upload file if selected
            if (file) {
                const fileName = `gallery-${slotId}-${Date.now()}.${file.name.split('.').pop()}`;
                const { data, error } = await supabase.storage
                    .from('common_images')
                    .upload(`gallery/${fileName}`, file);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('common_images')
                    .getPublicUrl(`gallery/${fileName}`);

                imageUrl = publicUrl;
            }

            if (!imageUrl) {
                alert("Please select an image");
                return;
            }

            const newImage: GalleryImage = {
                src: imageUrl,
                alt: image?.alt || '',
                // Preserve className if needed, or let component handle it
                className: image?.className
            };

            await repository.saveGalleryImage(index, newImage);
            router.push('/admin/gallery');
            router.refresh();
        } catch (error: any) {
            console.error('Failed to save', error);
            alert(`Failed to save image: ${error.message || JSON.stringify(error)}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this image?')) return;
        try {
            setSaving(true);
            await repository.saveGalleryImage(index, null); // Clear it
            router.push('/admin/gallery');
            router.refresh();
        } catch (error) {
            console.error('Failed to delete', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">


            <div className="flex gap-4">
                <Link href="/admin/gallery" className="pt-1">
                    <ArrowLeft size={20} />
                </Link>
                <Heading1 title="Edit Slot" headingClassName="text-xl" />
            </div>


            {/* <ImagePicker  /> */}





            <div className="bg-white p-6 rounded-2xl border border-secondary/10 shadow-sm space-y-6">

                {/* Image Upload */}
                <div className="space-y-3">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Image</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        {previewUrl ? (
                            <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    unoptimized
                                    className="object-contain" // Contain to show full image
                                />
                            </div>
                        ) : (

                            <div className="flex flex-col items-center text-gray-400">
                                <Upload size={40} className="mb-2" />
                                <span className="text-sm">Click to upload image</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>



                <div className="flex items-center gap-2 justify-between">
                    <Button onClick={handleDelete} className='w-full' >
                        <Trash size={16} className="mr-2" />
                        Remove Image
                    </Button>

                    <Button onClick={handleSave} className='w-full'>
                        {saving ? (
                            <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
