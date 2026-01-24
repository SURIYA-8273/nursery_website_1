'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/data/datasources/supabase.client';
import { APP_CONFIG } from '@/core/config/constants';
import { Loader2 } from 'lucide-react';

import { AdminSidebar } from '@/presentation/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Allow access to login page without auth
            if (pathname === APP_CONFIG.routes.admin.login) {
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.replace(APP_CONFIG.routes.admin.login);
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    // If on login page, don't show sidebar
    if (pathname === APP_CONFIG.routes.admin.login) {
        return <div className="min-h-screen bg-surface">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-surface flex">
            <AdminSidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
