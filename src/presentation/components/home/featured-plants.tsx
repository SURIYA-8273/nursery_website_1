import { Plant } from "@/domain/entities/plant.entity";
import { PlantCard } from "@/presentation/components/ui/plant-card";
import { Heading } from "@/presentation/components/ui/typography";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedPlantsProps {
    title: string;
    subtitle?: string;
    plants: Plant[];
    viewAllLink?: string;
}

export const FeaturedPlants = ({ title, subtitle, plants, viewAllLink }: FeaturedPlantsProps) => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1A2E26] mb-4">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-lg text-gray-500 font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center gap-2 text-[#2D5A42] font-bold text-lg hover:gap-3 transition-all"
                        >
                            Explore All <ArrowRight size={20} />
                        </Link>
                    )}
                </div>

                {plants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                        {plants.map((plant) => (
                            <PlantCard key={plant.id} plant={plant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#FAF9F6] rounded-[40px] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No plants found in this collection.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
