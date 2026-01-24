'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { Category } from '@/domain/entities/plant.entity';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { SearchInput } from '@/presentation/components/common/search-input';
import { Pagination } from '@/presentation/components/common/pagination';

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
                    cat.slug.toLowerCase().includes(query) ||
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

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const repo = new SupabaseCategoryRepository();
            await repo.deleteCategory(id);

            // Refresh the list
            fetchCategories();

            // Show success message
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. It may be in use by existing plants.');
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/categories/${id}/edit`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">Categories</h1>
                    <p className="text-sm md:text-base text-text-secondary">Manage plant categories</p>
                </div>

                <Link href="/admin/categories/new" className="w-full md:w-auto bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-primary-hover shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-sm md:text-base">
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
            <div className="bg-white rounded-3xl shadow-sm border border-secondary/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px] md:min-w-0">
                        <thead className="bg-secondary/5 border-b border-secondary/10">
                            <tr>
                                <th className="p-4 md:p-6 font-bold text-text-secondary whitespace-nowrap">Name</th>
                                <th className="p-4 md:p-6 font-bold text-text-secondary whitespace-nowrap">Slug</th>
                                <th className="p-4 md:p-6 font-bold text-text-secondary whitespace-nowrap">Description</th>
                                <th className="p-4 md:p-6 font-bold text-text-secondary text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 md:p-12 text-center text-text-muted">Loading categories...</td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 md:p-12 text-center text-text-muted">
                                        {searchQuery
                                            ? 'No categories found matching your search.'
                                            : 'No categories found.'}
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-surface transition-colors">
                                        <td className="p-4 md:p-6 font-bold text-text-primary text-sm md:text-base">{cat.name}</td>
                                        <td className="p-4 md:p-6 font-mono text-xs md:text-sm text-text-secondary">{cat.slug}</td>
                                        <td className="p-4 md:p-6 text-text-muted max-w-xs md:max-w-md truncate text-sm md:text-base">{cat.description || '-'}</td>
                                        <td className="p-4 md:p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat.id)}
                                                    className="p-1.5 md:p-2 hover:bg-secondary/10 rounded-full text-text-muted hover:text-primary transition-colors"
                                                    title="Edit category"
                                                >
                                                    <Edit3 size={18} className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id, cat.name)}
                                                    className="p-1.5 md:p-2 hover:bg-red-50 rounded-full text-text-muted hover:text-red-500 transition-colors"
                                                    title="Delete category"
                                                >
                                                    <Trash2 size={18} className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                )}
            </div>
        </div>
    );
}
