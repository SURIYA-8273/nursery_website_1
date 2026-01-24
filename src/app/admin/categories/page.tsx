'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { Category } from '@/domain/entities/plant.entity';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const repo = new SupabaseCategoryRepository();
        const data = await repo.getCategories();
        setCategories(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const repo = new SupabaseCategoryRepository();
            await repo.deleteCategory(id);
            fetchCategories(); // Refresh
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-primary">Categories</h1>
                    <p className="text-text-secondary">Manage plant categories</p>
                </div>

                <Link href="/admin/categories/new" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-primary-hover shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                    <Plus size={20} />
                    Add Category
                </Link>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-secondary/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/5 border-b border-secondary/10">
                            <tr>
                                <th className="p-6 font-bold text-text-secondary">Name</th>
                                <th className="p-6 font-bold text-text-secondary">Slug</th>
                                <th className="p-6 font-bold text-text-secondary">Description</th>
                                <th className="p-6 font-bold text-text-secondary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-text-muted">Loading categories...</td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-text-muted">No categories found.</td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-surface transition-colors">
                                        <td className="p-6 font-bold text-text-primary">{cat.name}</td>
                                        <td className="p-6 font-mono text-sm text-text-secondary">{cat.slug}</td>
                                        <td className="p-6 text-text-muted max-w-md truncate">{cat.description || '-'}</td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Edit placeholder for now */}
                                                <button className="p-2 hover:bg-secondary/10 rounded-full text-text-muted hover:text-primary transition-colors">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 hover:bg-red-50 rounded-full text-text-muted hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
