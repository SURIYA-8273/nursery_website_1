import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { CartClient } from './cart-client';

// Revalidate every minute
export const revalidate = 60;

export default async function CartPage() {
    const repo = new SupabasePlantRepository();
    // We can fetch featured plants or best sellers as "related"
    const relatedPlants = await repo.getFeaturedPlants();

    return <CartClient relatedPlants={relatedPlants} />;
}
