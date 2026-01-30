import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { HeroSection1 } from '@/presentation/components/home/hero/hero-section_1';
import { FeaturesSection } from '@/presentation/components/home/features-section';
import { CategoryHighlights } from '@/presentation/components/home/category-highlights';
import { BrowseByCategory } from '@/presentation/components/home/browse-by-category';
import { NewsletterSection } from '@/presentation/components/home/newsletter-section';
import { ContactSection } from '@/presentation/components/home/contact-section';
import { FeaturedPlants } from '@/presentation/components/home/featured-plants';
import { TestimonialsSection } from '@/presentation/components/home/testimonials-section';
import HeroSection2 from '@/presentation/components/home/hero/hero_section_2';

// Force dynamic since we might want fresh random data or if we add randomization
export const revalidate = 60;

async function getFeaturedPlants() {
  const repo = new SupabasePlantRepository();
  return await repo.getFeaturedPlants();
}

export default async function Home() {
  const plants = await getFeaturedPlants();

  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection1 />

      {/* 2. Features / Why Choose Us */}
      <FeaturesSection />

      {/* 3. Browse By Category */}
      <BrowseByCategory viewAllLink="/plants" />

      {/* 4. Best Selling Plants (Featured) */}
      <FeaturedPlants
        title="Best Selling Plants"
        subtitle="Loved by thousands of happy plant parents"
        plants={plants}
        viewAllLink="/plants"
      />

      {/* 5. Testimonials */}
      <TestimonialsSection />

      {/* 6. Contact Section */}
      <ContactSection />

     
    </main>
  );
}
