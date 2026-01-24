import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { PlantCard } from '@/presentation/components/ui/plant-card';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface Props {
    searchParams: Promise<{
        search?: string;
        category?: string;
    }>;
}

// Revalidate every minute for new stock/prices
export const revalidate = 60;

export default async function PlantListingPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const repo = new SupabasePlantRepository();
    const { plants, total } = await repo.getPlants({
        search: resolvedSearchParams.search,
        category: resolvedSearchParams.category,
        limit: 100 // High limit for MVP
    });

    const categories = await repo.getCategories();

    return (
        <main className="min-h-screen max-w-7xl mx-auto p-4 py-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div className="w-full md:w-auto">
                    <h1 className="font-serif text-4xl font-bold text-primary mb-2">
                        Explore Collection
                    </h1>
                    <p className="text-text-secondary">
                        Find the perfect plant for your space
                    </p>
                </div>

                <form className="w-full md:w-96 relative">
                    <input
                        name="search"
                        defaultValue={resolvedSearchParams.search} // This is resolved now
                        placeholder="Search plants..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-secondary/20 bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 pointer-events-none" />
                </form>
            </div>

            {/* Categories Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                <Link
                    href="/plants"
                    className={`whitespace-nowrap px-6 py-2 rounded-full border transition-colors ${!resolvedSearchParams.category
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-secondary border-secondary/20 hover:border-primary'
                        }`}
                >
                    All Plants
                </Link>
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/plants?category=${cat.slug}`}
                        className={`whitespace-nowrap px-6 py-2 rounded-full border transition-colors ${resolvedSearchParams.category === cat.slug
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-text-secondary border-secondary/20 hover:border-primary'
                            }`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>

            {/* Grid */}
            {plants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {plants.map((plant) => (
                        <PlantCard key={plant.id} plant={plant} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-secondary/20">
                    <p className="text-text-muted text-lg">
                        No plants found matching your criteria.
                    </p>
                    {(resolvedSearchParams.search || resolvedSearchParams.category) && (
                        <Link
                            href="/plants"
                            className="mt-4 inline-block text-primary font-bold hover:underline"
                        >
                            Clear filters
                        </Link>
                    )}
                </div>
            )}
        </main>
    );
}
