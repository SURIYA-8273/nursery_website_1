'use client';

import Image from "next/image";
import { Button } from "../../ui/button";
import Link from "next/link";

export const HeroSection1 = () => {
    return (
        <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f4] to-[#e0f2f1]">

            {/* Decorative Vine - Top Left */}
            <div className="absolute top-0 left-0 opacity-60 md:opacity-80 w-32 md:w-56">
                <Image
                    src="/vine-decoration-left.png"
                    alt="Vine Decoration"
                    width={224}
                    height={224}
                    priority
                    className="w-full h-auto"
                />
            </div>

            {/* Decorative Plant - Bottom Left - Hidden on mobile to save space */}
            <div className="hidden md:block absolute bottom-0 left-0 opacity-90">
                <Image
                    src="/peace-lily-decoration.png"
                    alt="Peace Lily Decoration"
                    width={192}
                    height={192}
                    priority
                />
            </div>

            {/* Decorative Leaf - Top Right */}
            <div className="absolute top-0 right-0 opacity-60 md:opacity-80 w-40 md:w-64">
                <Image
                    src="/palm-leaf-decoration.png"
                    alt="Palm Leaf Decoration"
                    width={256}
                    height={256}
                    className="w-full h-auto"
                />
            </div>

            {/* Decorative Leaves - Bottom Right */}
            <div className="absolute bottom-0 right-0 opacity-60 md:opacity-80 w-40 md:w-64">
                <Image
                    src="/leaves-decoration-right.png"
                    alt="Leaves Decoration"
                    width={256}
                    height={256}
                    className="w-full h-auto"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 w-full py-20 md:py-12">

                {/* Left Content */}
                <div className="space-y-6 md:space-y-8 text-center lg:text-left pt-10 md:pt-0">
                    {/* Main Heading */}
                    <div className="space-y-4 md:space-y-6">
                        <h1 className="font-bold text-3xl sm:text-4xl md:text-6xl lg:text-[4rem] leading-[1.2] md:leading-[1.1] tracking-tight text-gray-900">
                            A Beautiful Plant<br className="hidden md:block" />
                            Is Like Having A Friend<br className="hidden md:block" />
                            Around The House.
                        </h1>
                        <p className="text-sm md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
                            Discover everything you need to know about your plants, treat them with kindness and they will take care of you.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center lg:justify-start">
                        <Link href="/plants">
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-md px-8 py-3 font-medium hover:border-gray-400 transition-all shadow-sm"
                            >
                                Explore More
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Visual - Plant Showcase */}
                <div className="relative h-[300px] sm:h-[400px] md:h-[550px] w-full max-w-lg mx-auto lg:mx-0">

                    {/* Main Center Plant */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <Image
                            src="/hero-palm-plant-Photoroom.png"
                            alt="Palm Plant"
                            width={320}
                            height={400}
                            priority
                            className="h-48 sm:h-64 md:h-80 w-auto object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Top Left Plant */}
                    <div className="absolute top-10 left-4 sm:left-8 z-10">
                        <Image
                            src="/hero-areca-palm-Photoroom.png"
                            alt="Areca Palm"
                            width={160}
                            height={200}
                            priority
                            className="h-24 sm:h-32 md:h-40 w-auto object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Middle Right Plant */}
                    <div className="absolute top-16 right-10 sm:right-16 z-15">
                        <Image
                            src="/hero-monstera.jpg"
                            alt="Monstera Plant"
                            width={144}
                            height={180}
                            priority
                            className="h-20 sm:h-28 md:h-36 w-auto object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Bottom Left Plant */}
                    <div className="absolute bottom-10 left-10 sm:left-20 z-10">
                        <Image
                            src="/hero-areca-palm.jpg"
                            alt="Small Areca Palm"
                            width={128}
                            height={160}
                            priority
                            className="h-20 sm:h-24 md:h-32 w-auto object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Bottom Right Plant */}
                    <div className="absolute bottom-8 right-4 sm:right-8 z-10">
                        <Image
                            src="/hero-monstera.jpg"
                            alt="Monstera"
                            width={144}
                            height={180}
                            priority
                            className="h-20 sm:h-28 md:h-36 w-auto object-contain drop-shadow-xl"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};
