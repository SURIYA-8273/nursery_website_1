import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Heading } from '../ui/typography';

const categories = [
    {
        name: 'Indoor Plants',
        count: '45+ plants',
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1887&auto=format&fit=crop',
        href: '/plants?category=indoor'
    },
    {
        name: 'Outdoor Garden',
        count: '30+ plants',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1932&auto=format&fit=crop',
        href: '/plants?category=outdoor'
    },
    {
        name: 'Succulents',
        count: '25+ plants',
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=1974&auto=format&fit=crop',
        href: '/plants?category=succulents'
    },
    {
        name: 'Pots & Organic Soil',
        count: 'Tools & Care',
        image: 'https://images.unsplash.com/photo-1416879895691-14022a0aec41?q=80&w=1948&auto=format&fit=crop',
        href: '/plants?category=tools'
    }
];

export const CategoryHighlights = () => {
    return (
        <section className="py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <Heading level={2}>Shop by Category</Heading>
                        <p className="text-text-secondary mt-2">Find the perfect plant for your space</p>
                    </div>
                    <Link href="/plants" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                        View All Categories <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <Link key={i} href={cat.href} className="group relative h-[350px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h3 className="text-2xl font-serif font-bold text-white mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    {cat.name}
                                </h3>
                                <p className="text-white/80 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                                    {cat.count}
                                </p>

                                <div className="absolute right-6 bottom-8 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/plants" className="inline-flex items-center gap-2 text-primary font-bold">
                        View All Categories <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};
