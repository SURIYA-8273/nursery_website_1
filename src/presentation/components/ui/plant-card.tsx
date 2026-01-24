import Link from 'next/link';
import { Plant } from '@/domain/entities/plant.entity';
import { semantic } from '@/core/theme/semantic';
import { FavoriteButton } from '@/presentation/components/features/favorite-button';

interface PlantCardProps {
    plant: Plant;
}

export const PlantCard = ({ plant }: PlantCardProps) => {
    const discount = plant.discountPrice ? Math.round(((plant.price - plant.discountPrice) / plant.price) * 100) : 0;

    return (
        <Link href={`/plants/${plant.slug}`} className="group block h-full relative">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-transparent hover:border-secondary/20 transition-all duration-300 shadow-sm hover:shadow-soft h-full flex flex-col">
                {/* Image Container */}
                <div className="aspect-[4/5] bg-surface relative overflow-hidden">
                    {/* Placeholder for real image */}
                    {plant.images[0] ? (
                        <img
                            src={plant.images[0]}
                            alt={plant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary/40 bg-surface">
                            No Image
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {discount > 0 && (
                            <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Floating Fave Button */}
                    <div className="absolute top-3 right-3 z-10">
                        <FavoriteButton plant={plant} className="bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white" />
                    </div>

                    {/* Quick Action Button (appear on hover) */}
                    <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-serif text-xl text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {plant.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-3 line-clamp-2">
                        {plant.description}
                    </p>

                    <div className="mt-auto flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-lg text-primary">
                                ₹{plant.discountPrice || plant.price}
                            </span>
                            {plant.discountPrice && (
                                <span className="text-sm text-text-muted line-through">
                                    ₹{plant.price}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
