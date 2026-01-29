'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const repo = new SupabaseCategoryRepository();
            await repo.createCategory({
                name: formData.name,
                description: formData.description,
                image: '', // Optional for now
            });

            router.push('/admin/categories');
            router.refresh();

        } catch (error) {
            if (error instanceof Error) {
                alert('Error: ' + error.message);
            } else {
                alert('An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/categories" className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-serif text-3xl font-bold text-primary">Add New Category</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-secondary/10 space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Category Name</label>
                    <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="e.g. Indoor Plants"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                        placeholder="Describe this category..."
                    />
                </div>

                <div className="pt-4 flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-soft active:scale-95 transition-all text-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {loading ? 'Creating...' : 'Save Category'}
                    </button>
                </div>

            </form>
        </div>
    );
}
