import Link from 'next/link';
import { Plant } from '@/domain/entities/plant.entity';
import { FavoriteButton } from '@/presentation/components/features/favorite-button';
import { Star, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlantCardProps {
    plant: Plant;
}

export const PlantCard = ({ plant }: PlantCardProps) => {
    const price = plant.price || 0;
    const discountPrice = plant.discountPrice;

    // Within last 30 days
    const isNew = new Date().getTime() - new Date(plant.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

    // Mock data for ratings/reviews if they don't exist yet in DB
    const rating = plant.rating || 4.8;
    const reviewCount = plant.reviewCount || 128;

    // Map categories to display labels
    const categoryLabel = plant.category || "Indoor Plants";

    return (
        <div className="group block h-full bg-white rounded-[40px] p-4 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-black/5 flex flex-col">
            <Link href={`/plants/${plant.id}`} className="block relative mb-6">
                {/* Image Container */}
                <div className="aspect-square bg-[#FAF9F6] relative overflow-hidden rounded-[32px]">
                    {plant.images[0] ? (
                        <img
                            src={plant.images[0]}
                            alt={plant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            No Image
                        </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        {isNew ? (
                            <span className="bg-[#2D5A42] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg border border-white/10 backdrop-blur-sm">
                                <Star size={10} fill="white" className="text-white" /> Bestseller
                            </span>
                        ) : plant.discountPrice ? (
                            <span className="bg-[#D36E45] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg border border-white/10 backdrop-blur-sm">
                                <Star size={10} fill="white" className="text-white" /> Sale
                            </span>
                        ) : (
                            <span className="bg-[#2D5A42] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg border border-white/10 backdrop-blur-sm">
                                <Star size={10} fill="white" className="text-white" /> Bestseller
                            </span>
                        )}
                    </div>

                    {/* Like button overlay */}
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FavoriteButton
                            plant={plant}
                            className="bg-white/90 backdrop-blur-md shadow-sm"
                        />
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 px-2 pb-2">
                <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 font-sans">
                    {categoryLabel}
                </span>

                <Link href={`/plants/${plant.id}`}>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-[#1A2E26] hover:text-[#2D5A42] transition-colors line-clamp-1 mb-2">
                        {plant.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4 font-sans">
                    <Star size={14} fill="#D36E45" className="text-[#D36E45]" />
                    <span className="text-sm font-bold text-[#1A2E26]">{rating}</span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm">{reviewCount} reviews</span>
                </div>

                {/* Sub-info / Care Tags */}
                <div className="flex items-center gap-2 mb-6 text-xs font-medium text-gray-500 font-sans">
                    <span className="text-[#2D5A42] font-bold">Easy Care</span>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1">
                        <Star size={12} className="text-gray-400" />
                        <span>Medium Light</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2 font-sans">
                        <span className="text-2xl font-bold text-[#1A2E26]">₹{discountPrice || price}</span>
                        {discountPrice && (
                            <span className="text-sm text-gray-400 line-through font-medium">₹{price}</span>
                        )}
                    </div>

                    <button className="bg-[#D36E45] text-white p-3 rounded-[18px] shadow-lg hover:bg-[#B85C36] transition-all transform active:scale-95">
                        <ShoppingBag size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
