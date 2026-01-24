import { SupabasePlantRepository } from '@/data/repositories/supabase-plant.repository';
import { PlantCard } from '@/presentation/components/ui/plant-card';
import { HeroSection } from '@/presentation/components/home/hero-section';
import { FeaturesSection } from '@/presentation/components/home/features-section';
import { CategoryHighlights } from '@/presentation/components/home/category-highlights';

import { NewsletterSection } from '@/presentation/components/home/newsletter-section';
import { Heading } from '@/presentation/components/ui/typography';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
      <HeroSection />

      {/* 2. Features / Why Choose Us */}
      <FeaturesSection />

      {/* 3. Category Highlights */}
      <CategoryHighlights />

      {/* 4. Best Selling Plants (Featured) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Heading level={2} className="mb-4">Best Selling Plants</Heading>
            <p className="text-text-secondary">Loved by thousands of happy plant parents</p>
          </div>

          {plants.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {plants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <div className="text-center text-text-muted py-12 bg-surface/50 rounded-2xl">
              <p>No plants available at the moment.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/plants" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary-hover transition-all shadow-lg hover:shadow-primary/30 active:scale-95">
              View All Plants <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Plant Care Tips */}


      {/* 6. Newsletter */}
      <NewsletterSection />
    </main>
  );
}
