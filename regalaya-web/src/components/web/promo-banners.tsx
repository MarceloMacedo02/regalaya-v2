'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  bgColor: string;
}

const promoBanners: PromoBanner[] = [
  {
    id: 'promo-1',
    title: 'Dia dos Namorados',
    subtitle: 'Presentes românticos com até 30% OFF',
    ctaText: 'Ver Ofertas',
    ctaHref: '/products?occasion=love',
    imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&h=400&fit=crop',
    bgColor: 'bg-[#fed2cc]/40',
  },
  {
    id: 'promo-2',
    title: 'Cestas Especiais',
    subtitle: 'Monte a cesta perfeita para qualquer ocasião',
    ctaText: 'Montar Agora',
    ctaHref: '/products?category=cestas',
    imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=400&fit=crop',
    bgColor: 'bg-[#f0ede9]',
  },
];

export function PromoBanners() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {promoBanners.map((promo) => (
        <Link
          key={promo.id}
          href={promo.ctaHref}
          className={`group relative overflow-hidden rounded-2xl ${promo.bgColor} transition-all hover:shadow-lg`}
        >
          <div className="grid items-center gap-4 p-6 md:grid-cols-2 md:gap-6 md:p-8">
            {/* Text */}
            <div className="relative z-10">
              <h3 className="mb-2 text-2xl font-bold text-[#1a1a1a] md:text-3xl">
                {promo.title}
              </h3>
              <p className="mb-4 text-sm text-[#788090] md:text-base">
                {promo.subtitle}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#be7374] transition-all group-hover:gap-3">
                {promo.ctaText}
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>

            {/* Image */}
            <div className="relative h-40 overflow-hidden rounded-xl md:h-48">
              <Image
                src={promo.imageUrl}
                alt={promo.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
