'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShoppingBag, Heart, Menu, X, Leaf } from 'lucide-react';
import { useCartStore } from '@/presentation/store/cart.store';
import { useWishlistStore } from '@/presentation/store/wishlist.store';
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { cart } = useCartStore();
    const { wishlist, refreshWishlist } = useWishlistStore();

    const [businessName, setBusinessName] = useState('Inner Loop Technologies');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    // Init stores & fetch settings
    useEffect(() => {
        refreshWishlist();

        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            console.log(data);
            if (data) {
                if (data.businessName) setBusinessName(data.businessName);
                if (data.logoUrl) setLogoUrl(data.logoUrl);
            }
        };
        fetchSettings();
    }, [refreshWishlist]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = pathname === '/';

    const navLinks = [
        { name: 'Home', href: isHome ? '#home' : '/#home' },
        { name: 'Category', href: isHome ? '#categories' : '/#categories' },
        { name: 'Plants', href: '/plants' },
        { name: 'Gallery', href: isHome ? '#gallery' : '/#gallery' },
        { name: 'Contact', href: isHome ? '#contact' : '/#contact' },
    ];

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            // Update URL hash without scrolling (optional, but good for history)
            window.history.pushState({}, '', href);
        } else if (href.startsWith('/#')) {
            // If on another page, let normal navigation happen to the home page + hash
            // But if we are already on home, we treat it as same-page scroll
            if (isHome) {
                e.preventDefault();
                const targetId = href.substring(2); // Remove '/#'
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                window.history.pushState({}, '', '#' + targetId);
            }
        }
    };

    return (
        <header
            className={cn(
                "sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--color-surface)] shadow-sm shadow-primary py-3",
                scrolled ? "shadow-md" : ""
            )}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-[#2F4F4F]   rounded-full transition-colors overflow-hidden flex items-center justify-center w-10 h-10">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Leaf size={20} fill="none" strokeWidth={2} />
                        )}
                    </div>
                    <span className="font-serif text-xl font-bold tracking-tight text-[var(--color-text-primary)] sm:block">
                        {businessName}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleScroll(e, link.href)}
                            className="text-[var(--color-text-primary)] font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Favorites/Wishlist */}
                    <Link href="/wishlist" className="relative group p-2">
                        <Heart size={24} className="text-[var(--color-text-primary)] group-hover:text-[#D36E45] transition-colors" />
                        {wishlist.totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-[#D36E45] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {wishlist.totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative group p-2">
                        <ShoppingBag size={24} className="text-[var(--color-text-primary)] group-hover:text-[#D36E45] transition-colors" />
                        {cart.totalItems >= 0 && (
                            <span className="absolute top-0 right-0 bg-[#D36E45] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {cart.totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Theme Toggle */}
                    <ThemeToggle className='text-[var(--color-text-primary)] hover:text-[#D36E45] rounded-full transition-colors ml-1' />

                    {/* Menu Toggle */}
                    <button
                        className="p-2 text-[var(--color-text-primary)] hover:text-[#D36E45] rounded-full transition-colors ml-1"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-[var(--color-surface)] text-[var(--color-text-primary)] border-b border-gray-100 shadow-xl lg:hidden p-6 flex flex-col gap-2 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xl font-medium text-[var(--color-text-primary)] py-1 border-b border-gray-300 text-center last:border-0"
                            onClick={(e) => {
                                setMobileMenuOpen(false);
                                handleScroll(e, link.href);
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}

