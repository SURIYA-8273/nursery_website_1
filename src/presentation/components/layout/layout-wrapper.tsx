'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    // Check if current route is an admin route
    const isAdminRoute = pathname?.startsWith('/admin');

    // Don't render Navbar and Footer for admin routes
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // Render Navbar and Footer for all other routes
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};
