'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { Plant, Category } from '@/domain/entities/plant.entity';
import { Plus, Edit3, Trash2, Filter, Eye, Search } from 'lucide-react';
import { SearchInput } from '@/presentation/components/common/search-input';
import { DataTable, TableHeader } from '@/presentation/components/admin/data-table';
import { Button } from '@/presentation/components/admin/button';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Input } from '@/presentation/components/admin/form/input';
import { Select } from '@/presentation/components/admin/form/select';
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
        { label: 'Image' },
        { label: 'Plant' },
        { label: 'Price' },
        { label: 'Stock' },
        { label: 'Status' },
        { label: 'Actions' }
    ];

    const renderRow = (plant: Plant) => [
        {
            content: (

                <div className="w-10 h-10 md:w-12 md:h-12 bg-surface rounded-lg overflow-hidden shrink-0">
                    {plant.images[0] && <img src={plant.images[0]} alt="" className="w-full h-full object-cover" />}
                </div>


            )
        },
        {
            content: (

                <div>
                    <div className="">{plant.name}</div>
                </div>

            )
        },
        { content: `₹${plant.price}` },
        {
            content: (
                <span>
                    {plant.stock || 0}
                </span>
            )
        },
        {
            content: (
                <span className={`px-1.5 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold ${plant.isActive ? 'bg-black text-white' : 'bg-white text-black border border-neutral-200'}`}>
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
        <div className="max-w-7xl mx-auto">

            <Heading1 title="Plants" description="Manage your inventory" />

            <Button onClick={() => router.push('/admin/plants/new')} className='w-full'>
                <Plus size={20} />
                Add Plant
            </Button>

            <div className="bg-white rounded-md shadow-sm border border-black/20 p-4 mt-4 md:p-6 mb-6">
         
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">

                            {/* Search Filter */}
                           <div>
                             <Input
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name..."
                                type="text"
                                leadingIcon={<Search size={20} className='' />}
                            />
                           </div>
                            {/* Status Filter */}
                            <div>
                                <Select
                                    label="Status"
                                    name="status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                    options={[
                                        { value: 'all', label: 'All Status' },
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' }
                                    ]}
                                    placeholder="Select Status"
                                />
                            </div>

                            {/* Category Filter */}
                            <div>
                                <Select
                                    label="Category"
                                    name="category"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                                    placeholder="Select Category"
                                />
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <Select
                                label="Stock"
                                name="stock"
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value as any)}
                                options={[
                                    { value: 'all', label: 'All Stock' },
                                    { value: 'in_stock', label: 'In Stock' },
                                    { value: 'out_of_stock', label: 'Out of Stock' }
                                ]}
                                placeholder="Select Stock"
                            />
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
