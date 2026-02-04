'use client';

import Image from "next/image";
import { Button } from "../../ui/button";
import Link from "next/link";

import { useState, useEffect } from 'react';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { BusinessSettings } from '@/domain/entities/settings.entity';

export const HeroSection1 = () => {
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

        <section className="relative min-h-[91vh] md:min-h-[91vh] flex items-center overflow-hidden  bg-[var(--color-surface)]">

            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 w-full py-20 md:py-12">

                {/* Left Content */}
                <div className="space-y-6 md:space-y-8 text-center lg:text-left pt-10 md:pt-0">
                    <div className="space-y-4 md:space-y-6">
                        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.2] md:leading-[1.1] tracking-tight text-[var(--color-text-primary)] whitespace-pre-line">
                            {settings.heroTitle || "A Beautiful Plant\nIs Like Having A Friend\nAround The House."}
                        </h1>
                        <p className="text-md md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-md mx-auto lg:mx-0 whitespace-pre-line">
                            {settings.heroDescription || "Discover everything you need to know about your plants, treat them with kindness and they will take care of you."}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex gap-4">
                        <div className="flex justify-center lg:justify-start">
                            <Link href="/plants">
                                <Button
                                    variant="default"
                                    size="lg"
                                >
                                    Explore More
                                </Button>
                            </Link>
                        </div>
                        <div className="flex justify-center lg:justify-start">
                            <Link href="#contact">
                                <Button
                                    variant="default"
                                    size="lg"
                                >
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
};
