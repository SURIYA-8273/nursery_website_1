'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sprout, Droplets, Star } from 'lucide-react';

interface ProductTabsProps {
    description: string;
    care: string;
}

export const ProductTabs = ({ description, care }: ProductTabsProps) => {
    const [activeTab, setActiveTab] = useState<'description' | 'care' | 'reviews'>('description');

    const tabs = [
        { id: 'description', label: 'Description', icon: Sprout },
        { id: 'care', label: 'Care Guide', icon: Droplets },
        { id: 'reviews', label: 'Reviews', icon: Star },
    ] as const;

    return (
        <div className="mt-12">
            <div className="flex border-b border-secondary/20 mb-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-colors whitespace-nowrap",
                            activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-text-secondary hover:text-primary hover:border-primary/30"
                        )}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[200px] animate-in fade-in duration-300">
                {activeTab === 'description' && (
                    <div className="prose prose-green max-w-none text-text-secondary leading-relaxed">
                        <p>{description}</p>
                    </div>
                )}

                {activeTab === 'care' && (
                    <div className="bg-surface p-6 rounded-2xl border border-secondary/10">
                        <h4 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                            <Droplets className="text-blue-500" />
                            How to care for your plant
                        </h4>
                        <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                            {care || "Keep soil moist but not waterlogged. Place in bright, indirect light."}
                        </p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-secondary/20">
                        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="font-bold text-text-primary">No reviews yet</h3>
                        <p className="text-text-secondary text-sm mt-1">Be the first to review this plant!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
