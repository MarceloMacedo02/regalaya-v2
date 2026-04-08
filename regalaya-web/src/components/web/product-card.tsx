"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice, cn } from "@/lib/utils"
type ProductCardProduct = {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  images: string[]
  category?: string | { name?: string }
  tags: string[]
  sku?: string
  stock: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}
import { Heart, ShoppingCart, Images, ChevronLeft, ChevronRight } from "lucide-react"
import { useWishlistContext } from "@/contexts/wishlist-context"
import { toast } from "@/components/ui/use-toast"

interface ProductCardProps {
  product: ProductCardProduct
  className?: string
  highlightText?: string
  showFavoriteButton?: boolean
  showImageCount?: boolean
}

export function ProductCard({
  product,
  className,
  highlightText,
  showFavoriteButton = true,
  showImageCount = true,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlistContext()
  const [hoveredImageIndex, setHoveredImageIndex] = useState(-1)
  const [isHovering, setIsHovering] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const isFavorite = isInWishlist(product.id)
  const hasMultipleImages = product.images.length > 1

  // Cycle through images on hover
  useEffect(() => {
    if (isHovering && hasMultipleImages) {
      cycleIntervalRef.current = setInterval(() => {
        setHoveredImageIndex((prev) => {
          const nextIndex = prev + 1
          return nextIndex >= product.images.length ? 0 : nextIndex
        })
      }, 1200) // Change image every 1.2 seconds
    } else {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current)
      }
      setHoveredImageIndex(-1)
    }

    return () => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current)
      }
    }
  }, [isHovering, hasMultipleImages, product.images.length])

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    // Small delay to prevent flickering when moving within card
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false)
    }, 100)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)

    if (!isFavorite) {
      toast({
        title: "Adicionado aos favoritos!",
        description: `${product.name} foi adicionado à sua lista de desejos.`,
        duration: 3000,
      })
    }
  }

  const handleImageNavClick = (e: React.MouseEvent, direction: "prev" | "next") => {
    e.preventDefault()
    e.stopPropagation()
    if (direction === "prev") {
      setHoveredImageIndex((prev) =>
        prev <= 0 ? product.images.length - 1 : prev - 1
      )
    } else {
      setHoveredImageIndex((prev) =>
        prev >= product.images.length - 1 ? 0 : prev + 1
      )
    }
    // Reset auto-cycle timer
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current)
      if (isHovering) {
        cycleIntervalRef.current = setInterval(() => {
          setHoveredImageIndex((prev) => {
            const nextIndex = prev + 1
            return nextIndex >= product.images.length ? 0 : nextIndex
          })
        }, 1200)
      }
    }
  }

  const currentImageIndex = hoveredImageIndex >= 0 ? hoveredImageIndex : 0
  const currentImage = product.images[currentImageIndex] || product.images[0] || "/images/products/chocolates.jpg"

  return (
    <Link
      key={product.id}
      href={`/products/${product.slug}`}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="group h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-300",
              isHovering && "scale-105"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Offer Badge */}
          {product.compareAtPrice && (
            <Badge className="absolute left-2 top-2 bg-red-500 shadow-lg">
              Oferta
            </Badge>
          )}

          {/* Image Count Badge */}
          {showImageCount && hasMultipleImages && (
            <Badge
              variant="secondary"
              className={cn(
                "absolute right-2 top-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-md transition-all",
                isHovering && "opacity-0"
              )}
            >
              <Images className="h-3 w-3 mr-1" />
              {product.images.length}
            </Badge>
          )}

          {/* Image Navigation on Hover */}
          {hasMultipleImages && isHovering && (
            <>
              <button
                onClick={(e) => handleImageNavClick(e, "prev")}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors z-10"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => handleImageNavClick(e, "next")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors z-10"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {hasMultipleImages && isHovering && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {product.images.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setHoveredImageIndex(idx)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentImageIndex === idx
                      ? "bg-amber-500 w-4"
                      : "bg-white/70 hover:bg-white"
                  )}
                  aria-label={`Ver imagem ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Favorite Button */}
          {showFavoriteButton && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all z-20",
                isFavorite && "text-red-500 hover:text-red-600"
              )}
              style={{ top: hasMultipleImages && !isHovering ? "2.5rem" : undefined }}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </Button>
          )}

          {/* Quick Add to Cart - Appears on hover */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300",
              isHovering ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              size="sm"
              className="w-full bg-white text-zinc-900 hover:bg-zinc-100"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Add to cart logic here
                toast({
                  title: "Adicionado ao carrinho!",
                  description: `${product.name} foi adicionado ao carrinho.`,
                  duration: 2000,
                })
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Card Content */}
        <CardHeader className="p-4 pb-2">
          <Badge
            variant="default"
            className="max-w-full text-center whitespace-normal break-words text-xs"
          >
            {typeof product.category === 'string' ? product.category : (product.category as any)?.name}
          </Badge>
          <CardTitle className="line-clamp-2 text-lg leading-tight">
            {highlightText ? (
              <HighlightText text={product.name} query={highlightText} />
            ) : (
              product.name
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {highlightText ? (
              <HighlightText
                text={product.shortDescription || product.description}
                query={highlightText}
              />
            ) : (
              product.shortDescription || product.description
            )}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-600">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
              Últimas {product.stock}
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="text-xs">
              Esgotado
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

/**
 * Highlight search term in text
 */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const normalizedQuery = query.toLowerCase().trim()
  const normalizedText = text.toLowerCase()

  const parts: Array<{ text: string; highlight: boolean }> = []
  let lastIndex = 0
  let index = normalizedText.indexOf(normalizedQuery)

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, index),
        highlight: false,
      })
    }

    parts.push({
      text: text.slice(index, index + query.length),
      highlight: true,
    })

    lastIndex = index + query.length
    index = normalizedText.indexOf(normalizedQuery, lastIndex)
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false,
    })
  }

  if (parts.length === 0) return <>{text}</>

  return (
    <>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100 rounded px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  )
}
