'use client';

import { useState } from 'react';
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from 'lucide-react';

interface GalleryItem {
    id: number | string;
    src: string;
    alt: string;
    className: string;
}

interface GalleryGridProps {
    items: GalleryItem[];
}

export const GalleryGrid = ({ items }: GalleryGridProps) => {
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

    return (
        <>
            {/* Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-6 auto-rows-[minmax(140px,auto)] md:auto-rows-[240px]">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "group relative overflow-hidden rounded-[6px] md:rounded-[8px] cursor-pointer",
                            item.className
                        )}
                        onClick={() => setSelectedImage(item)}
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                ))}
            </div>

            {/* Full Screen Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="relative w-full max-w-5xl h-[80vh] md:h-[90vh] rounded-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            fill
                            unoptimized
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
