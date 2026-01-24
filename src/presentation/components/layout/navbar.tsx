'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShoppingCart, User, Search, Menu, X, Leaf } from 'lucide-react';
import { useCartStore } from '@/presentation/store/cart.store';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { cart } = useCartStore();

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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled || !isHome
                    ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-primary-hover transition-colors">
                        <Leaf size={24} fill="currentColor" />
                    </div>
                    <span className={cn(
                        "font-serif text-xl font-bold tracking-tight transition-colors",
                        scrolled || !isHome ? "text-primary" : "text-primary md:text-white"
                    )}>
                        GreenRoots
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-accent",
                                scrolled || !isHome ? "text-text-primary" : "text-white/90 hover:text-white"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <button className={cn(
                        "p-2 rounded-full transition-colors hover:bg-black/5",
                        scrolled || !isHome ? "text-text-secondary" : "text-white/90"
                    )}>
                        <Search size={20} />
                    </button>

                    <Link href="/cart" className="relative group">
                        <button className={cn(
                            "p-2 rounded-full transition-colors hover:bg-black/5",
                            scrolled || !isHome ? "text-text-secondary" : "text-white/90"
                        )}>
                            <ShoppingCart size={20} />
                        </button>
                        {cart.totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {cart.totalItems}
                            </span>
                        )}
                    </Link>

                    <Link href="/admin/login">
                        <button className={cn(
                            "p-2 rounded-full transition-colors hover:bg-black/5 hidden md:block",
                            scrolled || !isHome ? "text-text-secondary" : "text-white/90"
                        )}>
                            <User size={20} />
                        </button>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={cn("md:hidden p-2", scrolled || !isHome ? "text-text-primary" : "text-white")}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-secondary/10 shadow-lg md:hidden p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-text-primary py-2 border-b border-secondary/5"
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
