'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Leaf, List, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/data/datasources/supabase.client';
import { useRouter } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Plants', href: '/admin/plants', icon: Leaf },
    { label: 'Categories', href: '/admin/categories', icon: List },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <aside className="w-64 bg-white border-r border-secondary/10 h-screen fixed left-0 top-0 flex flex-col hidden md:flex z-50">
            <div className="p-8 border-b border-secondary/10">
                <h1 className="font-serif text-2xl font-bold text-primary tracking-tight">
                    Admin Panel
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-text-secondary hover:bg-surface hover:text-primary"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-secondary/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};
