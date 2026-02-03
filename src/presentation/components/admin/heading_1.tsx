export function Heading1({ title, description,headingClassName }: { title: string, description?: string,headingClassName?:string }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
            <div>
                <h1 className={`font-serif text-3xl md:text-4xl font-bold text-black ${headingClassName}`}>{title}</h1>
                {description && <p className="text-md md:text-base text-text-secondary">{description}</p>}
            </div>
        </div>
    );
}