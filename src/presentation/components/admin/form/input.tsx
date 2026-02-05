export function Input({ label, name, value, onChange, placeholder, type, className, leadingIcon, required, step, min, max, error }: { label?: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string, className?: string, leadingIcon?: React.ReactNode, required?: boolean, step?: string, min?: string, max?: string, error?: string }) {
    return (
        <div>
            {label && <label className="text-black" htmlFor={name}>{label}{required && <span className='text-red-500'> *</span>}</label>}
            <div className='relative'>
                {leadingIcon && <span className='absolute left-3 top-1/2 -translate-y-1/2 text-text-muted'>{leadingIcon}</span>}
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full ${leadingIcon ? 'pl-10' : 'pl-3'} mt-1 pr-10 py-2.5 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-black/30 focus:border-black'} rounded-md focus:outline-none focus:ring-1 transition-all text-black ${className}`}
                    required={required}
                    step={step}
                    min={min}
                    max={max}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}