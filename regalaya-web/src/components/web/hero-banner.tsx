'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
}

export function HeroBanner({
  title = 'Envie Seu Amor',
  subtitle = 'Presentes únicos para momentos inesquecíveis. Encontre o presente perfeito para quem você ama.',
  badge = 'Novidades',
  ctaText = 'Enviar Presente',
  ctaHref = '/products',
  imageUrl = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#f6f3f2]">
      <div className="grid items-center gap-8 md:grid-cols-2">
        {/* Text Content */}
        <div className="relative z-10 px-8 py-12 md:px-12 md:py-16">
          {/* Badge */}
          {badge && (
            <span className="mb-4 inline-block rounded-full bg-[#be7374] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
              {badge}
            </span>
          )}

          {/* Title */}
          <h2 className="mb-4 font-sacramento text-5xl font-bold text-[#1a1a1a] md:text-6xl lg:text-7xl">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mb-8 text-base text-[#788090] md:text-lg">
            {subtitle}
          </p>

          {/* CTA Button */}
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-full bg-[#be7374] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#be7374]/90 hover:shadow-lg"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Image */}
        <div className="relative h-64 md:h-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover md:rounded-r-2xl"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Overlay gradient on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f6f3f2] via-transparent to-transparent md:hidden" />
        </div>
      </div>
    </div>
  );
}
