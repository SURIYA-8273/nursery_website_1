'use client';

import { useState, useEffect, useMemo } from 'react';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { Plant, Category } from '@/domain/entities/plant.entity';
import { DataTable, TableHeader, TableCell } from '@/presentation/components/ui/data-table';
import { SearchInput } from '@/presentation/components/common/search-input';

export default function ProductCatalogPage() {
    const [allPlants, setAllPlants] = useState<Plant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const plantRepo = new SupabasePlantRepository();
                const categoryRepo = new SupabaseCategoryRepository();

                const [plantsResult, categoriesResult] = await Promise.all([
                    plantRepo.getPlants({ limit: 1000 }),
                    categoryRepo.getCategories()
                ]);

                setAllPlants(plantsResult.plants.filter(p => p.isActive));
                setCategories(categoriesResult);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredPlants = useMemo(() => {
        let result = allPlants;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                (p.category && p.category.toLowerCase().includes(lowerQuery))
            );
        }

        if (categoryFilter !== 'All') {
            result = result.filter(p => p.categoryId === categoryFilter);
        }

        return result;
    }, [allPlants, searchQuery, categoryFilter]);





    const headers: TableHeader[] = [
        { label: 'S.No', align: 'center' as const, className: 'w-16 md:w-24' },
        { label: 'English Name', align: 'left' as const },
        { label: 'Tamil Name', align: 'left' as const },
    ];

    const renderRow = (plant: Plant): TableCell[] => {
        // Calculate S.No based on current page and index in the *entire* list? 
        // Or relative to page? Usually S.No is absolute.
        // Let's find index in allPlants
        const index = allPlants.findIndex(p => p.id === plant.id);
        const sNo = index + 1;

        return [
            { content: <span className="font-medium text-[var(--color-text-secondary)]">{sNo}</span>, align: 'center' },
            { content: <span className="font-semibold text-[var(--color-text-primary)]">{plant.name}</span>, align: 'left' },
            { content: <span className="italic text-[var(--color-text-secondary)]">-</span>, align: 'left' },
           
        ];
    };

    return (
        <div className="min-h-screen pt-4 pb-4 px-4 md:px-8 bg-[var(--color-bg-primary)]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 text-center">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                        Product Catalog
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Explore our complete collection of plants.
                    </p>
                </div>

                <div className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--color-surface-hover)] p-2 rounded-md">
                    <div className="w-full md:w-96">
                        
                        <input
                            type="text"
                            placeholder="Search plants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-primary)]/20 rounded-md px-6 py-3 focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]" />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            className="w-full px-4 py-2.5 rounded-md text-[var(--color-text-primary)] bg-[var(--color-surface)]  border border-[var(--color-primary)]/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.65em auto' }}
                        >
                            <option value="All">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <DataTable<Plant>
                    data={filteredPlants}
                    headers={headers}
                    renderRow={renderRow}
                    loading={loading}
                    emptyMessage="No products found in the catalog."
                    rowKey={(plant) => plant.id}
                />
            </div>
        </div>
    );
}
