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

    const fetchStats = async () => {
        const repo = new SupabasePlantRepository();
        // In a real app we'd have optimized count queries
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

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-black">Dashboard</h1>
                <p className="text-sm md:text-base text-text-secondary">Overview of your store performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-secondary/10">
                    <h3 className="text-text-muted text-xs md:text-sm font-bold uppercase tracking-wider">Total Plants</h3>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-3xl lg:text-4xl font-serif text-black">{stats.totalPlants}</p>
                        <Link href="/admin/plants" className="bg-neutral-100 p-2 rounded-full text-black hover:bg-neutral-200 transition-colors">
                            <ArrowUpRight size={20} />
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-secondary/10">
                    <h3 className="text-text-muted text-xs md:text-sm font-bold uppercase tracking-wider">Active Listings</h3>
                    <p className="text-3xl lg:text-4xl font-serif text-black mt-2">{stats.activePlants}</p>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-secondary/10">
                    <h3 className="text-text-muted text-xs md:text-sm font-bold uppercase tracking-wider">Low Stock Alerts</h3>
                    <p className={`text-3xl lg:text-4xl font-serif mt-2 ${stats.lowStock > 0 ? 'text-black font-bold' : 'text-black'}`}>
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
