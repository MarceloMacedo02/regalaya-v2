"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Banner } from "@/lib/mock-data"

interface HeroCarouselProps {
  banners: Banner[]
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  if (banners.length === 0) return null

  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {banners.map((banner, index) => (
            <div key={banner.id} className="embla__slide relative h-[500px] w-full flex-[0_0_100%]">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
                <Badge variant="secondary" className="mb-4">
                  Presentes Especiais
                </Badge>
                <h1 className="mb-4 text-5xl font-bold tracking-tight">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="mb-8 text-xl text-white/90">
                    {banner.subtitle}
                  </p>
                )}
                <div className="flex gap-4">
                  <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-white/90">
                    <Link href={banner.link}>Ver Presentes</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    <Link href="/login">Criar Conta</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Próximo banner"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === selectedIndex ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Ir para banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}