'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShoppingBag, Heart, Menu, X, Leaf } from 'lucide-react';
import { useCartStore } from '@/presentation/store/cart.store';
import { useWishlistStore } from '@/presentation/store/wishlist.store';
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { cart } = useCartStore();
    const { wishlist, refreshWishlist } = useWishlistStore();

    // Init stores
    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/plants' },
        { name: 'Plant Care', href: '/care' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const isHome = pathname === '/';

    return (
        <header
            className={cn(
                "sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 py-3",
                scrolled ? "shadow-md" : ""
            )}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-[#2F4F4F] text-white p-2.5 rounded-full transition-colors">
                        <Leaf size={20} fill="none" strokeWidth={2} />
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-tight text-[#1A2F2F]">
                        Inner Loop Technologies
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-base font-medium transition-colors text-gray-600 hover:text-[#2F4F4F]"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Favorites/Wishlist */}
                    <Link href="/wishlist" className="relative group p-2">
                        <Heart size={24} className="text-[#1A2F2F] group-hover:text-[#D36E45] transition-colors" />
                        {wishlist.totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-[#D36E45] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {wishlist.totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative group p-2">
                        <ShoppingBag size={24} className="text-[#1A2F2F] group-hover:text-[#2F5E48] transition-colors" />
                        {cart.totalItems >= 0 && (
                            <span className="absolute top-0 right-0 bg-[#2F5E48] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {cart.totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Menu Toggle */}
                    <button
                        className="p-2 text-[#1A2F2F] hover:bg-black/5 rounded-full transition-colors ml-1"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl lg:hidden p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xl font-medium text-[#1A2F2F] py-3 border-b border-gray-100 last:border-0"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}

