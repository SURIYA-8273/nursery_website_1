import Link from 'next/link';
import { Leaf, Moon, Sun, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
    {
        name: 'Tropical Plants',
        description: 'Lush, dramatic foliage for statement spaces',
        count: '42 plants',
        icon: Leaf,
        href: '/plants?category=tropical',
        color: 'bg-[#ECF1EE]'
    },
    {
        name: 'Low Light',
        description: 'Perfect for shaded corners and offices',
        count: '28 plants',
        icon: Moon,
        href: '/plants?category=low-light',
        color: 'bg-[#F3F5F0]'
    },
    {
        name: 'Sun Loving',
        description: 'Flourish in bright, direct sunlight',
        count: '35 plants',
        icon: Sun,
        href: '/plants?category=sun-loving',
        color: 'bg-[#F9F7F0]'
    },
    {
        name: 'Air Purifiers',
        description: 'Clean the air while beautifying your home',
        count: '21 plants',
        icon: Wind,
        href: '/plants?category=air-purifying',
        color: 'bg-[#F0F5F6]'
    }
];

export const BrowseByCategory = () => {
    return (
        <section className="py-24 bg-[#FAF9F6]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[10px] md:text-xs font-bold text-[#4A5D54] uppercase tracking-[0.2em] mb-4 block">
                        BROWSE BY CATEGORY
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A2E26] mb-8 leading-tight">
                        Find Your Perfect Plant
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed opacity-80">
                        Whether you're looking for a low-maintenance companion or a tropical statement piece, we have something for every space and skill level.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            href={cat.href}
                            className="group bg-white rounded-[32px] p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 border border-transparent hover:border-gray-100 flex flex-col items-start gap-6"
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-[20px] flex items-center justify-center text-[#2D5A42]",
                                cat.color
                            )}>
                                <cat.icon size={32} strokeWidth={1.5} />
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1A2E26] group-hover:text-[#2D5A42] transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed opacity-70">
                                    {cat.description}
                                </p>
                            </div>

                            <span className="text-[#D36E45] font-bold text-sm md:text-base mt-2">
                                {cat.count}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
