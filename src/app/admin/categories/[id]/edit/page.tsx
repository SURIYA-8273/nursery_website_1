'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Input } from '@/presentation/components/admin/form/input';
import { TextArea } from '@/presentation/components/admin/form/text_area';
import { Button } from '@/presentation/components/admin/button';

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetchingCategory, setFetchingCategory] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        const fetchCategory = async () => {
            const repo = new SupabaseCategoryRepository();
            const category = await repo.getCategoryById(categoryId);

            if (category) {
                setFormData({
                    name: category.name,
                    description: category.description || '',
                });
            } else {
                alert('Category not found');
                router.push('/admin/categories');
            }

            setFetchingCategory(false);
        };

        fetchCategory();
    }, [categoryId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const repo = new SupabaseCategoryRepository();
            await repo.updateCategory(categoryId, {
                name: formData.name,
                description: formData.description,
            });

            alert('Category updated successfully!');
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

    if (fetchingCategory) {
        return (
            <div className="max-w-4xl mx-auto p-6 md:p-8 flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto md:p-8 pb-20">
            
            <div className="flex gap-4">
                <Link href="/admin/categories" className="pt-1">
                    <ArrowLeft size={24} />
                </Link>
                <Heading1 title="Edit Category" headingClassName="text-xl" />
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-sm border border-primary-30 space-y-6">

                <div className="">
                    <Input 
                        label="Category Name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Indoor Plants"
                    />
                </div>

                <div className="">
                    <TextArea 
                        label="Description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe this category..."
                    />
                </div>

                <div >
                    
                    <Button
                        type="submit"
                        className='w-full'
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {loading ? 'Updating...' : 'Update Category'}
                    </Button>
                </div>

            </form>
        </div>
    );
}
