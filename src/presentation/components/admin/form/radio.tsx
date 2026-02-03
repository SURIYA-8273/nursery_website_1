export function Radio({ onChange, fields,label }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, fields: { label: string, value: string, checked?: boolean, name?: string }[],label?:string }) {

    if (fields.length <= 0) return <span></span>

    return (
        <>
            {label && <span className="">{label}</span>}
           <div className="flex gap-4 mt-1">
             {fields.map((field, index) => {
                return (
                    <label key={index} className="flex items-center gap-2">
                        <input type="radio" name={field.name} value={field.value} checked={field.checked} onChange={onChange} className="w-4 h-4" />
                        <span>{field.label}</span>
                    </label>
                )
            })}
           </div>
        </>
    );
}