"use client";

import { Plant } from "@/domain/entities/plant.entity";
import { PlantCard } from "@/presentation/components/ui/plant-card";
import { Heading } from "./heading";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

import { useCatalog } from "@/presentation/context/catalog-context";

interface FeaturedPlantsProps {
    title: string;
    subtitle?: string;
    // plants: Plant[]; // Deprecated
    plants?: any;
    viewAllLink?: string;
}

export const FeaturedPlants = ({ title, subtitle, viewAllLink }: FeaturedPlantsProps) => {
    const { featuredPlants } = useCatalog();

    return (
        <section className="bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <Heading title={title} subtitle={subtitle} />
                {featuredPlants.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
                        {featuredPlants.map((plant) => (
                            <PlantCard key={plant.id} plant={plant} badgeTitle="Best Selling" />
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
                                className="rounded-md"

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
