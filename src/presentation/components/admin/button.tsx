import Link from "next/link";
import { Loader2 } from "lucide-react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    href?: string;
    type?: "button" | "submit" | "reset";
    isLoading?: boolean;
    disabled?: boolean;
}

export function Button({ children, onClick, className = "", href, type, isLoading, disabled }: ButtonProps) {
    const baseStyles = `px-4 py-3 bg-black text-white rounded-md hover:bg-black/80 transition-colors shadow-lg flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base font-bold hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`;

    if (href) {
        // If disabled or loading, prevent navigation interaction on the Link
        return (
            <Link href={href} className={disabled || isLoading ? "pointer-events-none" : ""} aria-disabled={disabled || isLoading}>
                <button type={type || "button"} disabled={disabled || isLoading} className={baseStyles}>
                    {isLoading && <Loader2 className="animate-spin" size={18} />}
                    {children}
                </button>
            </Link>
        );
    }

    return (
        <button
            type={type || "button"}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={baseStyles}
        >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {children}
        </button>
    );
}