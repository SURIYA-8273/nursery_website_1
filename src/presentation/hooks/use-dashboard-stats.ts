import { useState, useEffect } from 'react';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { SupabaseCategoryRepository } from '@/data/repositories/supabase-category.repository';
import { SupabaseGoogleReviewsRepository } from '@/data/repositories/supabase-google-reviews.repository';

export const useDashboardStats = () => {
    const [stats, setStats] = useState({
        totalPlants: 0,
        activePlants: 0,
        lowStock: 0,
        totalCategories: 0,
        totalReviews: 0,
    });

    const fetchStats = async () => {
        const plantRepo = new SupabasePlantRepository();
        const categoryRepo = new SupabaseCategoryRepository();
        const reviewRepo = new SupabaseGoogleReviewsRepository();

        const [
            { plants, total: totalPlants },
            totalCategories,
            totalReviews
        ] = await Promise.all([
            plantRepo.getPlants({ limit: 1000 }),
            categoryRepo.countCategories(),
            reviewRepo.countReviews()
        ]);

        setStats({
            totalPlants,
            activePlants: plants.filter(p => p.isActive).length,
            lowStock: plants.filter(p => (p.stock || 0) < 5).length,
            totalCategories,
            totalReviews
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchStats();
        };
        fetchData();
    }, []);

    return stats;
};
