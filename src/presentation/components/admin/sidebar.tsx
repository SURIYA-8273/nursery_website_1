'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Leaf, List, Settings, LogOut, X, Image as ImageIcon, Star, LayoutTemplate, ClipboardList, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/data/datasources/supabase.client';
import { useRouter } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Plants', href: '/admin/plants', icon: Leaf },
    { label: 'Categories', href: '/admin/categories', icon: List },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Chatbot', href: '/admin/chatbot', icon: MessageSquare },
    { label: 'Site Content', href: '/admin/home-content', icon: LayoutTemplate },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "w-64 bg-white border-r border-secondary/10 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-8 border-b border-secondary/10 flex items-center justify-between">
                    <h1 className="font-serif text-2xl font-bold text-black tracking-tight">
                        Admin Panel
                    </h1>
                    {/* Close button for mobile only */}
                    <button onClick={onClose} className="md:hidden text-text-secondary hover:text-black">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => onClose()} // Close sidebar on mobile when link is clicked
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                                    isActive
                                        ? "bg-black text-white shadow-md shadow-black/20"
                                        : "text-black hover:bg-neutral-100 hover:text-black"
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
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-neutral-100 hover:text-black transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};
