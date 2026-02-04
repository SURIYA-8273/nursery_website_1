'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Plant, Category } from '@/domain/entities/plant.entity';
import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';

interface CatalogContextType {
    featuredPlants: Plant[];
    categories: Category[];
    isLoading: boolean;
    refreshCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

interface CatalogProviderProps {
    children: React.ReactNode;
    initialFeaturedPlants?: Plant[];
    initialCategories?: Category[];
}

export const CatalogProvider = ({
    children,
    initialFeaturedPlants = [],
    initialCategories = []
}: CatalogProviderProps) => {
    const [featuredPlants, setFeaturedPlants] = useState<Plant[]>(initialFeaturedPlants);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isLoading, setIsLoading] = useState(false);

    const refreshCatalog = async () => {
        setIsLoading(true);
        try {
            const repo = new SupabasePlantRepository();
            const [plantsData, categoriesData] = await Promise.all([
                repo.getFeaturedPlants(),
                repo.getCategories() // Note: This might fetch all. For 'featured' categories we usually slice.
            ]);

            setFeaturedPlants(plantsData);
            // If we want only top 4 categories as per original design, we can slice here OR keep all.
            // Keeping all is better for a context called 'categories'.
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to fetch catalog:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Use effect to fetch if no initial data provided (client-side fallback)
    useEffect(() => {
        if (initialFeaturedPlants.length === 0 && initialCategories.length === 0) {
            refreshCatalog();
        }
    }, []);

    return (
        <CatalogContext.Provider value={{ featuredPlants, categories, isLoading, refreshCatalog }}>
            {children}
        </CatalogContext.Provider>
    );
};

export const useCatalog = () => {
    const context = useContext(CatalogContext);
    if (context === undefined) {
        throw new Error('useCatalog must be used within a CatalogProvider');
    }
    return context;
};
