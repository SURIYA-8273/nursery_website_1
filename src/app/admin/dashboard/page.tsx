'use client';

import { useEffect, useState } from 'react';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { Plant } from '@/domain/entities/plant.entity';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalPlants: 0,
        activePlants: 0,
        lowStock: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const repo = new SupabasePlantRepository();
        // In a real app we'd have optimized count queries
        const { plants, total } = await repo.getPlants({ limit: 1000 });

        setStats({
            totalPlants: total,
            activePlants: plants.filter(p => p.isActive).length,
            lowStock: plants.filter(p => p.stock < 5).length,
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-primary">Dashboard</h1>
                <p className="text-text-secondary">Overview of your store performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/10">
                    <h3 className="text-text-muted text-sm font-bold uppercase tracking-wider">Total Plants</h3>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-4xl font-serif text-primary">{stats.totalPlants}</p>
                        <Link href="/admin/plants" className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/10">
                    <h3 className="text-text-muted text-sm font-bold uppercase tracking-wider">Active Listings</h3>
                    <p className="text-4xl font-serif text-primary mt-2">{stats.activePlants}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/10">
                    <h3 className="text-text-muted text-sm font-bold uppercase tracking-wider">Low Stock Alerts</h3>
                    <p className={`text-4xl font-serif mt-2 ${stats.lowStock > 0 ? 'text-red-500' : 'text-primary'}`}>
                        {stats.lowStock}
                    </p>
                </div>
            </div>

            {/* Placeholder for future charts/widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-secondary/10 h-64 flex items-center justify-center text-text-muted">
                    Sales Chart Placeholder
                </div>
                <div className="bg-white p-8 rounded-3xl border border-secondary/10 h-64 flex items-center justify-center text-text-muted">
                    Recent Orders Placeholder
                </div>
            </div>
        </div>
    );
}
