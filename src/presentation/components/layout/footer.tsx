'use client';

import { useState, useEffect } from 'react';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { BusinessSettings } from '@/domain/entities/settings.entity';
import { ICONS } from '@/core/config/icons';

export const Footer = () => {
    const [settings, setSettings] = useState<BusinessSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const repo = new SupabaseSettingsRepository();
                const data = await repo.getSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to load settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-surface)] pb-4 pt-2 border-t border-primary shadow-sm shadow-primary mt-5 flex flex-col items-center justify-center  text-[var(--color-text-primary)]">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                {/* Social Icons */}
                <div className="flex items-center justify-center gap-4 pt-2">
                    {settings?.instagramUrl && (
                        <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-[#D36E45]/10 p-2.5 rounded-full text-[#D36E45] hover:bg-[#D36E45] hover:text-white transition-all duration-300">
                            <ICONS.instagram size={18} />
                        </a>
                    )}
                    {settings?.facebookUrl && (
                        <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="bg-[#1877F2]/10 p-2.5 rounded-full text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                            <ICONS.facebook size={18} />
                        </a>
                    )}
                    {settings?.youtubeUrl && (
                        <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="bg-[#FF0000]/10 p-2.5 rounded-full text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                            <ICONS.youtube size={18} />
                        </a>
                    )}
                    {settings?.whatsappNumber && (
                        <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/10 p-2.5 rounded-full text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300">
                            <ICONS.whatsapp size={18} />
                        </a>
                    )}
                </div>



                {/* Bottom Bar: Copyright & Credits */}
                <div className="pt-4  flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        © {currentYear} <span className="font-bold text-[#2D5A42]">{settings?.businessName || 'Inner Loop Technologies'}</span>. All rights reserved.
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
                        <span>Developed by</span>
                        <a
                            href="mailto:innerloopdev@gmail.com"
                            className="font-bold"
                        >
                            Inner Loop Technologies
                        </a>
                        <span>+91 6369363788</span>
                    </p>

                </div>

            </div>
        </footer>
    );
};
