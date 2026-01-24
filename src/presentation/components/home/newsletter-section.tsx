'use client';

import { Button } from "../ui/button";
import { Heading, Text } from "../ui/typography";
import { Input } from "../ui/input";

export const NewsletterSection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            {/* Decorative leaves */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto px-4 text-center">
                <Heading level={2} className="mb-4">Join Our Green Community</Heading>
                <Text variant="secondary" className="mb-8 max-w-xl mx-auto">
                    Get weekly plant care tips, exclusive access to new arrivals, and special offers delivered straight to your inbox.
                </Text>

                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <Input
                        placeholder="Enter your email address"
                        className="bg-white border-white h-14 rounded-full px-6 shadow-sm focus:ring-primary/20"
                    />
                    <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">
                        Subscribe
                    </Button>
                </form>

                <p className="mt-4 text-xs text-text-muted">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </section>
    );
};
