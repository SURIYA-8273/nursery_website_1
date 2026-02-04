'use client';

import Image from "next/image";
import { Button } from "../../ui/button";
import Link from "next/link";

import { useState, useEffect } from 'react';
import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { BusinessSettings } from '@/domain/entities/settings.entity';

const HeroSection2 = () => {
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
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2  md:gap-16 items-center relative z-10 w-full">
        {/* Left Content */}
        <div className="space-y-6  md:space-y-8 text-center lg:text-left pt-10 md:pt-0">
          {/* Main Heading */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl text-center lg:text-[4rem]   text-[var(--color-text-primary)] whitespace-pre-line">
              {settings.heroTitle || "A Beautiful Plant Is Like Having A Friend Around The House."}
            </h1>
            <p className="text-md md:text-lg text-[var(--color-text-primary)] text-center leading-relaxed max-w-md mx-auto lg:mx-0 whitespace-pre-line">
              {settings.heroDescription || "Discover everything you need to know about your plants, treat them with kindness and they will take care of you."}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex gap-4 justify-center md:justify-start">
            <div className="flex justify-center lg:justify-start">
              <Link href="/plants">
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-md"
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
                  className="rounded-md"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        {/* Right Content - Plant Cluster */}
        <div className="flex justify-center items-end relative w-full h-[450px] md:h-[600px] mt-4 lg:mt-0">

          {/* Animated Center Element */}
          <div className="absolute top-[80%] left-[92%] sm:left-[80%] md:left-[80%] -translate-x-1/2 -translate-y-1/2 -z-10">
            <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[350px] lg:h-[350px] bg-green-600/30 rounded-[30px] animate-ripple-custom" />
          </div>

          {/* Back Left - Large Areca */}
          <div className="absolute top-5 left-3 w-[60%] h-[80%] z-0 transform -translate-x-4 animate-slide-in-left">
            <Image
              src="/hero-areca-palm-Photoroom.png"
              alt="Areca Palm"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Back Right - Tall Palm */}
          <div className="absolute top-10 right-8 w-[55%] h-[75%] z-10 transform translate-x-4 animate-slide-in-right">
            <Image
              src="/hero-palm-plant-Photoroom.png"
              alt="Palm Plant"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Front Center - Peace Lily */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[40%] h-[50%] z-20 animate-slide-in-bottom">
            <Image
              src="/peace-lily-decoration.png"
              alt="Peace Lily"
              fill
              className="object-contain drop-shadow-2xl scale-110"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;