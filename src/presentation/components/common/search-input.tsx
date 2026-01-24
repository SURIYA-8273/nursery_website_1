'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
}

export const SearchInput = ({
    value,
    onChange,
    placeholder = 'Search...',
    debounceMs = 300,
}: SearchInputProps) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange]);

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 border border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {localValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
};
