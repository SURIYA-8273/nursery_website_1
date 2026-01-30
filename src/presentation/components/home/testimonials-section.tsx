"use client";

import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { Heading } from "./heading";

interface Testimonial {
    id: string;
    name: string;
    initial: string;
    date: string;
    rating: number;
    text: string;
    avatarColor: string;
}

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Sarah M.",
        initial: "S",
        date: "2 weeks ago",
        rating: 5,
        text: "Absolutely love this plant shop! The quality of their plants is exceptional, and the staff is incredibly knowledgeable. My Monstera arrived in perfect condition.",
        avatarColor: "bg-[#E8F5E9] text-[#2D5A42]"
    },
    {
        id: "2",
        name: "James K.",
        initial: "J",
        date: "1 month ago",
        rating: 5,
        text: "Best plant shop in town! The care guides they provide are so helpful. Already ordered three times and never been disappointed.",
        avatarColor: "bg-[#F3E5F5] text-[#7B1FA2]"
    },
    {
        id: "3",
        name: "Emily R.",
        initial: "E",
        date: "3 weeks ago",
        rating: 4,
        text: "Great selection and beautiful packaging. Shipping was fast and the plant was well-protected. Will definitely order again!",
        avatarColor: "bg-[#E1F5FE] text-[#0288D1]"
    },
    {
        id: "4",
        name: "Michael T.",
        initial: "M",
        date: "1 month ago",
        rating: 5,
        text: "The Fiddle Leaf Fig I ordered is stunning! It came with detailed care instructions and has been thriving for months now.",
        avatarColor: "bg-[#FFF3E0] text-[#E65100]"
    },
    {
        id: "5",
        name: "Lisa C.",
        initial: "L",
        date: "2 weeks ago",
        rating: 5,
        text: "Exceptional customer service! They helped me choose the perfect low-light plants for my apartment. Highly recommend!",
        avatarColor: "bg-[#F1F8E9] text-[#33691E]"
    }
];

export const TestimonialsSection = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(4); // Default to desktop

    // Create a TRIPLED list for infinite loop illusion
    const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

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

    return (
        <section
            className="py-24 bg-[var(--color-surface)] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <Heading title="What Our Customers Say" subtitle="Hear from our satisfied customers who have found their perfect plants with us." />
                <div className="flex justify-center items-center text-[var(--color-secondary)] font-bold uppercase text-xs mb-4">
                    <MapPin size={14} fill="currentColor" strokeWidth={0} />
                    GOOGLE REVIEWS
                </div>

                {/* Slider Container */}
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
                                className="w-[calc((100%-24px)/2)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)] snap-start shrink-0"
                            >
                                <div className="bg-[var(--color-surface-hover)] p-8 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col h-full border border-white/5">
                                    <div className="flex items-center justify-between mb-6">
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
                                                    fill={i < item.rating ? "#D36E45" : "transparent"}
                                                    className={i < item.rating ? "text-[#D36E45]" : "text-gray-600"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed italic flex-1 line-clamp-4">
                                        "{item.text}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
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
            </div>
        </section>
    );
};
