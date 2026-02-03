import { useState, useEffect } from 'react';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';

export const useDashboardStats = () => {
    const [stats, setStats] = useState({
        totalPlants: 0,
        activePlants: 0,
        lowStock: 0,
    });

    const fetchStats = async () => {
        const repo = new SupabasePlantRepository();
        const { plants, total } = await repo.getPlants({ limit: 1000 });
        setStats({
            totalPlants: total,
            activePlants: plants.filter(p => p.isActive).length,
            lowStock: plants.filter(p => (p.stock || 0) < 5).length,
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
