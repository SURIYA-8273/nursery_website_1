'use client';

import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

import { useState, useEffect } from 'react';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { BusinessSettings } from '@/domain/entities/settings.entity';
import { Heading } from './heading';

export const ContactSection = () => {
    const [settings, setSettings] = useState<Partial<BusinessSettings>>({});

    useEffect(() => {
        const fetchSettings = async () => {
            const repo = new SupabaseSettingsRepository();
            const data = await repo.getSettings();
            if (data) {
                setSettings(data);
            }
        };
        fetchSettings();
    }, []);

    return (
        <section className="bg-[var(--color-surface)] ">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className=" items-center">

                    {/* Left Column: Info */}
                    <div className="space-y-4 md:space-y-12">

                         {/* Header */}
                                        <Heading title="We'd Love to Hear From You" subtitle="Have questions about plant care or need help choosing the perfect plant? Our team of plant experts is here to help!" />
                                        

                                        <div className="flex justify-center items-center text-[#D36E45] font-bold uppercase text-xs mb-4">
                                            <MapPin size={14} fill="currentColor" strokeWidth={0} />
                                            Get in Touch
                                        </div>
                        

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <ContactInfoItem
                                icon={<MapPin size={20} />}
                                title="Visit Our Shop"
                                detail={settings.address || "123 Botanical Avenue, San Francisco, CA 94102"}
                            />
                            <ContactInfoItem
                                icon={<Phone size={20} />}
                                title="Call Us"
                                detail={settings.mobileNumber || "(415) 555-0123"}
                            />
                            <ContactInfoItem
                                icon={<Mail size={20} />}
                                title="Email Us"
                                detail={settings.email || "hello@verdantplants.com"}
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

                 

                </div>
            </div>
        </section>
    );
};

const ContactInfoItem = ({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: React.ReactNode }) => (
    <div className="flex items-start gap-4 group">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16  rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-4 md:mb-6 bg-[var(--color-primary)] group-hover:text-[var(--color-primary-light)] text-white  transition-colors">
            {icon}                            </div>

        <div className="space-y-1 pt-1">
            <h4 className="font-bold text-[var(--color-text-primary)] leading-none">{title}</h4>
            <div className="text-[var(--color-text-secondary)] text-sm md:text-base">{detail}</div>
        </div>
    </div>
);
