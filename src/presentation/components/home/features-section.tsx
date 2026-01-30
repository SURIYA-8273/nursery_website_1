import { Truck, ShieldCheck, HeartPulse, Headset } from 'lucide-react';
import { Heading } from './heading';


const features = [
    {
        icon: HeartPulse,
        title: "Certified Healthy",
        description: "Every plant is checked by experts before shipping to ensure it's disease-free."
    },
    {
        icon: Truck,
        title: "Free Shipping",
        description: "Enjoy free, safe, and secure delivery on all orders above ₹999."
    },
    {
        icon: ShieldCheck,
        title: "30-Day Guarantee",
        description: "If your plant doesn't survive within 30 days, we'll replace it for free."
    },
    {
        icon: Headset,
        title: "Expert Advice",
        description: "Get lifetime support from our gardening experts for all your plant care needs."
    }
];

export const FeaturesSection = () => {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header - Responsive spacing and text */}
                <Heading title="Why Choose GreenRoots?" subtitle="We don't just sell plants; we nurture them. Experience the difference of nursery-grown quality." />



                {/* Responsive Grid - 2 cols mobile, 4 cols desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-[var(--color-surface-hover)] p-4 sm:p-6 md:p-7 lg:p-8 rounded-2xl md:rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group"
                        >
                            {/* Icon - Responsive sizing */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[var(--color-surface)] rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white text-[var(--color-primary-light)] transition-colors">
                                <feature.icon size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                            </div>

                            {/* Title - Responsive sizing */}
                            <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-[var(--color-text-primary)] mb-2 md:mb-3 leading-tight">
                                {feature.title}
                            </h3>

                            {/* Description - Responsive sizing */}
                            <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
