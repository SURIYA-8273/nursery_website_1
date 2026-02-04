'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plant, Category } from '@/domain/entities/plant.entity';
import { PlantCard } from '@/presentation/components/ui/plant-card';
import { SidebarFilters } from '@/presentation/components/features/plants/sidebar-filters';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List as ListIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/presentation/components/ui/button';

interface PlantsClientProps {
    initialPlants: Plant[];
    categories: Category[];
}

export function PlantsClient({ initialPlants, categories }: PlantsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        light: searchParams.get('light') || '',
        care: searchParams.get('care') || '',
        priceRange: [0, parseInt(searchParams.get('price') || '10000')] as [number, number]
    });

    // Update URL when state changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (filters.category) params.set('category', filters.category);
        if (filters.light) params.set('light', filters.light);
        if (filters.care) params.set('care', filters.care);
        if (filters.priceRange[1] < 10000) params.set('price', filters.priceRange[1].toString());
        if (sortBy !== 'featured') params.set('sort', sortBy);

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchQuery, filters, sortBy, pathname, router]);

    // Derived stats
    const maxPrice = useMemo(() => {
        if (!initialPlants.length) return 10000;
        const max = Math.max(...initialPlants.map(p => p.discountPrice || p.price || 0));
        return Math.ceil(max / 100) * 100; // Round up to nearest 100
    }, [initialPlants]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        initialPlants.forEach(p => {
            if (p.categoryId) {
                counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
            }
        });
        return counts;
    }, [initialPlants]);

    // Derived plants list
    const filteredPlants = useMemo(() => {
        let result = [...initialPlants];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Filters
        if (filters.category) {
            result = result.filter(p => p.categoryId === filters.category);
        }
        if (filters.light) {
            // Check usage_info or description for now if tags don't exist
            result = result.filter(p =>
                p.usageInfo?.toLowerCase().includes(filters.light.toLowerCase()) ||
                p.description?.toLowerCase().includes(filters.light.toLowerCase()) ||
                p.tags?.some(t => t.toLowerCase().includes(filters.light.toLowerCase()))
            );
        }
        if (filters.care) {
            result = result.filter(p =>
                p.careInstructions?.toLowerCase().includes(filters.care.toLowerCase()) ||
                p.description?.toLowerCase().includes(filters.care.toLowerCase())
            );
        }

        result = result.filter(p => {
            const price = p.discountPrice || p.price || 0;
            return price <= filters.priceRange[1];
        });

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0));
                break;
            case 'price-high':
                result.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return result;
    }, [initialPlants, searchQuery, filters, sortBy]);

    return (
        <main className="min-h-screen bg-[var(--color-surface)]">
            {/* Top Bar: Search & Sort */}
            <div className="bg-[var(--color-surface-hover)] py-8 sticky top-[80px] md:top-[88px] z-30 border-b border-secondary/5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search plants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-primary)]/20 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]" />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-6 py-3 text-[var(--color-text-primary)] bg-[var(--color-surface)]  border border-[var(--color-primary)]/20 rounded-2xl font-bold text-[#1A2E26]"
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <div className="relative flex-1 md:flex-none ">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full md:w-48 appearance-none text-[var(--color-text-primary)] pl-4 pr-10 py-3 bg-[var(--color-surface)] border border-[var(--color-primary)]/20 rounded-2xl font-bold text-[#1A2E26] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">New arrivals</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>

                        <span className="hidden lg:block text-sm font-medium text-[#4A5D54]">
                            {filteredPlants.length} plants
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
                <div className="flex gap-10 lg:gap-16">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <SidebarFilters
                            categories={categories}
                            filters={filters}
                            onChange={setFilters}
                            counts={categoryCounts}
                            maxPrice={maxPrice}
                        />
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="flex lg:hidden items-center justify-between mb-8">
                            <h1 className="font-serif text-2xl font-bold text-[#1A2E26]">Our Collection</h1>
                            <span className="text-sm font-medium text-[#4A5D54]">
                                {filteredPlants.length} plants
                            </span>
                        </div>

                        {filteredPlants.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                                {filteredPlants.map((plant) => (
                                    <PlantCard key={plant.id} plant={plant} />
                                ))}
                            </div>
                        ) : (
                            <div className="pt-20 text-center bg-[#FAF9F6] rounded-[40px] border border-dashed border-secondary/10">
            
                                <h3 className="text-xl font-bold text-[#1A2E26] mb-2">No plants found</h3>
                                <p className="text-[#4A5D54] mb-8">Try adjusting your filters or search terms.</p>
                                
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilters({
                                            category: '',
                                            light: '',
                                            care: '',
                                            priceRange: [0, maxPrice]
                                        });
                                    }}
                                    className="bg-[#2D5A42] text-white px-8 py-3 rounded-full font-bold shadow-lg"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <div className={cn(
                "fixed inset-0 z-50 transition-all duration-300 pointer-events-none",
                isFilterDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
            )}>
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsFilterDrawerOpen(false)}
                />
                <div className={cn(
                    "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500",
                    isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <SidebarFilters
                        isMobile
                        categories={categories}
                        filters={filters}
                        onChange={setFilters}
                        onClose={() => setIsFilterDrawerOpen(false)}
                        counts={categoryCounts}
                        maxPrice={maxPrice}
                    />
                </div>
            </div>
        </main>
    );
}
