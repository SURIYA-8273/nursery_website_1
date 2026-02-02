import Link from "next/link";

export function Button({ children, onClick, className, href }: { children: React.ReactNode, onClick?: () => void, className?: string, href?: string }) {
    if (href) {
        return (
            <Link href={href}>
                <button className={`px-4 py-3 bg-black text-white rounded-md hover:bg-black/80 transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base  font-bold hover:cursor-pointer  ${className}`}>
                    {children}
                </button>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={`px-4 py-3 bg-black text-white rounded-md hover:bg-black/80 transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base font-bold hover:cursor-pointer ${className}`}>
            {children}
        </button>
    );
}