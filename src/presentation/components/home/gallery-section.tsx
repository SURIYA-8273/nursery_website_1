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
            className: "col-span-2 row-span-2 h-[300px] md:h-full", // Big square on mobile too
            alt: "Gallery Image 1"
        },

        {
            id: 2,
            src: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1974&auto=format&fit=crop",
            className: "col-span-1 row-span-1 h-[150px] md:h-auto",
            alt: "Gallery Image 2"
        },
        {
            id: 3,
            src: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop",
            className: "col-span-1 row-span-1 h-[150px] md:h-auto",
            alt: "Gallery Image 3"
        },
        {
            id: 4,
            src: "https://images.unsplash.com/photo-1628126235206-526055ca9776?q=80&w=1974&auto=format&fit=crop",
            className: "col-span-1 row-span-2 h-[310px] md:h-auto", // Tall on mobile
            alt: "Gallery Image 4"
        },
        {
            id: 5,
            src: "https://images.unsplash.com/photo-1598887142487-3c8343815c58?q=80&w=2066&auto=format&fit=crop",
            className: "col-span-1 row-span-1 h-[150px] md:h-auto",
            alt: "Gallery Image 5"
        },
        {
            id: 6,
            src: "https://images.unsplash.com/photo-1512428559087-560fa5ce7d87?q=80&w=2070&auto=format&fit=crop",
            className: "col-span-1 row-span-1 h-[150px] md:h-24", // Small filler
            alt: "Gallery Image 6"
        }
    ];

    // Merge dynamic images with defaults
    const galleryItems = defaultItems.map((item, index) => {
        const dynamicImage = dynamicImages[index];
        if (dynamicImage && dynamicImage.src) {
            return {
                ...item,
                src: dynamicImage.src,
                alt: dynamicImage.alt,
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
                        <ICONS.instagram />
                        View on Instagram
                        <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>

            </div>
        </section>
    );
};
