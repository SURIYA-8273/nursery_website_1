export function Checkbox({ label, name, checked, onChange }: { label: string, name: string, checked: boolean, onChange: (checked: boolean) => void }) {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={name}
                name={name}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
        </div>
    );
}
