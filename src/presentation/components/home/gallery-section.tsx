import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SupabaseSettingsRepository } from "@/data/repositories/supabase-settings.repository";
import { GalleryImage } from "@/domain/entities/settings.entity";
import { Heading } from "./heading";
import { Button, buttonVariants } from "../ui/button";
import { ICONS } from "@/core/config/icons";

export const GallerySection = async () => {
    const repository = new SupabaseSettingsRepository();
    const settings = await repository.getSettings();
    const dynamicImages = settings?.galleryImages || [];

    const defaultItems = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=2070&auto=format&fit=crop",
            alt: "Living room with large Monstera",
            className: "col-span-2 row-span-2 h-[300px] md:h-full", // Big square on mobile too
            tag: "Living Room",
        },

        {
            id: 2,
            src: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1974&auto=format&fit=crop",
            alt: "Succulents on shelf",
            className: "col-span-1 row-span-1 h-[150px] md:h-auto",
            tag: "Shelf Decor",
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop",
            alt: "Peace Lily in bedroom",
            className: "col-span-1 row-span-1 h-[150px] md:h-auto",
            tag: "Bedroom Oasis",
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1628126235206-526055ca9776?q=80&w=1974&auto=format&fit=crop",
            alt: "Hanging plants",
            className: "col-span-1 row-span-2 h-[310px] md:h-auto", // Tall on mobile
            tag: "Hanging Plants",
        },
        {
            id: 5,
            src: "https://images.unsplash.com/photo-1598887142487-3c8343815c58?q=80&w=2066&auto=format&fit=crop",
            alt: "Office Desk Plants",
            className: "col-span-1 row-span-1 h-[150px] md:h-auto",
            tag: "Workspace",
        },
        {
            id: 6,
            src: "https://images.unsplash.com/photo-1512428559087-560fa5ce7d87?q=80&w=2070&auto=format&fit=crop",
            alt: "Balcony Garden",
            className: "col-span-1 row-span-1 h-[150px] md:h-24", // Small filler
            tag: "Balcony",
        }
    ];

    // Merge dynamic images with defaults
    const galleryItems = defaultItems.map((item, index) => {
        const dynamicImage = dynamicImages[index];
        if (dynamicImage && dynamicImage.src) {
            return {
                ...item,
                src: dynamicImage.src,
                alt: dynamicImage.alt || item.alt,
                tag: dynamicImage.tag || item.tag,
                // className is preserved from default to maintain layout
            };
        }
        return item;
    });

    return (
        <section className="bg-[var(--color-surface)] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                <Heading
                    title="Plant Life Gallery"
                    subtitle="Get inspired by how our community styles their spaces with nature."
                />



                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-6 auto-rows-[minmax(140px,auto)] md:auto-rows-[240px]">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "group relative overflow-hidden rounded-[6px] md:rounded-[8px] cursor-pointer",
                                item.className
                            )}
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {item.tag && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <span className="text-white font-bold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        #{item.tag}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center mt-6">

                    <a
                        href={settings?.instagramUrl || "https://instagram.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: 'default' }), "rounded-md gap-2")}
                    >
                        <ICONS.instagram/>
                        View on Instagram
                        <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>

            </div>
        </section>
    );
};
