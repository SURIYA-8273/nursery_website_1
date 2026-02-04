'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BusinessSettings } from '@/domain/entities/settings.entity';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';

interface SettingsContextType {
    settings: Partial<BusinessSettings> | null;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: React.ReactNode;
    initialSettings?: Partial<BusinessSettings> | null;
}

export const SettingsProvider = ({ children, initialSettings = null }: SettingsProviderProps) => {
    const [settings, setSettings] = useState<Partial<BusinessSettings> | null>(initialSettings);
    const [isLoading, setIsLoading] = useState(!initialSettings);

    const refreshSettings = async () => {
        setIsLoading(true);
        try {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // If no initial settings were provided, fetch them on mount
    useEffect(() => {
        if (!initialSettings) {
            refreshSettings();
        }
    }, [initialSettings]);

    return (
        <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
