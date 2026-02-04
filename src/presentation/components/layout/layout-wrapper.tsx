'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { ToastProvider } from '../ui/toast-provider';
import { SupportChatWidget } from '../features/support-chat-widget';
import { CartProvider } from '@/presentation/context/cart-context';
import { SettingsProvider } from '@/presentation/context/settings-context';
import { BusinessSettings } from '@/domain/entities/settings.entity';

import { WishlistProvider } from '@/presentation/context/wishlist-context';
import { CatalogProvider } from '@/presentation/context/catalog-context';
import { Plant, Category } from '@/domain/entities/plant.entity';

export const LayoutWrapper = ({
    children,
    settings,
    featuredPlants,
    categories
}: {
    children: React.ReactNode,
    settings?: Partial<BusinessSettings> | null,
    featuredPlants?: Plant[],
    categories?: Category[]
}) => {
    const pathname = usePathname();

    // Check if current route is an admin route
    const isAdminRoute = pathname?.startsWith('/admin');

    // Don't render Navbar and Footer for admin routes
    if (isAdminRoute) {
        return (
            <SettingsProvider initialSettings={settings}>
                <CatalogProvider initialFeaturedPlants={featuredPlants} initialCategories={categories}>
                    <WishlistProvider>
                        <CartProvider>
                            {children}
                            <ToastProvider />
                        </CartProvider>
                    </WishlistProvider>
                </CatalogProvider>
            </SettingsProvider>
        );
    }

    // Render Navbar and Footer for all other routes
    return (
        <SettingsProvider initialSettings={settings}>
            <CatalogProvider initialFeaturedPlants={featuredPlants} initialCategories={categories}>
                <WishlistProvider>
                    <CartProvider>
                        <Navbar />
                        {children}
                        <SupportChatWidget />
                        <Footer />
                        <ToastProvider />
                    </CartProvider>
                </WishlistProvider>
            </CatalogProvider>
        </SettingsProvider>
    );
};
