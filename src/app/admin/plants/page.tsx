'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { Plant, Category } from '@/domain/entities/plant.entity';
import { Plus, Edit3, Trash2, Filter, Eye } from 'lucide-react';
import { SearchInput } from '@/presentation/components/common/search-input';
import { DataTable, TableHeader } from '@/presentation/components/admin/data-table';

export default function AdminPlantsPage() {
    const router = useRouter();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchCategories = async () => {
        const repo = new SupabaseCategoryRepository();
        const data = await repo.getCategories();
        setCategories(data);
    };

    const fetchPlants = async () => {
        setLoading(true);
        const repo = new SupabasePlantRepository();

        // Fetch all plants first (the repository already supports pagination)
        const { plants: allPlants, total } = await repo.getPlants({
            search: searchQuery,
            limit: 1000 // Get all for client-side filtering
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
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPlants();
    }, [searchQuery, statusFilter, categoryFilter, stockFilter, currentPage, pageSize]);

    const handleDelete = async (plant: Plant) => {
        if (!confirm(`Are you sure you want to delete "${plant.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const repo = new SupabasePlantRepository();
            await repo.deletePlant(plant.id);

            // Refresh the list
            fetchPlants();

            // Show success message (you could use a toast notification here)
            alert('Plant deleted successfully!');
        } catch (error) {
            console.error('Error deleting plant:', error);
            alert('Failed to delete plant. Please try again.');
        }
    };

    const handleEdit = (plant: Plant) => {
        router.push(`/admin/plants/${plant.id}/edit`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    const headers: TableHeader[] = [
        { label: 'Plant' },
        { label: 'Price', className: 'font-medium' },
        { label: 'Stock' },
        { label: 'Status' },
        { label: 'Actions', align: 'right' }
    ];

    const renderRow = (plant: Plant) => [
        {
            content: (
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-surface rounded-lg overflow-hidden shrink-0">
                        {plant.images[0] && <img src={plant.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <div className="font-bold text-text-primary line-clamp-1 text-sm md:text-base">{plant.name}</div>
                    </div>
                </div>
            )
        },
        { content: `₹${plant.price}` },
        {
            content: (
                <span className={`text-sm md:text-base ${(plant.stock || 0) === 0 ? 'font-bold text-black border-b border-black' : (plant.stock || 0) < 10 ? 'font-medium text-black' : ''}`}>
                    {plant.stock || 0}
                </span>
            )
        },
        {
            content: (
                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold ${plant.isActive ? 'bg-black text-white' : 'bg-white text-black border border-neutral-200'}`}>
                    {plant.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            actions: [
                {
                    label: 'View',
                    icon: <Eye size={18} />,
                    onClick: () => console.log('View', plant.id)
                },
                {
                    label: 'Edit',
                    icon: <Edit3 size={18} />,
                    onClick: () => handleEdit(plant)
                },
                {
                    label: 'Delete',
                    icon: <Trash2 size={18} />,
                    onClick: () => handleDelete(plant),
                    variant: 'danger' as const
                }
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-black">Plants</h1>
                    <p className="text-sm md:text-base text-text-secondary">Manage your inventory</p>
                </div>

                <Link href="/admin/plants/new" className="w-full md:w-auto bg-black text-white px-6 py-2.5 rounded-full font-bold hover:bg-neutral-800 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-sm md:text-base">
                    <Plus size={20} />
                    Add Plant
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-secondary/10 p-4 md:p-6 mb-6">
                <div className="flex flex-col gap-6">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by name..."
                    />

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {/* Status Filter */}
                            <div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                    className="w-full px-4 py-2.5 border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 text-text-muted">
                                <Filter size={18} />
                                <span className="text-sm font-medium">Stock:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setStockFilter('all')}
                                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${stockFilter === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-secondary/10 text-text-secondary hover:bg-secondary/20'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setStockFilter('low')}
                                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${stockFilter === 'low'
                                        ? 'bg-primary text-white'
                                        : 'bg-secondary/10 text-text-secondary hover:bg-secondary/20'
                                        }`}
                                >
                                    Low Stock (&lt;10)
                                </button>
                                <button
                                    onClick={() => setStockFilter('out')}
                                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors ${stockFilter === 'out'
                                        ? 'bg-primary text-white'
                                        : 'bg-secondary/10 text-text-secondary hover:bg-secondary/20'
                                        }`}
                                >
                                    Out of Stock
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plant Table */}
            <DataTable<Plant>
                data={plants}
                headers={headers}
                renderRow={renderRow}
                loading={loading}
                emptyMessage={searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || stockFilter !== 'all'
                    ? 'No plants found matching your filters.'
                    : 'No plants found.'}
                rowKey={(plant) => plant.id}
                pagination={{
                    currentPage,
                    totalPages,
                    totalItems,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange
                }}
            />
        </div>
    );
}
