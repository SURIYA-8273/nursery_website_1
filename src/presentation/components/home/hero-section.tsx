'use client';

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export const HeroSection = () => {
    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f4] to-[#e0f2f1]">

            {/* Decorative Vine - Top Left */}
            <div className="absolute top-0 left-0 opacity-80">
                <Image
                    src="/vine-decoration-left.png"
                    alt="Vine Decoration"
                    width={224} // Adjust width as needed
                    height={0} // Responsive scaling
                    priority
                />
            </div>

            {/* Decorative Plant - Bottom Left */}
            <div className="absolute bottom-0 left-0 opacity-90">
                <Image
                    src="/peace-lily-decoration.png"
                    alt="Peace Lily Decoration"
                    width={192} // Adjust width as needed
                    height={0} // Responsive scaling
                    priority
                />
            </div>

            {/* OLD - Decorative Leaves - Bottom Left */}
            <div className="absolute bottom-16 left-12 opacity-70" style={{ display: 'none' }}>
                <div className="relative w-32 h-32">
                    {/* Leaf 1 */}
                    <div className="absolute top-0 left-0 w-12 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full transform -rotate-45"
                        style={{ clipPath: 'ellipse(50% 70% at 50% 30%)' }}></div>
                    {/* Leaf 2 */}
                    <div className="absolute top-4 left-8 w-12 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full transform -rotate-12"
                        style={{ clipPath: 'ellipse(50% 70% at 50% 30%)' }}></div>
                    {/* Leaf 3 */}
                    <div className="absolute top-8 left-16 w-12 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full transform rotate-20"
                        style={{ clipPath: 'ellipse(50% 70% at 50% 30%)' }}></div>
                    {/* Leaf 4 */}
                    <div className="absolute top-16 left-4 w-12 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full transform -rotate-60"
                        style={{ clipPath: 'ellipse(50% 70% at 50% 30%)' }}></div>
                    {/* Leaf 5 */}
                    <div className="absolute top-20 left-12 w-12 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full transform rotate-45"
                        style={{ clipPath: 'ellipse(50% 70% at 50% 30%)' }}></div>
                </div>
            </div>

            {/* Decorative Leaf - Top Right */}
            <div className="absolute top-0 right-0 opacity-80">
                <Image
                    src="/palm-leaf-decoration.png"
                    alt="Palm Leaf Decoration"
                    width={256} // Adjust width as needed
                    height={0} // Responsive scaling
                />
            </div>

            {/* Decorative Leaves - Bottom Right */}
            <div className="absolute bottom-0 right-0 opacity-80">
                <Image
                    src="/leaves-decoration-right.png"
                    alt="Leaves Decoration"
                    width={256} // Adjust width as needed
                    height={0} // Responsive scaling
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full py-12">

                {/* Left Content */}
                <div className="space-y-8">
                    {/* Main Heading */}
                    <div className="space-y-6">
                        <h1 className="font-bold text-5xl md:text-6xl lg:text-[4rem] leading-[1.1] tracking-tight text-gray-900">
                            A Beautiful Plant<br />
                            Is Like Having A Friend<br />
                            Around The House.
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md">
                            Discover everything you need to know about your plants, treat them with kindness and they will take care of you.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div>
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
                <div className="relative h-[550px]">

                    {/* Main Center Plant - Snake Plant in tall white pot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <Image
                            src="/hero-palm-plant-Photoroom.png"
                            alt="Palm Plant"
                            width={320} // Adjust width as needed
                            height={0} // Responsive scaling
                            priority
                            className="h-80 w-auto object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Top Left Plant - Small succulent */}
                    <div className="absolute top-20 left-8 z-10">
                        <Image
                            src="/hero-areca-palm-Photoroom.png"
                            alt="Areca Palm"
                            width={160} // Adjust width as needed
                            height={0} // Responsive scaling
                            priority
                            className="h-40 w-auto object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Middle Right Plant - Medium plant */}
                    <div className="absolute top-32 right-16 z-15">
                        <Image
                            src="/hero-monstera.jpg"
                            alt="Monstera Plant"
                            width={144} // Adjust width as needed
                            height={0} // Responsive scaling
                            priority
                            className="h-36 w-auto object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Bottom Center Plant - Small white pot */}
                    <div className="absolute bottom-20 left-1/4 z-10">
                        <Image
                            src="/hero-areca-palm.jpg"
                            alt="Small Areca Palm"
                            width={128} // Adjust width as needed
                            height={0} // Responsive scaling
                            priority
                            className="h-32 w-auto object-contain drop-shadow-xl"
                        />
                    </div>



                    {/* Bottom Right Plant - Pothos */}
                    <div className="absolute bottom-12 right-4 z-10">
                        <Image
                            src="/hero-monstera.jpg"
                            alt="Monstera"
                            width={144} // Adjust width as needed
                            height={0} // Responsive scaling
                            priority
                            className="h-36 w-auto object-contain drop-shadow-xl"
                        />
                    </div>


                </div>

            </div>
        </section>
    );
};
