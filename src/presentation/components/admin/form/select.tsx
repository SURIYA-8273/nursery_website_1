export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    label?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    error?: string;
    required?: boolean;
}

export const Select = ({ label, name, value, onChange, options, placeholder, className, error, required }: SelectProps) => {
    return (
        <div>
            {label && <label htmlFor={name}>{label}{required && <span className='text-red-500'> *</span>}</label>}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full pl-4 py-2.5 mt-1 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-black/30 focus:border-black'} rounded-md focus:outline-none focus:ring-1 transition-all ${className}`}
                required={required}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};