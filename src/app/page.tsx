// import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
// import { SupabaseSettingsRepository } from '@/data/repositories/supabase-settings.repository';
import { AboutUsSection } from '@/presentation/components/home/aboutus-section';
import { BrowseByCategory } from '@/presentation/components/home/browse-by-category';
import { ContactSection } from '@/presentation/components/home/contact-section';
import { FeaturedPlants } from '@/presentation/components/home/featured-plants';
import { TestimonialsSection } from '@/presentation/components/home/testimonials-section';
import { GallerySection } from '@/presentation/components/home/gallery-section';
import HeroSection2 from '@/presentation/components/home/hero/hero_section_2';
import { MapSection } from '@/presentation/components/home/map-section';

// Force dynamic since we might want fresh random data or if we add randomization
export const revalidate = 60;

// ... imports
// Note: Removed SupabaseSettingsRepository import if unused

// ... imports

export default async function Home() {

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <div id="home" className="scroll-mt-28">
        <HeroSection2 />
      </div>

      <div className='mt-2'></div>
      {/* 2. Features / Why Choose Us */}
      <AboutUsSection />
      <div className='mt-10'></div>
      {/* 3. Browse By Category */}
      <div id="categories" className="scroll-mt-28">
        <BrowseByCategory viewAllLink="/plants" />
      </div>
      <div className='mt-10'></div>
      {/* 4. Best Selling Plants (Featured) */}
      <FeaturedPlants
        title="Best Selling Plants"
        subtitle="Loved by thousands of happy plant parents"
        viewAllLink="/plants"
      />
      <div className='mt-10'></div>
      {/* 5. Testimonials */}
      <TestimonialsSection />
      <div className='mt-10'></div>
      {/* 6. Gallery Section */}
      <div id="gallery" className="scroll-mt-28">
        <GallerySection />
      </div>
      <div className='mt-10'></div>
      {/* 7. Contact Section */}
      <div id="contact" className="scroll-mt-28">
        <ContactSection />
      </div>
      <div className='mt-10'></div>
      {/* 8. Map Section */}
      <MapSection />
    </main>
  );
}
