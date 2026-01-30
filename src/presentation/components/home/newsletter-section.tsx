'use client';

import { Button } from "../ui/button";
import { Heading, Text } from "../ui/typography";
import { Input } from "../ui/input";

export const NewsletterSection = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-[var(--color-surface)]">
            <div className="absolute inset-0 bg-[var(--color-primary)]/5 -z-10" />
            {/* Decorative leaves */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-secondary)]/10 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto px-4 text-center">
                <Heading level={2} className="mb-4 text-[var(--color-text-primary)]">Join Our Green Community</Heading>
                <p className="mb-8 max-w-xl mx-auto text-[var(--color-text-secondary)]">
                    Get weekly plant care tips, exclusive access to new arrivals, and special offers delivered straight to your inbox.
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <Input
                        placeholder="Enter your email address"
                        className="bg-[var(--color-surface-hover)] border-white/10 h-14 rounded-full px-6 shadow-sm focus:ring-[var(--color-primary)]/20 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                    />
                    <Button size="lg" className="rounded-full px-8 shadow-xl shadow-[var(--color-primary)]/20 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                        Subscribe
                    </Button>
                </form>

                <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
};
