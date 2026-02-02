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
}

export const Select = ({ label, name, value, onChange, options, placeholder, className }: SelectProps) => {
    return (
        <div>
            {label && <label htmlFor={name}>{label}</label>}
            <select id={name} name={name} value={value} onChange={onChange} className={"w-full pl-4 py-2.5 mt-1 border border-black/30 rounded-md focus:outline-none focus:ring-1 focus:border-black transition-all" + className}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};