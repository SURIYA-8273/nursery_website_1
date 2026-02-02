'use client';

import { useEffect, useState } from 'react';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { Leaf } from 'lucide-react';

export const LoadingScreen = () => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const repo = new SupabaseSettingsRepository();
                const settings = await repo.getSettings();
                if (settings?.logoUrl) {
                    setLogoUrl(settings.logoUrl);
                }
            } catch (error) {
                console.error("Failed to load logo for loader", error);
            }
        };
        fetchLogo();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center w-32 h-32">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-primary)] border-r-transparent border-b-[var(--color-secondary)] border-l-transparent animate-spin duration-[1.5s]" />
                <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-[var(--color-primary)]/30 border-b-transparent border-l-[var(--color-secondary)]/30 animate-spin duration-[2s] reverse" />

                {/* Inner Logo Container */}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden p-1 relative z-10 animate-pulse">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Loading..." className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <Leaf className="text-[var(--color-primary)] w-10 h-10 animate-bounce" />
                    )}
                </div>
            </div>
        </div>
    );
};
