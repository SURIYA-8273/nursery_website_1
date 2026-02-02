'use client';

import { useState, useEffect } from 'react';
import { Category, Plant, PlantVariant } from '@/domain/entities/plant.entity';
import { supabase } from '@/data/datasources/supabase.client';
import { Upload, Loader2, Save, Plus, Trash2 } from 'lucide-react';

export interface PlantFormData {
    name: string;
    price: string;
    discount: string;
    description: string;
    careInstructions: string;
    fertilizingInfo: string;
    categoryId: string;
    stock: string;
    isActive: boolean;
    tags: string;
    variants: {
        id: string; // temp id for key
        size: string;
        height: string;
        weight: string;
        price: string;
        discount: string;
        stock: string;
        isAvailable: boolean;
    }[];
}

interface PlantFormProps {
    initialData?: Plant;
    categories: Category[];
    onSubmit: (data: PlantFormData, newImages: File[], keptExistingImages: string[]) => Promise<void>;
    isLoading: boolean;
    submitLabel: string;
}

export const PlantForm = ({ initialData, categories, onSubmit, isLoading, submitLabel }: PlantFormProps) => {
    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const [formData, setFormData] = useState<PlantFormData>({
        name: '',
        price: '',
        discount: '',
        description: '',
        careInstructions: '',
        fertilizingInfo: '',
        tags: '',
        categoryId: '',
        stock: '10',
        isActive: true,
        variants: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: (initialData.price || 0).toString(),
                discount: initialData.discountPrice?.toString() || '',
                description: initialData.description || '',
                careInstructions: initialData.careInstructions || '',
                fertilizingInfo: initialData.fertilizingInfo || '',
                tags: initialData.tags?.join(', ') || '',
                categoryId: initialData.categoryId || '',
                stock: (initialData.stock || 0).toString(),
                isActive: initialData.isActive,
                variants: initialData.variants?.map(v => ({
                    id: v.id,
                    size: v.size,
                    height: v.height || '',
                    weight: v.weight || '',
                    price: v.price.toString(),
                    discount: v.discountPrice?.toString() || '',
                    stock: v.quantityInStock.toString(),
                    isAvailable: v.isAvailable
                })) || []
            });
            setExistingImages(initialData.images || []);
        }
    }, [initialData]);

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
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...filesArray]);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imageToRemove: string) => {
        setExistingImages(prev => prev.filter(img => img !== imageToRemove));
    };

    // Variant Handlers
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    id: `temp-${Date.now()}`,
                    size: '',
                    height: '',
                    weight: '',
                    price: prev.price, // Default to main price
                    discount: prev.discount,
                    stock: '10',
                    isAvailable: true
                }
            ]
        }));
    };

    const removeVariant = (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter(v => v.id !== id)
        }));
    };

    const handleVariantChange = (id: string, field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v =>
                v.id === id ? { ...v, [field]: value } : v
            )
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, newImages, existingImages);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-secondary/10 space-y-8">

            {/* Basic Info */}
            <section className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-primary border-b border-secondary/10 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Plant Name *</label>
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
                        <label className="text-sm font-bold text-text-secondary">Category *</label>
                        <select
                            name="categoryId"
                            required
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Tags</label>
                        <input
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. Indoor, Pet Friendly, Low Light (Comma separated)"
                        />
                    </div>
                </div>
            </section>


            {/* Pricing & Stock (Defaults) */}
            <section className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-primary border-b border-secondary/10 pb-2">Base Pricing & Stock</h3>
                <p className="text-xs text-text-secondary -mt-3">These values are used as defaults or if no variants are defined.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Base Price (₹) *</label>
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
                        <label className="text-sm font-bold text-text-secondary">Discount Price</label>
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
                        <label className="text-sm font-bold text-text-secondary">Base Stock *</label>
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
            </section>

            {/* Variants Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-secondary/10 pb-2">
                    <h3 className="text-lg font-serif font-bold text-primary">Product Variants</h3>
                    <button
                        type="button"
                        onClick={addVariant}
                        className="text-sm bg-secondary/10 hover:bg-secondary/20 text-primary px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                    >
                        <Plus size={16} /> Add Variant
                    </button>
                </div>

                {formData.variants.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 text-sm">
                        No variants added. Base pricing will be used.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {formData.variants.map((variant, index) => (
                            <div key={variant.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50 p-4 rounded-xl items-end relative group">
                                <div className="md:col-span-3 space-y-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-secondary">Size *</label>
                                        <input
                                            type="text"
                                            placeholder="Small..."
                                            value={variant.size}
                                            onChange={(e) => handleVariantChange(variant.id, 'size', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-text-secondary">Height</label>
                                            <input
                                                type="text"
                                                placeholder="18-24in"
                                                value={variant.height}
                                                onChange={(e) => handleVariantChange(variant.id, 'height', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-text-secondary">Weight</label>
                                            <input
                                                type="text"
                                                placeholder="1.5 kg"
                                                value={variant.weight}
                                                onChange={(e) => handleVariantChange(variant.id, 'weight', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-3 grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-secondary">Price *</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-secondary">Discount</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={variant.discount}
                                            onChange={(e) => handleVariantChange(variant.id, 'discount', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-text-secondary">Stock</label>
                                    <input
                                        type="number"
                                        placeholder="10"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-text-secondary">Active</label>
                                    <select
                                        value={variant.isAvailable ? 'true' : 'false'}
                                        onChange={(e) => handleVariantChange(variant.id, 'isAvailable', e.target.value === 'true')}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 flex justify-end pb-1">
                                    <button
                                        onClick={(e) => removeVariant(variant.id, e)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove Variant"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Details */}
            <section className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-primary border-b border-secondary/10 pb-2">Description & Care</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Description *</label>
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
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Fertilizing Info</label>
                        <textarea
                            name="fertilizingInfo"
                            rows={3}
                            value={formData.fertilizingInfo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-secondary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            placeholder="Compost requirements..."
                        />
                    </div>
                </div>
            </section>

            {/* Images */}
            <section className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-primary border-b border-secondary/10 pb-2">Media</h3>

                {(existingImages.length > 0 || newImages.length > 0) && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Images</label>
                        <div className="flex gap-4 flex-wrap">
                            {existingImages.map((img, idx) => (
                                <div key={`existing-${idx}`} className="relative group">
                                    <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-secondary/20" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {newImages.map((file, idx) => (
                                <div key={`new-${idx}`} className="relative group">
                                    <img src={URL.createObjectURL(file)} alt="" className="w-24 h-24 object-cover rounded-lg border border-secondary/20 opacity-80" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">
                        Upload Images
                    </label>
                    <div className="border-2 border-dashed border-secondary/30 rounded-xl p-6 md:p-8 text-center hover:bg-surface/50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 text-text-muted">
                            <Upload size={32} />
                            <span>Click or Drag to upload images (Multiple allowed)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Status Toggles */}
            <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-secondary/20 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-secondary">Active</span>
                </label>
            </div>

            <div className="pt-4 flex items-center justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-hover shadow-lg hover:shadow-soft active:scale-95 transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};
