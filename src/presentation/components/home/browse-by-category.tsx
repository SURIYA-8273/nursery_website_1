"use client";

import Link from 'next/link';
import { ArrowRight, Leaf, Image as ImageIcon } from 'lucide-react';
import { Heading } from './heading';
import { Button } from '../ui/button';
import { Category } from '@/domain/entities/plant.entity';

const CARD_COLORS = ['bg-[#ECF1EE]', 'bg-[#F3F5F0]', 'bg-[#F9F7F0]', 'bg-[#F0F5F6]'];

import { useCatalog } from '@/presentation/context/catalog-context';

interface BrowseByCategoryProps {
    viewAllLink?: string;
    // categories?: Category[]; // Deprecated, using context
    categories?: any; // Keeping for compatibility if needed, but unused
}

export const BrowseByCategory = ({ viewAllLink }: BrowseByCategoryProps) => {
    const { categories } = useCatalog();
    // Display only top 4 for home page (or whatever logic was there)
    const displayCategories = categories.slice(0, 4);

    return (
        <section className="bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <Heading title="Browse By Category" subtitle="Find Your Perfect Plant" />

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {displayCategories.length > 0 ? (
                        displayCategories.map((cat, i) => (
                            <Link
                                key={cat.id}
                                href={`/plants?category=${cat.id}`}
                                className={`group bg-[var(--color-surface-hover)] p-4 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm hover:border-[var(--color-primary)]`}
                            >
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="mb-4 text-[var(--color-primary)]">
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        ) : (
                                            <Leaf size={32} />
                                        )}
                                    </div>
                                    <h3 className="font-serif text-center text-md md:text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors pb-2">
                                        {cat.name}
                                    </h3>
                                    {/* <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed opacity-70 text-center line-clamp-2 mb-4">
                                        {cat.description || "Discover our beautiful selection of " + cat.name.toLowerCase() + " plants."}
                                    </p> */}
                                    <div className="mt-auto">
                                        <Button
                                            variant="link"

                                            className="p-0 h-auto font-bold text-[var(--color-primary)]"
                                        >
                                            Shop Now
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-text-secondary">
                            No categories found.
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-10">
                    {viewAllLink && (
                        <Link href={viewAllLink}>
                            <Button variant="default" className="rounded-md">
                                Explore All <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};
