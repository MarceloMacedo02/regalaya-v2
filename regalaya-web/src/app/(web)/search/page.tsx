"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { products, Product } from "@/lib/mock-data"
import { ProductCard } from "@/components/web/product-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Sparkles, ArrowRight, Package } from "lucide-react"

type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc" | "name-desc"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [results, setResults] = useState<Product[]>([])

  // Search effect - runs on mount and when query changes
  useEffect(() => {
    // Get query from URL params if not set in state
    const searchQuery = query || searchParams.get("q") || ""
    const normalizedQuery = searchQuery.toLowerCase().trim()

    if (!normalizedQuery) {
      setResults([])
      return
    }

    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(normalizedQuery)
      const descMatch = (product.description || "").toLowerCase().includes(normalizedQuery)
      const categoryMatch = product.category.toLowerCase().includes(normalizedQuery)
      const tagsMatch = product.tags.some((tag) =>
        tag.toLowerCase().includes(normalizedQuery)
      )
      const skuMatch = product.sku?.toLowerCase().includes(normalizedQuery)

      return nameMatch || descMatch || categoryMatch || tagsMatch || skuMatch
    })

    setResults(filtered)
  }, [query, searchParams])

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...results]

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price)
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case "relevance":
      default:
        return sorted.sort((a, b) => {
          const normalizedQuery = query.toLowerCase().trim()
          const aName = a.name.toLowerCase().includes(normalizedQuery) ? 0 : 1
          const bName = b.name.toLowerCase().includes(normalizedQuery) ? 0 : 1
          return aName - bName
        })
    }
  }, [results, sortBy, query])

  // Clear search
  const clearSearch = () => {
    setQuery("")
    setResults([])
  }

  // Popular searches for empty state
  const popularSearches = [
    "chocolate",
    "flores",
    "presente",
    "romântico",
    "aniversário",
  ]

  // Categories for empty state
  const categories = [
    { name: "Chocolates", slug: "chocolates", emoji: "🍫" },
    { name: "Flores", slug: "flores", emoji: "💐" },
    { name: "Bebidas", slug: "bebidas", emoji: "🍷" },
    { name: "Bem-estar", slug: "bem-estar", emoji: "🧴" },
    { name: "Acessórios", slug: "acessorios", emoji: "⌚" },
  ]

  const isSearching = query.length > 0 && results.length === 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {query ? `Resultados para "${query}"` : "Buscar Produtos"}
        </h1>
        {query && (
          <p className="mt-2 text-muted-foreground">
            {sortedResults.length} {sortedResults.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        )}
      </div>

      {/* Search Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-8 flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="O que você está procurando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-2"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Results or Empty State */}
      {query.length === 0 ? (
        // Empty State - No search yet
        <div className="space-y-8">
          {/* Popular Searches */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Buscas Populares
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  onClick={() => setQuery(term)}
                  className="hover:bg-amber-50 dark:hover:bg-amber-900/20"
                >
                  {term}
                </Button>
              ))}
            </div>
          </section>

          {/* Browse Categories */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <Package className="h-5 w-5 text-amber-500" />
              Ou explore por categoria
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group flex flex-col items-center rounded-lg border border-zinc-200 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-zinc-800 dark:hover:bg-amber-900/20"
                >
                  <span className="mb-2 text-3xl">{category.emoji}</span>
                  <span className="font-medium text-zinc-700 group-hover:text-amber-700 dark:text-zinc-300 dark:group-hover:text-amber-300">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Produtos em Destaque
              </h2>
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:underline"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      ) : isSearching ? (
        // No Results Found
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Nenhum resultado encontrado
          </h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Não encontramos produtos para &quot;{query}&quot;. 
            Que tal tentar outras palavras-chave ou navegar pelas categorias?
          </p>

          {/* Suggestions */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Sugestões:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
            <Link href="/products">
              <Button variant="default">Ver todos os produtos</Button>
            </Link>
          </div>
        </div>
      ) : (
        // Has Results
        <div>
          {/* Sort and Results Count */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Badge variant="secondary" className="self-start">
              {sortedResults.length} {sortedResults.length === 1 ? "produto" : "produtos"}
            </Badge>
            <div className="w-48">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="name-asc">Nome A-Z</SelectItem>
                  <SelectItem value="name-desc">Nome Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedResults.map((product) => (
              <SearchResultCard key={product.id} product={product} query={query} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Product card with highlighted search terms
 */
function SearchResultCard({ product, query }: { product: Product; query: string }) {
  return (
    <ProductCard product={product} highlightText={query} />
  )
}

/**
 * Search page with Suspense wrapper
 */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-64 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-72 rounded bg-zinc-200 dark:bg-zinc-800" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
