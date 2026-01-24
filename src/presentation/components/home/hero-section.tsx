import { Button } from "../ui/button";
import { Heading, Text } from "../ui/typography";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-surface to-secondary/10 pt-20">

            {/* Background Shapes */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-[url('https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 rounded-l-[100px] pointer-events-none mix-blend-multiply" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">

                {/* Left Content */}
                <div className="space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in fill-mode-forwards">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-secondary/20 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-primary tracking-wide uppercase">New Collection Available</span>
                    </div>

                    <div className="space-y-4">
                        <Heading level={1} className="leading-tight">
                            Bring Nature <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Close to Home</span>
                        </Heading>
                        <Text variant="lead" className="max-w-lg">
                            Transform your living space into a green sanctuary. We deliver certified healthy, nursery-grown plants directly to your doorstep.
                        </Text>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/plants">
                            <Button size="lg" className="shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                                Shop Plants Now
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button variant="outline" size="lg" className="bg-white/50 backdrop-blur-sm">
                                Learn More
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-8 pt-4">
                        <div>
                            <p className="font-bold text-3xl text-primary">500+</p>
                            <p className="text-sm text-text-secondary">Plant Species</p>
                        </div>
                        <div className="w-px h-10 bg-secondary/20" />
                        <div>
                            <p className="font-bold text-3xl text-primary">15k+</p>
                            <p className="text-sm text-text-secondary">Happy Customers</p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="relative h-[600px] hidden lg:block animate-in slide-in-from-right-10 duration-1000 fade-in fill-mode-forwards">
                    {/* Main Image Container */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-[40px] shadow-2xl skew-y-3" />

                    {/* Floating Cards */}
                    <div className="absolute bottom-20 -left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-[3000ms]">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <ArrowRight className="rotate-[-45deg]" />
                        </div>
                        <div>
                            <p className="font-bold text-primary">Fast Delivery</p>
                            <p className="text-xs text-text-muted">Within 24 hours</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
