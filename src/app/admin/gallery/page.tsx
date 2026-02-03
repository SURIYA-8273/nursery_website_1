'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/data/datasources/supabase.client';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { BusinessSettings, GalleryImage } from '@/domain/entities/settings.entity';
import { Loader2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/presentation/components/admin/button';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Input } from '@/presentation/components/admin/form/input';
import { ImagePicker } from '@/presentation/components/admin/form/image_picker';
import { ConfirmationDialog } from '@/presentation/components/admin/confirmation-dialog';
import { toast } from 'sonner';

export default function AdminGalleryPage() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<BusinessSettings | null>(null);
    const [editingSlot, setEditingSlot] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<GalleryImage>({ src: '', alt: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Deletion state
    const [deleteSlot, setDeleteSlot] = useState<number | null>(null);

    const repository = new SupabaseSettingsRepository();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await repository.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (index: number, currentImage: GalleryImage | null) => {
        setEditingSlot(index);
        setEditForm(currentImage || { src: '', alt: '' });
        setImagePreview(currentImage?.src || null);
        setImageFile(null);
    };

    const handleCancelEdit = () => {
        setEditingSlot(null);
        setEditForm({ src: '', alt: '' });
        setImagePreview(null);
        setImageFile(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSlot === null) return;

        setIsSaving(true);
        try {
            if (!editForm.alt || editForm.alt.trim() === '') {
                toast.error('Alt text is required');
                setIsSaving(false);
                return;
            }

            let imageUrl = editForm.src;

            // Upload new image if selected
            if (imageFile) {
                const fileName = `gallery-${editingSlot + 1}-${Date.now()}`;
                const { error: uploadError } = await supabase.storage
                    .from('common_images')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('common_images')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            }

            if (!imageUrl) {
                toast.error('Please upload an image');
                setIsSaving(false);
                return;
            }

            const updatedImage: GalleryImage = {
                ...editForm,
                src: imageUrl
            };

            await repository.saveGalleryImage(editingSlot, updatedImage);

            // Update local state
            const newImages = [...(settings?.galleryImages || [])];
            newImages[editingSlot] = updatedImage;
            if (settings) {
                setSettings({ ...settings, galleryImages: newImages });
            }

            toast.success('Gallery image saved');
            handleCancelEdit();

        } catch (error: any) {
            console.error(error);
            toast.error('Failed to save image: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (index: number) => {
        setDeleteSlot(index);
    };

    const confirmDelete = async () => {
        if (deleteSlot === null) return;

        setIsSaving(true);
        try {
            await repository.saveGalleryImage(deleteSlot, null);

            // Reload settings
            await loadSettings();

            toast.success('Image removed from gallery');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete image');
        } finally {
            setIsSaving(false);
            setDeleteSlot(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const galleryImages = settings?.galleryImages || new Array(6).fill(null);

    // Hardcoded layout preview classes to match the real gallery
    const layoutClasses = [
        "col-span-2 row-span-2 h-[300px]", // 1: Big Square
        "col-span-1 row-span-1 h-[150px]", // 2: Small
        "col-span-1 row-span-1 h-[150px]", // 3: Small
        "col-span-1 row-span-2 h-[310px]", // 4: Tall
        "col-span-1 row-span-1 h-[150px]", // 5: Small
        "col-span-1 row-span-1 h-[150px]", // 6: Small (Filler)
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20 relative">
            <Heading1 title="Gallery Management" description='Manage the 6 images displayed on the home page gallery.' />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Visual Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-white rounded-md border border-black/10 shadow-sm">
                        {galleryImages.map((image: GalleryImage | null, index: number) => {
                            const slotId = index + 1;
                            const gridClass = layoutClasses[index] || "col-span-1 row-span-1 h-[150px]";
                            const isEditing = editingSlot === index;

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleEditClick(index, image)}
                                    className={cn(
                                        "relative group rounded-md overflow-hidden border-2 cursor-pointer transition-all",
                                        gridClass,
                                        isEditing ? "border-black ring-2 ring-black/20" : "border-dashed border-gray-200 hover:border-black/50",
                                        image ? "bg-white" : "bg-gray-50 flex flex-col items-center justify-center"
                                    )}
                                >
                                    {image ? (
                                        <>
                                            <Image
                                                src={image.src}
                                                alt={image.alt || `Gallery Image ${slotId}`}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                                <span className="text-white font-bold text-sm">Slot #{slotId}</span>
                                               
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                                                Slot #{slotId}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-black transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                <Plus size={20} />
                                            </div>
                                            <span className="font-medium text-sm">Add Image #{slotId}</span>
                                        </div>
                                    )}

                                    {/* Slot Badge */}
                                    {!image && (
                                        <div className="absolute top-2 left-2 bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-mono">
                                            Slot {slotId}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Edit Form - Sticky Sidebar or Inline */}
                <div className="w-full lg:w-[400px] shrink-0">
                    {editingSlot !== null ? (
                        <div className="bg-white p-6 rounded-md shadow-sm border border-black/20 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">
                                    {editForm.src ? 'Edit Image' : 'Add Image'} <span className="text-gray-400 font-normal">Slot #{editingSlot + 1}</span>
                                </h3>
                                <button onClick={handleCancelEdit} className="text-gray-400 hover:text-black">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Image Preview / Upload */}
                                <div className="space-y-4">
                                    <div className="h-48 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No image selected
                                            </div>
                                        )}
                                        {/* Overlay Change Button */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ImagePicker
                                                handleImageChange={handleImageChange}
                                                title="Change Image"
                                            />
                                        </div>
                                    </div>
                                    {!imagePreview && (
                                        <ImagePicker
                                            handleImageChange={handleImageChange}
                                            title="Upload Image"
                                        />
                                    )}
                                </div>

                                <Input
                                    label="Alt Text (Description)"
                                    name="alt"
                                    value={editForm.alt}
                                    onChange={handleFormChange}
                                    placeholder="e.g. Beautiful Monstera Plant"
                                    required
                                />



                                <div className="pt-2 flex gap-3">
                                    <Button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-gray-100 text-black hover:bg-gray-200 shadow-none border border-transparent"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 flex flex-col items-center justify-center h-[300px]">
                            <Edit2 size={32} className="mb-4 opacity-20" />
                            <p className="font-medium">Select a slot to edit</p>
                            <p className="text-sm mt-1 opacity-60">Click on any grid item to update or add an image.</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationDialog
                isOpen={deleteSlot !== null}
                onClose={() => setDeleteSlot(null)}
                onConfirm={confirmDelete}
                title="Remove Image"
                message={`Are you sure you want to remove the image from Slot #${(deleteSlot || 0) + 1}?`}
                isLoading={isSaving}
            />
        </div>
    );
}
