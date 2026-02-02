import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { HeroSection1 } from '@/presentation/components/home/hero/hero-section_1';
import { FeaturesSection } from '@/presentation/components/home/features-section';
import { CategoryHighlights } from '@/presentation/components/home/category-highlights';
import { BrowseByCategory } from '@/presentation/components/home/browse-by-category';
import { NewsletterSection } from '@/presentation/components/home/newsletter-section';
import { ContactSection } from '@/presentation/components/home/contact-section';
import { FeaturedPlants } from '@/presentation/components/home/featured-plants';
import { TestimonialsSection } from '@/presentation/components/home/testimonials-section';
import { GallerySection } from '@/presentation/components/home/gallery-section';
import HeroSection2 from '@/presentation/components/home/hero/hero_section_2';

// Force dynamic since we might want fresh random data or if we add randomization
export const revalidate = 60;

// ... imports
// (Make sure SupabasePlantRepository is imported, it is at line 1)

async function getFeaturedPlants() {
  const repo = new SupabasePlantRepository();
  return await repo.getFeaturedPlants();
}

async function getCategories() {
  const repo = new SupabasePlantRepository();
  const categories = await repo.getCategories();
  // Return only top 4
  return categories.slice(0, 4);
}

export default async function Home() {
  const plants = await getFeaturedPlants();
  const categories = await getCategories();

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <div id="home" className="scroll-mt-28">
        <HeroSection2 />
      </div>

      <div className='mt-2'></div>
      {/* 2. Features / Why Choose Us */}
      <FeaturesSection />
      <div className='mt-10'></div>
      {/* 3. Browse By Category */}
      <div id="categories" className="scroll-mt-28">
        <BrowseByCategory viewAllLink="/plants" categories={categories} />
      </div>
      <div className='mt-10'></div>
      {/* 4. Best Selling Plants (Featured) */}
      <FeaturedPlants
        title="Best Selling Plants"
        subtitle="Loved by thousands of happy plant parents"
        plants={plants}
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


    </main>
  );
}
