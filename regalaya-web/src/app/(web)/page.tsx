import { products } from '@/lib/mock-data';
import { HeroBanner } from '@/components/web/hero-banner';
import { PromoBanners } from '@/components/web/promo-banners';
import { FeaturedProductsGrid } from '@/components/web/featured-products-grid';
import { Sidebar } from '@/components/web/sidebar';
import { Button } from '@/components/ui/button';
import { OccasionSection } from '@/components/web/occasion-section';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Presentes Inesquecíveis | Regalaya',
  description: 'Encontre o presente perfeito para cada momento especial. Chocolates, flores, vinhos, experiências e muito mais.',
  openGraph: {
    title: 'Presentes Inesquecíveis | Regalaya',
    description: 'Encontre o presente perfeito para cada momento especial.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Regalaya',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presentes Inesquecíveis | Regalaya',
    description: 'Encontre o presente perfeito para cada momento especial.',
  },
  alternates: {
    canonical: SITE_URL,
  },
};

/**
 * HOMEPAGE - Layout com Sidebar + Conteúdo Principal
 *
 * Estrutura:
 * - Hero Banner
 * - Promo Banners
 * - Featured Products Grid
 * - Occasion Section
 * - CTA Section
 */

export default function HomePage() {
  const featuredProducts = products.slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Area with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden w-[280px] flex-shrink-0 lg:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1 space-y-8">
            {/* Hero Banner */}
            <HeroBanner />

            {/* Promo Banners */}
            <PromoBanners />

            {/* Featured Products Grid */}
            <FeaturedProductsGrid products={featuredProducts} />
          </div>
        </div>
      </div>

      {/* Occasions Section - Full Width */}
      <section className="bg-[#f6f3f2] py-16">
        <div className="container mx-auto px-4">
          <OccasionSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a1a]">Precisa de ajuda para escolher?</h2>
          <p className="mb-8 text-lg text-[#788090]">
            Nossa IA pode ajudar você a encontrar o presente perfeito
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-[#be7374] text-white hover:bg-[#be7374]/90">
              <Link href="/recommendations">Ver Recomendações</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#be7374] text-[#be7374] hover:bg-[#fed2cc]/60">
              <Link href="/chat">Falar com Chat IA</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
