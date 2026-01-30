'use client';

import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ContactSection = () => {
    return (
        <section className="py-20 md:py-32 bg-[var(--color-surface)]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Info */}
                    <div className="space-y-8 md:space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold tracking-widest uppercase text-xs">
                                <Mail size={16} fill="currentColor" />
                                <span>Get in Touch</span>
                            </div>
                            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[var(--color-text-primary)] leading-tight">
                                We'd Love to Hear From You
                            </h2>
                            <p className="text-[var(--color-text-secondary)] text-lg max-w-lg leading-relaxed">
                                Have questions about plant care or need help choosing the perfect plant? Our team of plant experts is here to help!
                            </p>
                        </div>

                        <div className="space-y-6">
                            <ContactInfoItem
                                icon={<MapPin size={20} />}
                                title="Visit Our Shop"
                                detail="123 Botanical Avenue, San Francisco, CA 94102"
                            />
                            <ContactInfoItem
                                icon={<Phone size={20} />}
                                title="Call Us"
                                detail="(415) 555-0123"
                            />
                            <ContactInfoItem
                                icon={<Mail size={20} />}
                                title="Email Us"
                                detail="hello@verdantplants.com"
                            />
                            <ContactInfoItem
                                icon={<Clock size={20} />}
                                title="Store Hours"
                                detail={
                                    <div className="flex flex-col">
                                        <span>Mon - Sat: 9am - 7pm</span>
                                        <span>Sunday: 10am - 5pm</span>
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    {/* Right Column: Form Card */}
                    <div className="bg-[var(--color-surface-hover)] p-8 md:p-12 rounded-[40px] shadow-xl shadow-black/20 border border-white/5">
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-8">Send Us a Message</h3>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-[var(--color-surface)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full bg-[var(--color-surface)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-text-primary)] ml-1">Your Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us how we can help..."
                                    className="w-full bg-[var(--color-surface)] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] resize-none"
                                />
                            </div>

                            <button className="w-full bg-[#D36E45] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#B85A35] transition-all shadow-lg shadow-[#D36E45]/20 active:scale-[0.98]">
                                Send Message
                                <Send size={18} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

const ContactInfoItem = ({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: React.ReactNode }) => (
    <div className="flex items-start gap-4 group">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-text-muted)] shrink-0 group-hover:bg-[#D36E45] group-hover:text-white transition-colors">
            {icon}
        </div>
        <div className="space-y-1 pt-1">
            <h4 className="font-bold text-[var(--color-text-primary)] leading-none">{title}</h4>
            <div className="text-[var(--color-text-secondary)] text-sm md:text-base">{detail}</div>
        </div>
    </div>
);
