'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from 'lucide-react'; // Placeholder, using custom HTML for badge

interface ProductGalleryProps {
    images: string[];
    name: string;
    discount?: number;
}

export const ProductGallery = ({ images, name, discount }: ProductGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const validImages = images.length > 0 ? images : [];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/4] rounded-3xl overflow-hidden bg-white shadow-soft relative group">
                {validImages[selectedIndex] ? (
                    <img
                        src={validImages[selectedIndex]}
                        alt={`${name} - View ${selectedIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted bg-secondary/5">
                        No Image Available
                    </div>
                )}

                {discount && discount > 0 ? (
                    <span className="absolute top-4 left-4 bg-accent text-white font-bold px-3 py-1 rounded-full shadow-md z-10">
                        -{discount}%
                    </span>
                ) : null}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {validImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={cn(
                                "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                                selectedIndex === i
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent hover:border-primary/50"
                            )}
                        >
                            <img src={img} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
