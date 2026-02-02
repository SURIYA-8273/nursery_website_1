import { useState, useEffect } from 'react';

import { Category } from '@/domain/entities/plant.entity';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface FiltersState {
    category: string;
    light: string;
    care: string;
    priceRange: [number, number];
}

interface SidebarFiltersProps {
    categories: Category[];
    filters: FiltersState;
    onChange: (filters: FiltersState) => void;
    onClose?: () => void;
    isMobile?: boolean;
    counts?: Record<string, number>;
    maxPrice?: number;
}

const LIGHT_REQUIREMENTS = ['Low Light', 'Medium Light', 'Bright Light'];
const CARE_LEVELS = ['Easy', 'Moderate', 'Expert'];

export const SidebarFilters = ({ categories, filters, onChange, onClose, isMobile, counts, maxPrice = 10000 }: SidebarFiltersProps) => {

    const [localFilters, setLocalFilters] = useState(filters);

    // Sync local state when props change (e.g. Clear Filters from parent)
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleCategoryChange = (catId: string) => {
        setLocalFilters(prev => ({ ...prev, category: prev.category === catId ? '' : catId }));
    };

    const handleLightChange = (light: string) => {
        setLocalFilters(prev => ({ ...prev, light: prev.light === light ? '' : light }));
    };

    const handleCareChange = (care: string) => {
        setLocalFilters(prev => ({ ...prev, care: prev.care === care ? '' : care }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setLocalFilters(prev => ({ ...prev, priceRange: [0, val] }));
    };

    const applyFilters = () => {
        onChange(localFilters);
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-full bg-[var(--color-surface)] text-[var(--color-text-primary)] p-6 md:p-8 rounded-[32px] border border-secondary/5",
            isMobile ? "rounded-none h-full overflow-y-auto" : ""
        )}>
            {isMobile && (
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-3xl font-bold text-[var(--color-text-primary)]">Filters</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-black">
                        <X size={24} />
                    </button>
                </div>
            )}

            {!isMobile && (
                <h2 className="font-serif text-2xl font-bold text-[#1A2E26] mb-8">Filters</h2>
            )}

            {/* Category */}
            <div className="mb-10">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Category</h3>
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <FilterOption
                            key={cat.id}
                            label={cat.name}
                            count={counts ? counts[cat.id] : undefined}
                            checked={localFilters.category === cat.id}
                            onChange={() => handleCategoryChange(cat.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-10">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Price Range</h3>
                <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="100"
                    value={localFilters.priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full accent-[#2D5A42] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center mt-3 text-sm font-medium text-[var(--color-text-primary)]">
                    <span>₹0</span>
                    <span className="text-[var(--color-text-primary)] font-bold">₹{localFilters.priceRange[1]}</span>
                </div>
            </div>

            {/* Apply Button */}
            <div className="mt-auto">
                <button
                    onClick={applyFilters}
                    className="w-full bg-[#2D5A42] text-white py-3 md:py-4 rounded-xl font-bold text-lg hover:bg-[#234835] transition-colors shadow-lg shadow-[#2D5A42]/20 active:scale-[0.98]"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
};

const FilterOption = ({ label, checked, onChange, count }: { label: string, checked: boolean, onChange: () => void, count?: number }) => (
    <label className="flex items-center gap-3 cursor-pointer group justify-between w-full">
        <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only"
                />
                <div className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
                    checked ? "border-[#2D5A42] bg-[#2D5A42]" : "border-gray-300 group-hover:border-[#2D5A42]"
                )}>
                    {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
            </div>
            <span className={cn(
                "text-sm font-medium transition-colors",
                checked ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-primary)] group-hover:text-[#1A2E26]"
            )}>
                {label}
            </span>
        </div>
        {count !== undefined && (
            <span className="text-xs font-bold text-[#D36E45] bg-[#D36E45]/5 px-2 py-0.5 rounded-full">
                {count}
            </span>
        )}
    </label>
);
