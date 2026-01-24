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
        <section className="py-12 md:py-16 lg:py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header - Responsive spacing and text */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
                    <div>
                        <Heading level={2} className="text-2xl md:text-3xl lg:text-4xl">Shop by Category</Heading>
                        <p className="text-text-secondary mt-1 md:mt-2 text-sm md:text-base">Find the perfect plant for your space</p>
                    </div>
                    <Link href="/plants" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all text-sm lg:text-base">
                        View All Categories <ArrowRight size={20} />
                    </Link>
                </div>

                {/* Responsive Grid - 2 cols mobile, 4 cols desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            href={cat.href}
                            className="group relative h-48 sm:h-56 md:h-64 lg:h-80 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />

                            {/* Overlay - Responsive opacity */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

                            {/* Content - Responsive padding and text sizes */}
                            <div className="absolute bottom-0 left-0 p-4 sm:p-5 md:p-6 lg:p-8 w-full">
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-white mb-0.5 md:mb-1 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 leading-tight">
                                    {cat.name}
                                </h3>
                                <p className="text-white/80 text-xs sm:text-sm transform translate-y-3 md:translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                                    {cat.count}
                                </p>

                                {/* Arrow Icon - Responsive sizing */}
                                <div className="absolute right-4 sm:right-5 md:right-6 bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-8 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-3 md:translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                    <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile "View All" Link */}
                <div className="mt-6 md:mt-8 text-center md:hidden">
                    <Link href="/plants" className="inline-flex items-center gap-2 text-primary font-bold text-sm">
                        View All Categories <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};
