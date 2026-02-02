'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { BusinessSettings, GalleryImage } from '@/domain/entities/settings.entity';
import { Loader2, Plus, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/presentation/components/ui/button';

export default function AdminGalleryPage() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<BusinessSettings | null>(null);
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
        } finally {
            setLoading(false);
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
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-black">Gallery Management</h1>
                    <p className="text-text-secondary mt-1">Manage the 6 images displayed on the home page gallery.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-secondary/10 shadow-sm">
                {galleryImages.map((image: GalleryImage | null, index: number) => {
                    const slotId = index + 1;
                    // Use layout classes but enforce min-height for visibility in admin
                    const gridClass = layoutClasses[index] || "col-span-1 row-span-1 h-[150px]";

                    return (
                        <div
                            key={index}
                            className={cn(
                                "relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary transition-colors bg-gray-50 flex flex-col items-center justify-center",
                                gridClass,
                                image ? "border-solid border-gray-100 bg-white" : ""
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
                                        <Link href={`/admin/gallery/${slotId}`}>
                                            <Button size="sm" variant="secondary" className="gap-2">
                                                <Edit2 size={14} />
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                                        #{image.tag}
                                    </div>
                                </>
                            ) : (
                                <Link href={`/admin/gallery/${slotId}`} className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors w-full h-full justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                        <Plus size={20} />
                                    </div>
                                    <span className="font-medium text-sm">Add Image #{slotId}</span>
                                </Link>
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

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-700">
                <p className="font-bold mb-1">💡 Layout Guide</p>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>Slot 1 is the <strong>Featured Large Image</strong> (2x2 grid size).</li>
                    <li>Slot 4 is a <strong>Tall Vertical Image</strong> (1x2 grid size).</li>
                    <li>All other slots are standard squares/rectangles.</li>
                    <li>Use high-quality images for best results.</li>
                </ul>
            </div>
        </div>
    );
}
