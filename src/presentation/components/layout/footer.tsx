'use client';

import Link from 'next/link';
import { Leaf, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const Footer = () => {
    return (
        <footer className="bg-primary/5 pt-16 pb-8 border-t border-primary/10">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-white p-2 rounded-lg">
                                <Leaf size={24} fill="currentColor" />
                            </div>
                            <span className="font-serif text-xl font-bold text-primary">
                                Inner Loop Technologies
                            </span>
                        </div>
                        <p className="text-text-secondary leading-relaxed">
                            Bringing nature closer to your home with our premium collection of healthy, nursery-grown plants.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition-colors shadow-sm">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-primary mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Home', 'Shop Plants', 'About Us', 'Plant Care Guide', 'Contact'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-text-secondary hover:text-primary transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-bold text-primary mb-6">Categories</h4>
                        <ul className="space-y-4">
                            {['Indoor Plants', 'Outdoor Garden', 'Succulents', 'Flowering', 'Pots & Planters'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-text-secondary hover:text-primary transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
                    <div className="flex flex-col gap-2 text-center">
                        <p>© {new Date().getFullYear()} Inner Loop Technologies. All rights reserved.</p>
                        <p className="text-xs text-text-muted/80 text-center">
                            Developer by Inner Loop Technologies • <a href="mailto:innerloopdev@gmail.com" className="hover:text-primary transition-colors">innerloopdev@gmail.com</a> • <a href="tel:+916369363788" className="hover:text-primary transition-colors">+91 6369363788</a>
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
