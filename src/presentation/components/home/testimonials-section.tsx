"use client";

import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

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

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;

            // Check if we are at the end
            const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
            const isAtStart = container.scrollLeft <= 10;

            let target = direction === "left"
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            // Loop logic
            if (direction === "right" && isAtEnd) {
                target = 0;
            } else if (direction === "left" && isAtStart) {
                target = container.scrollWidth;
            }

            container.scrollTo({
                left: target,
                behavior: "smooth"
            });
        }
    };

    // Autoplay logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            scroll("right");
        }, 5000); // Scroll every 5 seconds

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section
            className="py-24 bg-[#FAF9F6] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="text-left">
                        <div className="flex items-center gap-2 text-[#D36E45] font-bold tracking-widest uppercase text-xs mb-4">
                            <MapPin size={14} fill="currentColor" strokeWidth={0} />
                            GOOGLE REVIEWS
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1A2E26] mb-6">
                            What Our Customers Say
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} size={20} fill="#D36E45" className="text-[#D36E45]" />
                                ))}
                                <Star size={20} className="text-gray-300" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-[#1A2E26]">4.8</span>
                                <span className="text-gray-400 text-sm font-medium">312 reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                scroll("left");
                                setIsPaused(true);
                                setTimeout(() => setIsPaused(false), 10000); // Pause for 10s after manual click
                            }}
                            className="bg-white text-[#1A2E26] p-4 rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all active:scale-90"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => {
                                scroll("right");
                                setIsPaused(true);
                                setTimeout(() => setIsPaused(false), 10000); // Pause for 10s after manual click
                            }}
                            className="bg-[#D36E45] text-white p-4 rounded-full shadow-sm hover:shadow-md border border-[#D36E45] transition-all active:scale-90"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative group/slider">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {testimonials.map((item) => (
                            <div
                                key={item.id}
                                className="min-w-[85%] md:min-w-[45%] lg:min-w-[31%] snap-start shrink-0"
                            >
                                <div className="bg-white p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold",
                                                item.avatarColor
                                            )}>
                                                {item.initial}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1A2E26]">{item.name}</h4>
                                                <p className="text-xs text-gray-400">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < item.rating ? "#D36E45" : "transparent"}
                                                    className={i < item.rating ? "text-[#D36E45]" : "text-gray-200"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed italic flex-1 line-clamp-4">
                                        "{item.text}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
