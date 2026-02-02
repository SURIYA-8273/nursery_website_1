import { useState, useEffect } from 'react';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';

export const Footer = () => {
    const [businessName, setBusinessName] = useState('Inner Loop Technologies');

    useEffect(() => {
        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            if (data?.businessName) {
                setBusinessName(data.businessName);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-primary/5 pt-8 pb-8 border-t border-primary/10">
            <div className=" border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
                <div className="flex flex-col gap-2 text-center">
                    <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
                    <p className="text-xs text-text-muted/80 text-center">
                        Developer by Inner Loop Technologies • <a href="mailto:innerloopdev@gmail.com" className="hover:text-primary transition-colors">innerloopdev@gmail.com</a> • <a href="tel:+916369363788" className="hover:text-primary transition-colors">+91 6369363788</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};
