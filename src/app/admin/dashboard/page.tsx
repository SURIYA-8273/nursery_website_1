'use client';

import { useDashboardStats } from '@/presentation/hooks/use-dashboard-stats';
import { Heading1 } from '@/presentation/components/admin/heading_1';
import { Button } from '@/presentation/components/admin/button';
import { ICONS } from '@/core/config/icons';

export default function AdminDashboardPage() {
    const stats = useDashboardStats();
    const statsCards = [
        {
            title: 'Total Plants',
            value: stats.totalPlants,
            href: '/admin/plants',
        },
        {
            title: 'Active Listings',
            value: stats.activePlants,
            href: '/admin/plants',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <Heading1
                title="Dashboard"
                description="Overview of your store performance"
            />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                {statsCards.map((card) => (
                    <div key={card.title} className="bg-white p-5 md:p-6 rounded-md shadow-sm border border-primary/30">
                        <h3 className="text-black text-xs md:text-sm font-bold uppercase ">{card.title}</h3>
                        <div className="flex items-end justify-between mt-2">
                            <p className="text-3xl lg:text-4xl font-serif text-black">{card.value}</p>
                            <Button
                                href={card.href}
                                className="rounded-full">
                                <ICONS.arrowUpRight size={20} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
