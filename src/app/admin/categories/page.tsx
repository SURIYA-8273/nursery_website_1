'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { Category } from '@/domain/entities/plant.entity';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { SearchInput } from '@/presentation/components/common/search-input';
import { DataTable, TableHeader } from '@/presentation/components/admin/data-table';

export default function AdminCategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        const repo = new SupabaseCategoryRepository();
        const allCategories = await repo.getCategories();

        // Apply search filter
        let filtered = allCategories;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                cat =>
                    cat.name.toLowerCase().includes(query) ||
                    (cat.description && cat.description.toLowerCase().includes(query))
            );
        }

        // Update total
        setTotalItems(filtered.length);

        // Apply pagination
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);

        setCategories(paginated);
        setLoading(false);
    }, [searchQuery, currentPage, pageSize]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchCategories();
        };
        fetchData();
    }, [fetchCategories, searchQuery, currentPage, pageSize]);

    const handleDelete = async (cat: Category) => {
        if (!confirm(`Are you sure you want to delete "${cat.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const repo = new SupabaseCategoryRepository();
            await repo.deleteCategory(cat.id);

            // Refresh the list
            fetchCategories();

            // Show success message
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. It may be in use by existing plants.');
        }
    };

    const handleEdit = (cat: Category) => {
        router.push(`/admin/categories/${cat.id}/edit`);
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
        { label: 'Name' },
        { label: 'Description' },
        { label: 'Actions   ' }
    ];

    const renderRow = (cat: Category) => [
        { content: cat.name },
        { content: cat.description || '-' },
        {
            actions: [
                {
                    label: 'Edit',
                    icon: <Edit3 size={18} />,
                    onClick: () => handleEdit(cat)
                },
                {
                    label: 'Delete',
                    icon: <Trash2 size={18} />,
                    onClick: () => handleDelete(cat),
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
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-black">Categories</h1>
                    <p className="text-sm md:text-base text-text-secondary">Manage plant categories</p>
                </div>

                <Link href="/admin/categories/new" className="w-full md:w-auto bg-black text-white px-6 py-2.5 rounded-full font-bold hover:bg-neutral-800 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-sm md:text-base">
                    <Plus size={20} />
                    Add Category
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-secondary/10 p-4 md:p-6 mb-6">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by name, slug, or description..."
                />
            </div>

            {/* Categories Table */}
            <DataTable<Category>
                data={categories}
                headers={headers}
                renderRow={renderRow}
                loading={loading}
                emptyMessage={searchQuery
                    ? 'No categories found matching your search.'
                    : 'No categories found.'}
                rowKey={(cat) => cat.id}
                minWidth="600px"
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



