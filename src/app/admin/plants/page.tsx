'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { Plant } from '@/domain/entities/plant.entity';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';

export default function AdminPlantsPage() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPlants = async () => {
        setLoading(true);
        const repo = new SupabasePlantRepository();
        // Fetch all plants
        const { plants } = await repo.getPlants({ limit: 100 });
        setPlants(plants);
        setLoading(false);
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-primary">Plants</h1>
                    <p className="text-text-secondary">Manage your inventory</p>
                </div>

                <Link href="/admin/plants/new" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-primary-hover shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                    <Plus size={20} />
                    Add Plant
                </Link>
            </div>

            {/* Plant Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-secondary/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/5 border-b border-secondary/10">
                            <tr>
                                <th className="p-6 font-bold text-text-secondary">Plant</th>
                                <th className="p-6 font-bold text-text-secondary">Price</th>
                                <th className="p-6 font-bold text-text-secondary">Stock</th>
                                <th className="p-6 font-bold text-text-secondary">Status</th>
                                <th className="p-6 font-bold text-text-secondary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/10">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-text-muted">Loading inventory...</td>
                                </tr>
                            ) : plants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-text-muted">No plants found.</td>
                                </tr>
                            ) : (
                                plants.map((plant) => (
                                    <tr key={plant.id} className="hover:bg-surface transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden shrink-0">
                                                    {plant.images[0] && <img src={plant.images[0]} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-text-primary line-clamp-1">{plant.name}</div>
                                                    <div className="text-xs text-text-muted hidden md:block font-mono">{plant.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 font-medium">₹{plant.price}</td>
                                        <td className="p-6">{plant.stock}</td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${plant.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {plant.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-secondary/10 rounded-full text-text-muted hover:text-primary transition-colors">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 rounded-full text-text-muted hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
