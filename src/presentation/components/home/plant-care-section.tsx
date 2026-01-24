import { Heading, Text } from "../ui/typography";
import { Sun, CloudRain, Sprout } from 'lucide-react';
import Link from "next/link";
import { Button } from "../ui/button";

const articles = [
    {
        title: "How to care for Indoor Plants?",
        category: "Beginner Guide",
        image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=2005&auto=format&fit=crop",
        icon: Sun
    },
    {
        title: "Best Air Purifying Plants 2024",
        category: "Wellness",
        image: "https://images.unsplash.com/photo-1512428559087-560fa0cec34f?q=80&w=2070&auto=format&fit=crop",
        icon: CloudRain
    },
    {
        title: "Understanding Soil Types",
        category: "Potting",
        image: "https://images.unsplash.com/photo-1416879895691-14022a0aec41?q=80&w=1948&auto=format&fit=crop",
        icon: Sprout
    }
];

export const PlantCareSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <Heading level={2}>Plant Care Guides</Heading>
                        <p className="text-text-secondary mt-2">Expert tips to keep your green friends happy</p>
                    </div>
                    <Link href="/blog">
                        <Button variant="outline">Read All Articles</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary z-10">
                                    {article.category}
                                </div>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-secondary/10 rounded-full text-secondary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <article.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <button className="text-sm font-bold text-text-muted mt-2 underline decoration-transparent group-hover:decoration-primary transition-all">
                                        Read Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
