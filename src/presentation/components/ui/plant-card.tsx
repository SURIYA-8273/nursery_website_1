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
            <div className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden border border-transparent hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col">
                {/* Image Container - Responsive aspect ratio */}
                <div className="aspect-square md:aspect-[3/4] bg-surface relative overflow-hidden">
                    {/* Gradient overlay on hover for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                    {/* Image */}
                    {plant.images[0] ? (
                        <img
                            src={plant.images[0]}
                            alt={plant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary/40 bg-surface">
                            <span className="text-xs md:text-sm">No Image</span>
                        </div>
                    )}

                    {/* Badges - Responsive sizing */}
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5 md:gap-2 z-20">
                        {discount > 0 && (
                            <span className="bg-accent text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shadow-md">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Floating Favorite Button - Responsive sizing */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                        <FavoriteButton
                            plant={plant}
                            className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg transition-all scale-90 md:scale-100"
                        />
                    </div>

                    {/* Quick Action Button - Responsive sizing and positioning */}
                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <button
                            className="bg-white text-primary p-2 md:p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-95"
                            aria-label="Add to cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content - Responsive padding and text sizing */}
                <div className="p-3 md:p-4 lg:p-5 flex flex-col flex-1">
                    {/* Title - Responsive font size */}
                    <h3 className="font-serif text-base md:text-lg lg:text-xl text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {plant.name}
                    </h3>

                    {/* Description - Responsive font size */}
                    <p className="text-xs md:text-sm text-text-muted mb-2 md:mb-3 line-clamp-2 leading-relaxed">
                        {plant.description}
                    </p>

                    {/* Price Section - Responsive sizing */}
                    <div className="mt-auto flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5 md:gap-2">
                            <span className="font-semibold text-base md:text-lg lg:text-xl text-primary">
                                ₹{plant.discountPrice || plant.price}
                            </span>
                            {plant.discountPrice && (
                                <span className="text-xs md:text-sm text-text-muted line-through">
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
