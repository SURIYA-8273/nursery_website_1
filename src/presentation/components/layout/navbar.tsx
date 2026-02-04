'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShoppingBag, Heart, Menu, X, Leaf, Instagram, Facebook, Youtube, Home, LayoutGrid, Sprout, Image as ImageIcon, Phone, ClipboardList } from 'lucide-react';
import { useCartStore } from '@/presentation/store/cart.store';
import { useWishlistStore } from '@/presentation/store/wishlist.store';
import { ThemeToggle } from '@/presentation/components/ui/theme-toggle';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { ICONS } from '@/core/config/icons';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { cart } = useCartStore();
    const { wishlist, refreshWishlist } = useWishlistStore();

    const [businessName, setBusinessName] = useState('Inner Loop Technologies');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [socialLinks, setSocialLinks] = useState<{
        instagram?: string;
        facebook?: string;
        youtube?: string;
        whatsapp?: string;
    }>({});

    // Init stores & fetch settings
    useEffect(() => {
        refreshWishlist();

        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            if (data) {
                if (data.businessName) setBusinessName(data.businessName);
                if (data.logoUrl) setLogoUrl(data.logoUrl);
                setSocialLinks({
                    instagram: data.instagramUrl,
                    facebook: data.facebookUrl,
                    youtube: data.youtubeUrl,
                    whatsapp: data.whatsappNumber,
                });
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

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const isHome = pathname === '/';

    const navLinks = [
        { name: 'Home', href: isHome ? '#home' : '/#home', icon: <Home size={20} /> },
        { name: 'Category', href: isHome ? '#categories' : '/#categories', icon: <LayoutGrid size={20} /> },
        { name: 'Plants', href: '/plants', icon: <Sprout size={20} /> },
        { name: 'Catalog', href: '/product-catalog', icon: <ClipboardList size={20} /> },
        { name: 'Gallery', href: isHome ? '#gallery' : '/#gallery', icon: <ImageIcon size={20} /> },
        { name: 'Contact', href: isHome ? '#contact' : '/#contact', icon: <Phone size={20} /> },
    ];

    const mobileLinks = [
        ...navLinks,
        { name: 'Wishlist', href: "/wishlist", icon: <Heart size={20} /> }
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
        <>
            <header
                className={cn(
                    "sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--color-surface)] shadow-sm shadow-primary py-2 md:py-3",
                    scrolled ? "shadow-md" : ""
                )}
            >
                <div className="max-w-7xl mx-auto px-3 py-1 md:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-[#2F4F4F] rounded-full transition-colors overflow-hidden flex items-center justify-center w-11 h-11 md:w-10 md:h-10">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Leaf size={20} fill="none" strokeWidth={2} />
                            )}
                        </div>
                        <span className="font-serif text-md md:text-xl font-extrabold  text-[var(--color-text-primary)] sm:block">
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
                                className="text-[var(--color-text-primary)] font-medium hover:text-[#D36E45] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center sm:gap-4">
                        {/* Favorites/Wishlist */}
                        <Link href="/wishlist" className="relative group p-2 hidden md:block">
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
                            className="p-2 text-[var(--color-text-primary)] hover:text-[#D36E45] rounded-full transition-colors ml-1 lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer - Fixed Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] transition-all duration-300 lg:hidden",
                    mobileMenuOpen ? "visible" : "invisible pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                        mobileMenuOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Drawer */}
                <div
                    className={cn(
                        "absolute top-0 right-0 w-[80%] max-w-[300px] h-full bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 flex flex-col",
                        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {/* Drawer Header */}
                    <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#2F4F4F] rounded-full flex items-center justify-center w-8 h-8">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <Leaf size={16} fill="none" className='text-white' strokeWidth={2} />
                                )}
                            </div>
                            <span className="font-serif text-lg font-bold text-[var(--color-text-primary)] truncate max-w-[150px]">
                                {businessName}
                            </span>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 text-[var(--color-text-primary)] hover:text-red-500 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Drawer Links */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2">
                        <div className="flex flex-col gap-1">
                            {mobileLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-3 text-lg font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] hover:text-[#D36E45] rounded-lg transition-all flex items-center gap-3"
                                    onClick={(e) => {
                                        setMobileMenuOpen(false);
                                        handleScroll(e, link.href);
                                    }}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Drawer Footer */}
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                        {/* Social Icons */}
                        {/* Social Icons */}
                        <div className="flex items-center justify-center gap-4 pt-2">
                            {socialLinks?.instagram && (
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="bg-[#D36E45]/10 p-2.5 rounded-full text-[#D36E45] hover:bg-[#D36E45] hover:text-white transition-all duration-300">
                                    <ICONS.instagram size={18} />
                                </a>
                            )}
                            {socialLinks?.facebook && (
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-[#1877F2]/10 p-2.5 rounded-full text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                                    <ICONS.facebook size={18} />
                                </a>
                            )}
                            {socialLinks?.youtube && (
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="bg-[#FF0000]/10 p-2.5 rounded-full text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                                    <ICONS.youtube size={18} />
                                </a>
                            )}
                            {socialLinks?.whatsapp && (
                                <a href={`https://wa.me/${socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/10 p-2.5 rounded-full text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300">
                                    <ICONS.whatsapp size={18} />
                                </a>
                            )}
                        </div>


                        <p className="text-sm text-[var(--color-text-secondary)] text-center">
                            © {new Date().getFullYear()} {businessName}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}


