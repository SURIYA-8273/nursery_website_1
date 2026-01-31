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
        <section className="bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header - Responsive spacing and text */}
                <Heading title="Why Choose Inner Loop Technologies?" subtitle="We don't just sell plants; we nurture them. Experience the difference of nursery-grown quality." />



                {/* Responsive Grid - 2 cols mobile, 4 cols desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="group bg-[var(--color-surface-hover)]  p-4 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-black/10 shadow-sm hover:border-[var(--color-primary)] flex flex-col items-center justify-center"
                        >
                            {/* Icon - Responsive sizing */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16  rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 bg-[var(--color-primary)] group-hover:text-[var(--color-primary-light)] text-white  transition-colors">
                                <feature.icon size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                            </div>

                            {/* Title - Responsive sizing */}

                            <h3 className="font-serif text-xl md:text-3xl font-bold text-center text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors pb-2">
                                {feature.title}
                            </h3>

                            {/* Description - Responsive sizing */}

                            <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed opacity-70 text-center">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
