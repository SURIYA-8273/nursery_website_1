'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { Category } from '@/domain/entities/plant.entity';
import { supabase } from '@/data/datasources/supabase.client';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';
import { APP_CONFIG } from '@/core/config/constants';
import Link from 'next/link';

export default function NewPlantPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '',
        description: '',
        careInstructions: '',
        categoryId: '',
        stock: '10',
        isActive: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchCats = async () => {
            const repo = new SupabasePlantRepository();
            const cats = await repo.getCategories();
            setCategories(cats);
        };
        fetchCats();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            let imageUrls: string[] = [];

            // 1. Upload Image if exists
            if (imageFile) {
                const fileName = `${slug}-${Date.now()}`;
                const { data, error } = await supabase.storage
                    .from('plants')
                    .upload(fileName, imageFile);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('plants')
                    .getPublicUrl(fileName);

                imageUrls.push(publicUrl);
            }

            // 2. Create Plant
            const repo = new SupabasePlantRepository();
            await repo.createPlant({
                name: formData.name,
                slug,
                price: parseFloat(formData.price),
                discountPrice: formData.discount ? parseFloat(formData.discount) : undefined,
                description: formData.description,
                careInstructions: formData.careInstructions,
                categoryId: formData.categoryId,
                images: imageUrls,
                stock: parseInt(formData.stock),
                isActive: formData.isActive,
                isFeatured: false,
            });

            router.push(APP_CONFIG.routes.admin.dashboard);
            router.refresh();

        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link href={APP_CONFIG.routes.admin.dashboard} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-serif text-3xl font-bold text-primary">Add New Plant</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-secondary/10 space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Plant Name</label>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. Monstera Deliciosa"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Category</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Price (₹)</label>
                        <input
                            name="price"
                            type="number"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Discount Price (Optional)</label>
                        <input
                            name="discount"
                            type="number"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Stock Qty</label>
                        <input
                            name="stock"
                            type="number"
                            required
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="10"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                        placeholder="Describe the plant..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Care Instructions</label>
                    <textarea
                        name="careInstructions"
                        rows={3}
                        value={formData.careInstructions}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                        placeholder="Watering, light requirements..."
                    />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Primary Image</label>
                    <div className="border-2 border-dashed border-secondary/30 rounded-xl p-8 text-center hover:bg-surface/50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {imageFile ? (
                            <div className="flex items-center justify-center gap-2 text-primary font-bold">
                                <span className="truncate max-w-xs">{imageFile.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-text-muted">
                                <Upload size={32} />
                                <span>Click or Drag to upload image</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-soft active:scale-95 transition-all text-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {loading ? 'Creating...' : 'Save Plant'}
                    </button>
                </div>

            </form>
        </div>
    );
}
