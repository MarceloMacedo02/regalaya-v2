"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  ZoomIn,
  Grid3X3,
  RotateCw,
  Keyboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

// Perspective labels for product images
const PERSPECTIVE_LABELS = [
  "Vista Principal",
  "Lateral",
  "Detalhe",
  "Costas",
  "Aproximação",
  "Em Uso",
]

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const defaultImage = "/images/products/chocolates.jpg"
  const displayImages = images.length > 0 ? images : [defaultImage]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false)
        } else if (isZoomed) {
          setIsZoomed(false)
        }
      } else if (e.key === " " || e.key === "Enter") {
        if (!isLightboxOpen) {
          e.preventDefault()
          setIsLightboxOpen(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, isZoomed, displayImages.length])

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
    setTimeout(() => setIsTransitioning(false), 200)
  }, [displayImages.length, isTransitioning])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsTransitioning(false), 200)
  }, [displayImages.length, isTransitioning])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  const openLightbox = () => setIsLightboxOpen(true)
  const closeLightbox = () => setIsLightboxOpen(false)

  const getPerspectiveLabel = (index: number) => {
    return PERSPECTIVE_LABELS[index] || `Imagem ${index + 1}`
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Keyboard shortcuts hint - Desktop only */}
        <div className="hidden lg:flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => setShowShortcuts(!showShortcuts)}
          >
            <Keyboard className="h-3 w-3 mr-1" />
            Atalhos
          </Button>
        </div>

        {showShortcuts && (
          <div className="hidden lg:block rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3 text-xs">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">←</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">→</kbd>
                Navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">Enter</kbd>
                Ampliar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono">Esc</kbd>
                Fechar
              </span>
            </div>
          </div>
        )}

        {/* Main Image Container */}
        <div
          className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 group cursor-zoom-in shadow-lg"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={openLightbox}
          tabIndex={0}
          role="region"
          aria-label="Galeria de imagens do produto"
        >
          {/* Image */}
          <Image
            src={displayImages[selectedIndex]}
            alt={`${productName} - ${getPerspectiveLabel(selectedIndex)}`}
            fill
            className={cn(
              "object-cover transition-all duration-300 ease-out",
              isZoomed && "scale-150 cursor-zoom-out",
              isTransitioning && "opacity-80"
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
            priority
          />

          {/* Perspective Badge */}
          <Badge
            variant="secondary"
            className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-md"
          >
            {getPerspectiveLabel(selectedIndex)}
          </Badge>

          {/* Navigation Arrows - Enhanced */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-xl hover:bg-white hover:scale-110 transition-all z-10"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-7 w-7 text-zinc-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-xl hover:bg-white hover:scale-110 transition-all z-10"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-7 w-7 text-zinc-700" />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 backdrop-blur-sm">
            <ZoomIn className="h-4 w-4" />
            <span>Clique para ampliar</span>
          </div>

          {/* Image Counter - Enhanced */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm text-white z-10 backdrop-blur-sm">
              <Grid3X3 className="h-4 w-4" />
              <span className="font-medium">
                {selectedIndex + 1} / {displayImages.length}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails - Enhanced with labels */}
        {displayImages.length > 1 && (
          <div className="space-y-2">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 transition-all duration-200",
                    selectedIndex === index
                      ? "ring-2 ring-amber-500 ring-offset-2 rounded-xl scale-105"
                      : "hover:ring-2 hover:ring-zinc-300 rounded-lg opacity-80 hover:opacity-100"
                  )}
                  aria-label={`Ver ${getPerspectiveLabel(index)}`}
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${productName} - ${getPerspectiveLabel(index)}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {/* Index number */}
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                  {/* Label below thumbnail */}
                  <span
                    className={cn(
                      "block text-xs mt-1.5 text-center truncate max-w-24",
                      selectedIndex === index
                        ? "text-amber-600 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {getPerspectiveLabel(index)}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick navigation dots - Mobile */}
            <div className="flex lg:hidden justify-center gap-2">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    selectedIndex === index
                      ? "bg-amber-500 w-6"
                      : "bg-zinc-300 dark:bg-zinc-600"
                  )}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Lightbox - Enhanced */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 h-14 w-14 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all z-50"
              onClick={closeLightbox}
            >
              <X className="h-8 w-8" />
            </Button>

            {/* Perspective Label */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white z-40">
              <span className="font-medium">{getPerspectiveLabel(selectedIndex)}</span>
              <span className="mx-2 text-white/50">•</span>
              <span className="text-white/70">
                {selectedIndex + 1} de {displayImages.length}
              </span>
            </div>

            {/* Navigation */}
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-6 h-16 w-16 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevious()
                  }}
                >
                  <ChevronLeft className="h-10 w-10" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-6 h-16 w-16 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                >
                  <ChevronRight className="h-10 w-10" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <div
              className="relative max-w-[85vw] max-h-[80vh] aspect-square animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[selectedIndex]}
                alt={`${productName} - ${getPerspectiveLabel(selectedIndex)}`}
                fill
                className="object-contain"
                sizes="85vw"
                priority
              />
            </div>

            {/* Thumbnail strip */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl max-w-[90vw] overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedIndex(index)
                    }}
                    className={cn(
                      "relative flex-shrink-0 transition-all duration-200",
                      selectedIndex === index
                        ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-black/50 scale-110"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={getPerspectiveLabel(index)}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard hint */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/50 text-sm">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-xs">←</kbd>
                <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-xs">→</kbd>
                Navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-xs">Esc</kbd>
                Fechar
              </span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
