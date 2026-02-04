"use client";

import { Star, MapPin, ChevronLeft, ChevronRight, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { Heading } from "./heading";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";

import { SupabaseGoogleReviewsRepository } from "@/data/repositories/supabase-google-reviews.repository";

interface Testimonial {
    id: string;
    name: string;
    initial: string;
    date: string;
    rating: number;
    text: string;
    avatarColor: string;
}

const AVATAR_COLORS = [
    "bg-[#E8F5E9] text-[#2D5A42]",
    "bg-[#F3E5F5] text-[#7B1FA2]",
    "bg-[#E1F5FE] text-[#0288D1]",
    "bg-[#FFF3E0] text-[#E65100]",
    "bg-[#F1F8E9] text-[#33691E]",
    "bg-[#FFEBEE] text-[#C62828]",
    "bg-[#E0F7FA] text-[#006064]",
    "bg-[#FFF8E1] text-[#FF8F00]"
];

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

function timeAgo(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    return "Today";
}

import { useSettings } from "@/presentation/context/settings-context";

export const TestimonialsSection = () => {
    const { settings } = useSettings();
    const mapUrl = settings?.mapUrl;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4); // Default to desktop
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const repo = new SupabaseGoogleReviewsRepository();
                const reviews = await repo.getReviews();
                const activeReviews = reviews.filter(r => r.isActive);

                const formatted: Testimonial[] = activeReviews.map(r => ({
                    id: r.id,
                    name: r.name,
                    initial: r.name.charAt(0).toUpperCase(),
                    date: timeAgo(r.timeline || ''),
                    rating: r.rating,
                    text: r.review || '',
                    avatarColor: getAvatarColor(r.name)
                }));

                setTestimonials(formatted);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        };

        fetchReviews();
    }, []);
    // Create a TRIPLED list for infinite loop illusion
    // Only extend if we have testimonials
    const extendedTestimonials = testimonials.length > 0 ? [...testimonials, ...testimonials, ...testimonials] : [];

    // Handle resize to update visible card count
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) setVisibleCards(4);
            else if (width >= 768) setVisibleCards(3);
            else setVisibleCards(2);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // Calculate exact card width including gap (24px)
            // We use the first child's width if available, or approx
            const firstCard = container.firstElementChild as HTMLElement;
            const cardWidth = firstCard ? firstCard.clientWidth : 0;
            const gap = 24; // gap-6
            const scrollAmount = cardWidth + gap;

            // Check bounds for seamless loop
            const maxScroll = container.scrollWidth / 3 * 2;
            const minScroll = container.scrollWidth / 3;

            // If we are too far left (set 1), jump to set 2
            if (container.scrollLeft < 100) {
                container.scrollLeft = minScroll + container.scrollLeft;
            }
            // If we are too far right (set 3), jump to set 2
            else if (container.scrollLeft >= maxScroll) {
                container.scrollLeft = minScroll + (container.scrollLeft - maxScroll);
            }

            let target = direction === "left"
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: target,
                behavior: "smooth"
            });
        }
    };

    // Infinite loop reset handler for manual scrolling
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const totalWidth = container.scrollWidth;
        const oneThird = totalWidth / 3;

        // Calculate active index based on card width
        const firstCard = container.firstElementChild as HTMLElement;
        const gap = 24;
        const cardWidth = firstCard ? firstCard.clientWidth + gap : 0;

        if (cardWidth > 0) {
            const currentScroll = container.scrollLeft;
            const rawIndex = Math.round(currentScroll / cardWidth);
            setActiveIndex(rawIndex % testimonials.length);
        }

        // If we've scrolled past the second set (into the third), snap back to second
        if (container.scrollLeft >= oneThird * 2) {
            container.scrollLeft -= oneThird;
        }
        // If we've scrolled back into the first set, snap forward to second
        else if (container.scrollLeft <= 50) { // Tolerance
            container.scrollLeft += oneThird;
        }
    };

    // Initialize to middle set
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const timer = setTimeout(() => {
                if (container.scrollWidth > container.clientWidth) {
                    container.scrollLeft = container.scrollWidth / 3;
                    setActiveIndex(0); // Reset index visualization
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            scroll("right");
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    // Calculate number of dots (pages)
    const pageCount = Math.ceil(testimonials.length / visibleCards);
    // Calculate which "page" layer the current index falls into
    // Example: 5 items, 4 visible. Active 0,1,2,3 -> Page 0. Active 4 -> Page 1.
    const activePage = Math.floor(activeIndex / visibleCards);

    // ... useEffects for scroll ...

    const defaultMapLink = "https://maps.app.goo.gl/YJNygrs16EQ2uaZM6";

    return (
        <section
            className="bg-[var(--color-surface)] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <Heading title="What Our Customers Say" subtitle="Hear from our satisfied customers who have found their perfect plants with us." />
                <div className="flex justify-center items-center text-[#D36E45] font-bold uppercase text-xs mb-4">
                    <MapPin size={14} fill="currentColor" strokeWidth={0} />
                    GOOGLE REVIEWS
                </div>

                {/* Slider Container */}
                {testimonials.length > 0 ? (
                    <div className="relative group/slider">
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {extendedTestimonials.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="w-[calc((100%-0px)/1)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)] snap-start shrink-0"
                                >
                                    <div className="bg-[var(--color-surface-hover)] p-4 rounded-[10px] shadow-sm  hover:shadow-md transition-all flex flex-col h-full border border-primary/50">
                                        <div className="flex flex-col gap-3 lg:flex-row items-center justify-between mb-4">


                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-gray-800",
                                                    item.avatarColor
                                                )}>
                                                    {item.initial}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[var(--color-text-primary)]">{item.name}</h4>
                                                    <p className="text-xs text-[var(--color-text-muted)]">{item.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        fill={i < Math.round(item.rating) ? "#D36E45" : "transparent"}
                                                        className={i < Math.round(item.rating) ? "text-[#D36E45]" : "text-gray-600"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-[var(--color-text-secondary)] text-center leading-relaxed italic flex-1 line-clamp-4">
                                            "{item.text}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Indicators */}
                        <div className="flex justify-center gap-2 md:mt-2">
                            {Array.from({ length: pageCount }).map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-300",
                                        // Make the dot active if the current page matches logical page
                                        activePage === index
                                            ? "w-8 bg-[#D36E45]"
                                            : "w-2 bg-gray-600"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No reviews available yet.</p>
                    </div>
                )}

                <div className="flex justify-center items-center mt-4">
                    <Button
                        variant="default"
                        className="gap-2 rounded-md"
                        onClick={() => window.open(mapUrl || defaultMapLink, "_blank")}
                    >
                        <FaGoogle size={14} fill="currentColor" strokeWidth={0} />
                        View on Google Maps
                    </Button>
                </div>


            </div>
        </section>
    );
};
