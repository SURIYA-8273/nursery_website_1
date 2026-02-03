import { useState, useEffect, useCallback } from 'react';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { Plant, Category } from '@/domain/entities/plant.entity';

export const useAdminPlants = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchCategories = async () => {
        const repo = new SupabaseCategoryRepository();
        const data = await repo.getCategories();
        setCategories(data);
    };

    const fetchPlants = useCallback(async () => {
        setLoading(true);
        const repo = new SupabasePlantRepository();

        // Fetch all plants first
        const { plants: allPlants } = await repo.getPlants({
            search: searchQuery,
            limit: 1000
        });

        // Apply client-side filters
        let filtered = allPlants;

        // Status filter
        if (statusFilter === 'active') {
            filtered = filtered.filter(p => p.isActive);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(p => !p.isActive);
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.categoryId === categoryFilter);
        }

        // Stock filter
        if (stockFilter === 'low') {
            filtered = filtered.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10);
        } else if (stockFilter === 'out') {
            filtered = filtered.filter(p => (p.stock || 0) === 0);
        }

        // Update total
        setTotalItems(filtered.length);

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);

        setPlants(paginated);
        setLoading(false);
    }, [searchQuery, statusFilter, categoryFilter, stockFilter, currentPage, pageSize]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPlants();
    }, [fetchPlants]);

    const deletePlant = async (id: string) => {
        const repo = new SupabasePlantRepository();
        await repo.deletePlant(id);
        fetchPlants(); // Refresh list
    };

    return {
        plants,
        categories,
        loading,
        totalItems,
        // Filter Accessors
        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        categoryFilter, setCategoryFilter,
        stockFilter, setStockFilter,
        // Pagination Accessors
        currentPage, setCurrentPage,
        pageSize, setPageSize,
        // Actions
        refresh: fetchPlants,
        deletePlantById: deletePlant
    };
};
