import { PlantCard } from '@/presentation/components/ui/plant-card';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';

// This would ideally come from a Use Case like `GetRelatedPlants`
export const RelatedPlants = async () => {
    const repo = new SupabasePlantRepository();
    // Fetching random featured plants as "related" for now
    const related = await repo.getFeaturedPlants();

    // Take only 4
    const displayPlants = related.slice(0, 4);

    return (
        <section className="mt-20">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {displayPlants.map(plant => (
                    <PlantCard key={plant.id} plant={plant} />
                ))}
            </div>
        </section>
    );
};
