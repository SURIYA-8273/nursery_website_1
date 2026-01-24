import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

// Heading Component
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, level = 1, children, ...props }, ref) => {
        const Comp = `h${level}` as const;
        const styles = {
            1: "font-serif text-4xl md:text-5xl font-bold text-primary",
            2: "font-serif text-3xl md:text-4xl font-bold text-primary",
            3: "font-serif text-2xl font-bold text-text-primary",
            4: "font-sans text-xl font-bold text-text-primary",
            5: "font-sans text-lg font-bold text-text-primary",
            6: "font-sans text-base font-bold text-text-primary",
        };

        return (
            <Comp
                ref={ref}
                className={cn(styles[level], className)}
                {...props}
            >
                {children}
            </Comp>
        );
    }
);
Heading.displayName = "Heading";

// Text Component
interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
    variant?: "default" | "muted" | "secondary" | "caption" | "lead";
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const styles = {
            default: "text-text-primary leading-relaxed",
            secondary: "text-text-secondary leading-relaxed",
            muted: "text-text-muted",
            caption: "text-xs text-text-muted",
            lead: "text-xl text-text-secondary font-medium",
        };

        return (
            <p
                ref={ref}
                className={cn(styles[variant], className)}
                {...props}
            >
                {children}
            </p>
        );
    }
);
Text.displayName = "Text";
