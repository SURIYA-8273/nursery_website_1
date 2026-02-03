'use client';

import { useState, useEffect } from 'react';
import { Category, Plant, PlantVariant } from '@/domain/entities/plant.entity';
import { supabase } from '@/data/datasources/supabase.client';
import { Upload, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/presentation/components/admin/form/input';
import { Select } from '@/presentation/components/admin/form/select';
import { Button } from '@/presentation/components/admin/button';
import { TextArea } from '@/presentation/components/admin/form/text_area';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { ImagePicker } from '@/presentation/components/admin/form/image_picker';
import { Radio } from '@/presentation/components/admin/form/radio';

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

        if (type === 'radio' && name === 'isActive') {
            setFormData(prev => ({ ...prev, [name]: value === 'true' }));
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
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-8 rounded-md shadow-sm border border-primary/30 space-y-3">

            {/* Basic Info */}
            <section className="">
                <Heading1 title="Basic Information" headingClassName="text-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                    <div className="">
                        <Input
                            label="Plant Name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Monstera Deliciosa"
                        />
                    </div>
                    <div className="">
                        <Select
                            label="Category"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            options={
                                categories.map(c => ({ value: c.id, label: c.name }))
                            }
                        />
                    </div>
                    <div className="">
                        <Input
                            label="Tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g. Indoor, Pet Friendly, Low Light (Comma separated)"
                        />
                    </div>
                </div>
            </section>


            {/* Pricing & Stock (Defaults) */}
            <section className="">
                <Heading1 title="Base Pricing & Stock" description='These values are used as defaults or if no variants are defined.' headingClassName="text-xl" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-6">
                    <div className="">
                        <Input
                            label="Base Price (₹)"
                            name="price"
                            type="number"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="">
                        <Input
                            label="Discount Price"
                            name="discount"
                            type="number"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="">
                        <Input
                            label="Base Stock"
                            name="stock"
                            type="number"
                            required
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="10"
                        />
                    </div>
                </div>
            </section>
            {/* Details */}
            <section className="space-y-4">
                <Heading1 title="Description & Care" headingClassName="text-xl" />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <TextArea
                            label="Description"
                            name="description"
                            required
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />

                    </div>

                    <div className="space-y-2">
                        <TextArea
                            label="Care Instructions"
                            name="careInstructions"
                            placeholder='Care Instructions'
                            rows={3}
                            value={formData.careInstructions}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <TextArea
                            label="Fertilizing Info"
                            name="fertilizingInfo"
                            rows={3}
                            value={formData.fertilizingInfo}
                            onChange={handleChange}
                            placeholder="Compost requirements"
                        />
                    </div>
                </div>
            </section>

            {/* Variants Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <Heading1 title="Product Variants" headingClassName="text-xl" />
                    <Button onClick={addVariant}>
                        <Plus size={16} /> Add Variant
                    </Button>
                </div>

                {formData.variants.length === 0 ? (
                    <div className="text-center py-4 bg-white rounded-xl border-2 border-dashed border-black/30 text-black text-sm">
                        No variants added. Base pricing will be used.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {formData.variants.map((variant, index) => (
                            <div key={variant.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-md items-end relative group border border-primary/30 shadow-sm">
                                <div className="md:col-span-3 space-y-2">
                                    <div className="space-y-1">
                                        <Input
                                            label="Size"
                                            name="size"
                                            required
                                            value={variant.size}
                                            onChange={(e) => handleVariantChange(variant.id, 'size', e.target.value)}
                                            placeholder="Small..."
                                        />

                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Input
                                                label="Height"
                                                name="height"
                                                value={variant.height}
                                                onChange={(e) => handleVariantChange(variant.id, 'height', e.target.value)}
                                                placeholder="18-24in"
                                            />

                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                label="Weight"
                                                name="weight"
                                                value={variant.weight}
                                                onChange={(e) => handleVariantChange(variant.id, 'weight', e.target.value)}
                                                placeholder="1.5 kg"
                                            />


                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-3 grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Input
                                            label="Price"
                                            name="price"
                                            type="number"
                                            required
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                            placeholder="0.00"
                                        />

                                    </div>
                                    <div className="space-y-1">
                                        <Input
                                            label="Discount"
                                            name="discount"
                                            type="number"
                                            value={variant.discount}
                                            onChange={(e) => handleVariantChange(variant.id, 'discount', e.target.value)}
                                            placeholder="0.00"
                                        />

                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <Input
                                        label="Stock"
                                        name="stock"
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                        placeholder="10"
                                    />

                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <Select
                                        label="Active"
                                        name="isAvailable"
                                        value={variant.isAvailable ? 'true' : 'false'}
                                        onChange={(e) => handleVariantChange(variant.id, 'isAvailable', e.target.value === 'true')}
                                        options={[
                                            { value: 'true', label: 'Yes' },
                                            { value: 'false', label: 'No' },
                                        ]}
                                    />

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



            {/* Images */}
            <section className="space-y-4">
                <Heading1 title="Media" headingClassName="text-xl" />

                {(existingImages.length > 0 || newImages.length > 0) && (
                    <div className="space-y-2">

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

                <div className="">
                    <ImagePicker handleImageChange={handleImageChange} title="Click or Drag to upload images (Multiple allowed)" multiple={true} acceptFormat="image/*" />
                </div>
            </section>

            {/* Status Toggles */}
            <div className="">
                <Heading1 title="Status" headingClassName="text-xl" />
                <Radio
                    
                    onChange={handleChange}
                    fields={[
                        { label: 'Active', value: 'true', checked: formData.isActive, name: 'isActive' },
                        { label: 'Inactive', value: 'false', checked: !formData.isActive, name: 'isActive' },
                    ]}
                />
            </div>
            <Button type="submit" className='w-full'>
                <Save size={20} />
                Save
            </Button>
        </form>
    );
};
