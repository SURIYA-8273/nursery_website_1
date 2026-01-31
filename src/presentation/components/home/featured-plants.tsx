import { Plant } from "@/domain/entities/plant.entity";
import { PlantCard } from "@/presentation/components/ui/plant-card";
import { Heading } from "./heading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface FeaturedPlantsProps {
    title: string;
    subtitle?: string;
    plants: Plant[];
    viewAllLink?: string;
}

export const FeaturedPlants = ({ title, subtitle, plants, viewAllLink }: FeaturedPlantsProps) => {
    return (
        <section className="bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <Heading title={title} subtitle={subtitle} />
                {plants.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
                        {plants.map((plant) => (
                            <PlantCard key={plant.id} plant={plant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--color-surface-hover)] rounded-[40px] border border-dashed border-white/10">
                        <p className="text-[var(--color-text-muted)] font-medium">No plants found in this collection.</p>
                    </div>
                )}

                <div className="flex justify-center mt-10">
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className=""
                        >
                            <Button
                                variant="default"
                                className=""
                                
                            >
                                Explore All <ArrowRight size={20} />
                            </Button>
                            
                        </Link>
                    )}

                </div>
            </div>
        </section>
    );
};
