"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn, formatPrice } from "@/lib/utils"
import { productsService } from "@/services/products.service"
import type { Product } from "@/services/products.service"
import { Search, Loader2 } from "lucide-react"

interface SearchDropdownProps {
  query: string
  results: Product[]
  isLoading: boolean
  show: boolean
  onClose: () => void
  onResultClick: () => void
}

export function SearchDropdown({
  query,
  results,
  isLoading,
  show,
  onClose,
  onResultClick,
}: SearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (show) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [show, onClose])

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (show) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full z-50 mt-2 w-full max-w-lg rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Buscando...</span>
        </div>
      ) : results.length > 0 ? (
        <ul className="max-h-96 overflow-y-auto p-2">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={onResultClick}
              >
                {/* Product Image */}
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={product.images[0] || "/images/products/chocolates.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <HighlightText text={product.name} query={query} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {typeof product.category === 'string' ? product.category : (product.category as any)?.name}
                  </p>
                  <p className="text-sm font-semibold text-amber-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))}

          {/* View All Results */}
          {results.length >= 5 && (
            <li className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
              <Link
                href={`/products/search?q=${encodeURIComponent(query)}`}
                className="flex items-center justify-center gap-2 rounded-md p-2 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                onClick={onResultClick}
              >
                <Search className="h-4 w-4" />
                Ver todos os {results.length}+ resultados
              </Link>
            </li>
          )}
        </ul>
      ) : query.length >= 2 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum produto encontrado para &quot;{query}&quot;
          </p>
          <Link
            href={`/products/search?q=${encodeURIComponent(query)}`}
            className="mt-2 inline-block text-sm font-medium text-amber-600 hover:underline"
            onClick={onResultClick}
          >
            Ver todos os resultados
          </Link>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Highlight search term in text
 */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const normalizedQuery = query.toLowerCase().trim()
  const normalizedText = text.toLowerCase()
  const index = normalizedText.indexOf(normalizedQuery)

  if (index === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}
