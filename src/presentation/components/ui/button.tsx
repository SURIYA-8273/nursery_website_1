import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-primary/30",
                secondary: "bg-surface text-text-primary hover:bg-secondary/10 border border-secondary/20",
                outline: "border-2 border-primary text-primary hover:bg-primary/5 bg-transparent",
                ghost: "hover:bg-black/5 text-text-secondary hover:text-text-primary",
                link: "text-primary underline-offset-4 hover:underline",
                destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-red-500/30",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-full px-4 text-xs",
                lg: "h-14 rounded-full px-8 text-lg",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
