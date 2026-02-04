'use client';

import { Truck, ShieldCheck, HeartPulse, Headset } from 'lucide-react';
import { Heading } from './heading';
const features = [
    {
        title: "Healthy Quality Plants",
        description: "We grow and maintain all plants with proper care to ensure they are fresh, strong, and healthy."
    },
    {
        title: "Local Delivery Available",
        description: "Fast and safe plant delivery available within nearby areas for your convenience."
    },
    {

        title: "Affordable Prices",
        description: "Best nursery prices with high-quality plants suitable for homes, gardens, and landscapes."
    },
    {
        title: "Plant Care Guidance",
        description: "Free expert advice on watering, sunlight, and maintenance for every plant you buy."
    }
];

import { useSettings } from '@/presentation/context/settings-context';

export const AboutUsSection = () => {
    const { settings } = useSettings();
    const description = settings?.aboutUsDescription;
    const dynamicFeatures = settings?.aboutUsFeatures;

    return (
        <section className="bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header - Responsive spacing and text */}
                <Heading title="About Us" subtitle={description || "Our nursery garden offers a wide variety of healthy plants, flowers, and trees grown with care and passion. We provide quality plants for homes, offices, and landscapes, helping you bring nature closer to your life. Fresh, affordable, and eco-friendly — your perfect green partner."} />



                {/* Responsive Grid - 2 cols mobile, 4 cols desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 pt-1">
                    {(dynamicFeatures && dynamicFeatures.length > 0 ? dynamicFeatures : features).map((feature, i) => (
                        <div
                            key={i}
                            className="group bg-[var(--color-surface-hover)]  p-4 md:p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 rounded-[10px] border border-primary/50 shadow-sm flex flex-col items-center justify-center"
                        >


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
