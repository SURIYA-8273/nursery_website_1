'use client';

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
    onClose?: () => void; // For mobile drawer
    isMobile?: boolean;
}

const LIGHT_REQUIREMENTS = ['Low Light', 'Medium Light', 'Bright Light'];
const CARE_LEVELS = ['Easy', 'Moderate', 'Expert'];

export const SidebarFilters = ({ categories, filters, onChange, onClose, isMobile }: SidebarFiltersProps) => {

    const handleCategoryChange = (catId: string) => {
        onChange({ ...filters, category: filters.category === catId ? '' : catId });
    };

    const handleLightChange = (light: string) => {
        onChange({ ...filters, light: filters.light === light ? '' : light });
    };

    const handleCareChange = (care: string) => {
        onChange({ ...filters, care: filters.care === care ? '' : care });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        onChange({ ...filters, priceRange: [0, val] });
    };

    return (
        <div className={cn(
            "flex flex-col h-full bg-[var(--color-surface)] p-6 md:p-8 rounded-[32px] border border-secondary/5",
            isMobile ? "rounded-none h-full overflow-y-auto" : ""
        )}>
            {isMobile && (
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-3xl font-bold text-[#1A2E26]">Filters</h2>
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
                <h3 className="font-bold text-[#1A2E26] mb-4">Category</h3>
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <FilterOption
                            key={cat.id}
                            label={cat.name}
                            checked={filters.category === cat.id}
                            onChange={() => handleCategoryChange(cat.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Light Requirements */}
            <div className="mb-10">
                <h3 className="font-bold text-[#1A2E26] mb-4">Light Requirements</h3>
                <div className="space-y-3">
                    {LIGHT_REQUIREMENTS.map((light) => (
                        <FilterOption
                            key={light}
                            label={light}
                            checked={filters.light === light}
                            onChange={() => handleLightChange(light)}
                        />
                    ))}
                </div>
            </div>

            {/* Care Level */}
            <div className="mb-10">
                <h3 className="font-bold text-[#1A2E26] mb-4">Care Level</h3>
                <div className="space-y-3">
                    {CARE_LEVELS.map((care) => (
                        <FilterOption
                            key={care}
                            label={care}
                            checked={filters.care === care}
                            onChange={() => handleCareChange(care)}
                        />
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-bold text-[#1A2E26] mb-4">Price Range</h3>
                <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full accent-[#2D5A42] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center mt-3 text-sm font-medium text-[#4A5D54]">
                    <span>₹0</span>
                    <span className="text-[#2D5A42] font-bold">₹{filters.priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
};

const FilterOption = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
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
            checked ? "text-[#1A2E26]" : "text-[#4A5D54] group-hover:text-[#1A2E26]"
        )}>
            {label}
        </span>
    </label>
);
