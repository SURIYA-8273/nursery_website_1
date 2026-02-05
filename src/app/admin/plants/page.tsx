'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plant } from '@/domain/entities/plant.entity';
import { Plus, Edit3, Trash2, Eye, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { DataTable, TableHeader } from '@/presentation/components/admin/data-table';
import { Button } from '@/presentation/components/admin/button';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Input } from '@/presentation/components/admin/form/input';
import { Select } from '@/presentation/components/admin/form/select';
import { ConfirmationDialog } from '@/presentation/components/admin/confirmation-dialog';
import { useAdminPlants } from '@/presentation/hooks/use-admin-plants';

export default function AdminPlantsPage() {
    const router = useRouter();

    // Use custom hook
    const {
        plants,
        categories,
        loading,
        totalItems,
        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        categoryFilter, setCategoryFilter,
        stockFilter, setStockFilter,
        currentPage, setCurrentPage,
        pageSize, setPageSize,
        deletePlantById
    } = useAdminPlants();

    const [deletePlant, setDeletePlant] = useState<Plant | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (plant: Plant) => {
        setDeletePlant(plant);
    };

    const handleConfirmDelete = async () => {
        if (!deletePlant) return;

        setIsDeleting(true);
        try {
            await deletePlantById(deletePlant.id);
            toast.success('Plant deleted successfully');
        } catch (error) {
            console.error('Error deleting plant:', error);
            toast.error('Failed to delete plant. Please try again.');
        } finally {
            setIsDeleting(false);
            setDeletePlant(null);
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
                    onClick: () => handleDeleteClick(plant),
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

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
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <Select
                            label="Category"
                            name="category"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            options={[
                                { value: 'all', label: 'All Category' },
                                ...categories.map((cat) => ({ value: cat.id, label: cat.name }))
                            ]}
                        />
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

            <ConfirmationDialog
                isOpen={!!deletePlant}
                onClose={() => setDeletePlant(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Plant"
                message={`Are you sure you want to delete "${deletePlant?.name}"? This action cannot be undone.`}
                isLoading={isDeleting}
            />
        </div>
    );
}
