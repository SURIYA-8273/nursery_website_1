


export const Heading = ({ title, subtitle }: { title: string; subtitle?: string }) => {
    return (
        <div className="flex flex-col items-center mb-3 gap-3">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-[var(--color-text-secondary)] font-medium text-center">
                    {subtitle}
                </p>
            )}
        </div>
    );
};