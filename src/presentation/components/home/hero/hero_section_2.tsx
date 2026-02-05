'use client';

import Image from "next/image";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useSettings } from "@/presentation/context/settings-context"; // Import settings hook

export const HeroSection2 = () => {
  const { settings } = useSettings();
  const title = settings?.heroTitle;
  const description = settings?.heroDescription;
  console.log(settings?.heroImage)
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2  md:gap-14 items-center relative z-10 w-full">
        {/* Left Content */}
        <div className="space-y-6  md:space-y-8 text-center lg:text-left pt-10 md:pt-0">
          {/* Main Heading */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl text-center lg:text-[4rem]   text-[var(--color-text-primary)] whitespace-pre-line">
              {title || "A Beautiful Plant Is Like Having A Friend Around The House."}
            </h1>
            <p className="text-md md:text-lg text-[var(--color-text-primary)] text-center leading-relaxed max-w-md mx-auto lg:mx-0 whitespace-pre-line">
              {description || "Discover everything you need to know about your plants, treat them with kindness and they will take care of you."}
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
        {/* Right Column - Image */}
        <div className="flex-1 relative flex items-center justify-center min-h-[400px] md:min-h-[600px] w-full max-w-xl mx-auto md:max-w-none order-1 md:order-2">

          <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
            {/* Animated Background Shape - Dynamically Configured */}
            {settings?.heroShowBackgroundShape !== false && (
              <div className="-z-10 absolute inset-0 flex items-center justify-center">
                <div
                  className="w-[340px] h-[320px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[350px] lg:h-[350px] rounded-[30px] transition-colors duration-300"
                  style={{ backgroundColor: settings?.heroBackgroundColor || 'rgba(22, 163, 74, 0.3)' }} // default green-600/30
                />
              </div>
            )}

            <Image
              src={settings?.heroImage || "/hero2.png"}
              alt="Hero Plant"
              fill
              className="object-contain drop-shadow-xl z-10"
              priority
              unoptimized
              
            />
          </div>

          {/* Floating Tag */}
          <div className="absolute top-1/2 -right-4 md:right-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-primary/20 animate-float-delayed hidden md:block z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="text-xl">🌿</span>
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Species</p>
                <p className="text-sm font-semibold text-primary">Indoor Plants</p>
              </div>
            </div>
          </div>
        </div>    {/* Back Right - Tall Palm */}
        {/* <div className="absolute top-10 right-8 w-[55%] h-[75%] z-10 transform translate-x-4 animate-slide-in-right">
            <Image
              src="/hero-palm-plant-Photoroom.png"
              alt="Palm Plant"
              fill
              priority
            />
          </div> */}

        {/* Front Center - Peace Lily */}
        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[40%] h-[50%] z-20 animate-slide-in-bottom">
            <Image
              src="/peace-lily-decoration.png"
              alt="Peace Lily"
              fill
              className="object-contain drop-shadow-2xl scale-110"
              priority
            />
          </div> */}
      </div>
    </section>
  );
};

export default HeroSection2;