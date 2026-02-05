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
import { STRINGS } from '@/core/config/strings';

// Helper to identify units
const splitUnit = (val: string, defaultUnit: string): { value: string, unit: string } => {
    if (!val) return { value: '', unit: defaultUnit };
    const match = val.match(/^([\d.]+)\s*(.*)$/);
    if (match) {
        return { value: match[1] || '', unit: match[2].trim() || defaultUnit };
    }
    return { value: val, unit: defaultUnit };
};

export interface PlantFormData {
    name: string;
    description: string;
    careInstructions: string;
    fertilizingInfo: string;
    categoryId: string;
    isActive: boolean;
    tags: string;
    averageRating: string;
    totalReviews: string;
    variants: {
        id: string; // temp id for key
        size: string;
        height: string;
        weight: string;
        price: string;
        finalPrice: string;
        stock: string;
        isAvailable: boolean;
    }[];
}

interface InternalPlantVariant {
    id: string;
    size: string;
    heightValue: string;
    heightUnit: string;
    weightValue: string;
    weightUnit: string;
    price: string;
    finalPrice: string;
    stock: string;
    isAvailable: boolean;
}

interface InternalPlantFormData {
    name: string;
    description: string;
    careInstructions: string;
    fertilizingInfo: string;
    categoryId: string;
    isActive: boolean;
    tags: string;
    averageRating: string;
    totalReviews: string;
    variants: InternalPlantVariant[];
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

    const [formData, setFormData] = useState<InternalPlantFormData>({
        name: '',
        description: '',
        careInstructions: '',
        fertilizingInfo: '',
        tags: '',
        categoryId: '',
        isActive: true,
        averageRating: '0',
        totalReviews: '0',
        variants: [{
            id: `temp-${Date.now()}`,
            size: '',
            heightValue: '',
            heightUnit: STRINGS.PLANT_FORM.HEIGHT_UNITS[0].value, // Default CM
            weightValue: '',
            weightUnit: STRINGS.PLANT_FORM.WEIGHT_UNITS[0].value, // Default KG
            price: '',
            finalPrice: '',
            stock: '',
            isAvailable: true
        }]
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || '',
                careInstructions: initialData.careInstructions || '',
                fertilizingInfo: initialData.fertilizingInfo || '',
                tags: initialData.tags?.join(', ') || '',
                categoryId: initialData.categoryId || '',
                isActive: initialData.isActive,
                averageRating: (initialData.averageRating || 0).toString(),
                totalReviews: (initialData.totalReviews || 0).toString(),
                variants: initialData.variants?.map(v => {
                    const h = splitUnit(v.height || '', STRINGS.PLANT_FORM.HEIGHT_UNITS[0].value);
                    const w = splitUnit(v.weight || '', STRINGS.PLANT_FORM.WEIGHT_UNITS[0].value);
                    return {
                        id: v.id,
                        size: v.size,
                        heightValue: h.value,
                        heightUnit: h.unit,
                        weightValue: w.value,
                        weightUnit: w.unit,
                        price: v.price.toString(),
                        finalPrice: v.discountPrice?.toString() || '',
                        stock: v.quantityInStock.toString(),
                        isAvailable: v.isAvailable
                    };
                }) || []
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

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...filesArray]);
            if (errors['images']) {
                setErrors(prev => ({ ...prev, images: '' }));
            }
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
                    heightValue: '',
                    heightUnit: STRINGS.PLANT_FORM.HEIGHT_UNITS[0].value,
                    weightValue: '',
                    weightUnit: STRINGS.PLANT_FORM.WEIGHT_UNITS[0].value,
                    price: '',
                    finalPrice: '',
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

