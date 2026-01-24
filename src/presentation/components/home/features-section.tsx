import { Truck, ShieldCheck, HeartPulse, Headset } from 'lucide-react';
import { Heading, Text } from "../ui/typography";

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
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <Heading level={2} className="mb-4">Why Choose GreenRoots?</Heading>
                    <Text variant="secondary">
                        We don't just sell plants; we nurture them. Experience the difference of nursery-grown quality.
                    </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-surface p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border border-secondary/10 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <feature.icon size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-xl text-primary mb-3">{feature.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
