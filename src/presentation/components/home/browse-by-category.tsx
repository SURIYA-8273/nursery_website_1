import Link from 'next/link';
import { ArrowRight, Leaf, Moon, Sun, Wind } from 'lucide-react';

import { Heading } from './heading';

import { Button } from '../ui/button';

const categories = [
    {
        name: 'Tropical Plants',
        description: 'Lush, dramatic foliage for statement spaces',
        count: '42 plants',
        icon: Leaf,
        href: '/plants?category=tropical',
        color: 'bg-[#ECF1EE]'
    },
    {
        name: 'Low Light',
        description: 'Perfect for shaded corners and offices',
        count: '28 plants',
        icon: Moon,
        href: '/plants?category=low-light',
        color: 'bg-[#F3F5F0]'
    },
    {
        name: 'Sun Loving',
        description: 'Flourish in bright, direct sunlight',
        count: '35 plants',
        icon: Sun,
        href: '/plants?category=sun-loving',
        color: 'bg-[#F9F7F0]'
    },
    {
        name: 'Air Purifiers',
        description: 'Clean the air while beautifying your home',
        count: '21 plants',
        icon: Wind,
        href: '/plants?category=air-purifying',
        color: 'bg-[#F0F5F6]'
    }
];

export const BrowseByCategory = ({ viewAllLink }: { viewAllLink?: string }) => {
    return (
        <section className="bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <Heading title="Browse By Category" subtitle="Find Your Perfect Plant" />


                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            href={cat.href}
                            className="group bg-[var(--color-surface-hover)]  p-4 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-black/10 shadow-sm hover:border-[var(--color-primary)]"
                        >
                            <div className="flex  flex-col items-center justify-center">
                                <h3 className="font-serif text-center text-xl md:text-3xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors pb-2">
                                    {cat.name}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed opacity-70 text-center">
                                    {cat.description}
                                </p>
                                <Button
                                    variant="link"
                                    className=""
                                    
                                >
                                    Shop Now
                                </Button>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className=""
                        >
                            <Button
                                variant="default"
                                className=""
                                
                            >
                                Explore All <ArrowRight size={20} />
                            </Button>
                            
                        </Link>
                    )}

                </div>
            </div>
        </section>
    );
};