    const handleVariantChange = (id: string, field: keyof InternalPlantVariant, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v =>
                v.id === id ? { ...v, [field]: value } : v
            )
        }));

        // Clear variant error
        const variantIndex = formData.variants.findIndex(v => v.id === id);
        if (errors[`variants.${variantIndex}.${field}`]) {
            // Also clear related field if needed, but simple clear is enough
            setErrors(prev => ({ ...prev, [`variants.${variantIndex}.${field}`]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};

        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = 'Plant name is required';
        }

        // Validate category is selected
        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        // Validate at least one image exists
        if (existingImages.length === 0 && newImages.length === 0) {
            newErrors.images = 'At least one product image is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Validate at least one variant exists
        if (formData.variants.length === 0) {
            alert('Please add at least one product variant');
            return;
        }

        // Validate variant fields
        let hasVariantErrors = false;
        formData.variants.forEach((variant, index) => {
            if (!variant.size.trim()) {
                newErrors[`variants.${index}.size`] = 'Size is required';
                hasVariantErrors = true;
            }
            if (!variant.heightValue.trim()) {
                newErrors[`variants.${index}.heightValue`] = 'Height is required';
                hasVariantErrors = true;
            }
            if (!variant.weightValue.trim()) {
                newErrors[`variants.${index}.weightValue`] = 'Weight is required';
                hasVariantErrors = true;
            }
            if (!variant.price.trim()) {
                newErrors[`variants.${index}.price`] = 'Price is required';
                hasVariantErrors = true;
            }
            if (!variant.finalPrice.trim()) {
                newErrors[`variants.${index}.finalPrice`] = 'Final Price is required';
                hasVariantErrors = true;
            }
        });

        if (hasVariantErrors) {
            setErrors(newErrors);
            return;
        }

        // Transform back to external format
        const submissionData: PlantFormData = {
            ...formData,
            variants: formData.variants.map(v => ({
                id: v.id,
                size: v.size,
                height: `${v.heightValue} ${v.heightUnit}`,
                weight: `${v.weightValue} ${v.weightUnit}`,
                price: v.price,
                finalPrice: v.finalPrice,
                stock: v.stock,
                isAvailable: v.isAvailable
            }))
        };

        onSubmit(submissionData, newImages, existingImages);
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="bg-white p-4 md:p-8 rounded-md shadow-sm border border-primary/30 space-y-3">

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
                            error={errors.name}
                        />
                    </div>
                    <div className="">
                        <Select
                            required
                            label="Category"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            placeholder="Select Category"
                            options={
                                categories.map(c => ({ value: c.id, label: c.name }))
                            }
                            error={errors.categoryId}
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

            {/* Rating & Reviews */}
            <section className="">
                <Heading1 title="Rating & Reviews" headingClassName="text-xl" />
                <div className="grid grid-cols-2 gap-2 md:gap-6">
                    <div className="">
                        <Input
                            label="Average Rating (0-5)"
                            name="averageRating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={formData.averageRating}
                            onChange={handleChange}
                            placeholder="0.0"
                        />
                    </div>
                    <div className="">
                        <Input
                            label="Total Reviews"
                            name="totalReviews"
                            type="number"
                            min="0"
                            value={formData.totalReviews}
                            onChange={handleChange}
                            placeholder="0"
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
                                <div className="md:col-span-2 flex justify-end">
                                    <button
                                        onClick={(e) => removeVariant(variant.id, e)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove Variant"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Input
                                                label="Bag Size"
                                                name="size"
                                                required
                                                value={variant.size}
                                                onChange={(e) => handleVariantChange(variant.id, 'size', e.target.value)}
                                                placeholder="Small..."
                                                error={errors[`variants.${index}.size`]}
                                            />

                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                label="Stock"
                                                name="stock"
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                                placeholder="100"
                                            />

                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Input
                                                        label="Height"
                                                        name="height"
                                                        value={variant.heightValue}
                                                        onChange={(e) => handleVariantChange(variant.id, 'heightValue', e.target.value)}
                                                        placeholder="18"
                                                        error={errors[`variants.${index}.heightValue`]}
                                                    />
                                                </div>
                                                <div className="w-24 mt-6">
                                                    <Select
                                                        name={`height-unit-${variant.id}`} // Unique name
                                                        value={variant.heightUnit}
                                                        onChange={(e) => handleVariantChange(variant.id, 'heightUnit', e.target.value)}
                                                        options={STRINGS.PLANT_FORM.HEIGHT_UNITS}
                                                        label="" // No label to align
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Input
                                                        label="Weight"
                                                        name="weight"
                                                        value={variant.weightValue}
                                                        onChange={(e) => handleVariantChange(variant.id, 'weightValue', e.target.value)}
                                                        placeholder="1.5"
                                                        error={errors[`variants.${index}.weightValue`]}
                                                    />
                                                </div>
                                                <div className="w-24 mt-6">
                                                    <Select
                                                        name={`weight-unit-${variant.id}`}
                                                        value={variant.weightUnit}
                                                        onChange={(e) => handleVariantChange(variant.id, 'weightUnit', e.target.value)}
                                                        options={STRINGS.PLANT_FORM.WEIGHT_UNITS}
                                                        label=""
                                                    />
                                                </div>
                                            </div>
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
                                            error={errors[`variants.${index}.price`]}
                                        />

                                    </div>
                                    <div className="space-y-1">
                                        <Input
                                            label="Final Price"
                                            name="finalPrice"
                                            type="number"
                                            value={variant.finalPrice}
                                            onChange={(e) => handleVariantChange(variant.id, 'finalPrice', e.target.value)}
                                            placeholder="0.00"
                                            error={errors[`variants.${index}.finalPrice`]}
                                        />

                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1">
                                    <Radio
                                        onChange={(e) => handleVariantChange(variant.id, 'isAvailable', e.target.value === 'true')}
                                        fields={[
                                            { label: 'Active', value: 'true', checked: variant.isAvailable, name: `isAvailable-${variant.id}` },
                                            { label: 'Inactive', value: 'false', checked: !variant.isAvailable, name: `isAvailable-${variant.id}` },
                                        ]}
                                    />

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
                    <ImagePicker
                        handleImageChange={handleImageChange}
                        title="Click or Drag to upload images (Multiple allowed)"
                        multiple={true}
                        acceptFormat="image/*"
                        error={errors.images}
                    />
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
            <Button type="submit" className='w-full' isLoading={isLoading}>
                <Save size={20} />
                Save
            </Button>
        </form>
    );
};
