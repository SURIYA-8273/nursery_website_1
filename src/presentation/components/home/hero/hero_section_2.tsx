import Image from "next/image";
import { Button } from "../../ui/button";

const HeroSection2 = () => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/r.jpeg"
          alt="Beautiful indoor plants in a modern living room"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <span
            className="inline-block text-sage bg-sage/10 px-3 py-1 rounded-full font-medium tracking-widest uppercase text-sm mb-4 opacity-0 animate-fade-in backdrop-blur-sm"
            style={{ animationDelay: "0.2s" }}
          >
            Premium Indoor Plants
          </span>
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-cream leading-tight mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Bring Nature
            <br />
            <span className="text-sage-300">Into Your Home</span>
          </h1>
          <p
            className="text-cream/90 text-lg md:text-xl max-w-lg mb-8 leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            Discover our curated collection of beautiful houseplants, expertly grown and delivered to your doorstep.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <Button variant="default" size="lg" className="bg-sage hover:bg-sage-600 text-white border-none text-lg px-8 h-14">
              Shop Plants
            </Button>
            <Button variant="outline" size="lg" className="border-cream/80 text-lg px-8 h-14 bg-transparent text-cream hover:bg-cream hover:text-green-900">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-cream/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-cream/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;