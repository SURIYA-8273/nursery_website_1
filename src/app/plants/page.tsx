import { Suspense } from 'react';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { PlantsClient } from './plants-client';

// Revalidate every minute for new stock/prices
export const revalidate = 60;

export default async function PlantListingPage() {
    const repo = new SupabasePlantRepository();
    const { plants } = await repo.getPlants({
        limit: 200 // Get all for client-side filtering
    });

    const categories = await repo.getCategories();

    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
            <PlantsClient
                initialPlants={plants}
                categories={categories}
            />
        </Suspense>
    );
}
