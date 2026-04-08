"use client"

import { useState, useCallback, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { productsService } from "@/services/products.service"
import { ProductCard } from "@/components/web/product-card"
import { Pagination } from "@/components/web/pagination"
import { Loader2, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Product } from "@/services/products.service"
import type { Category } from "@/types/category"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const searchQuery = searchParams.get("q") || ""
  const page = parseInt(searchParams.get("page") || "1", 10)
  const sortBy = searchParams.get("sort") || "relevance"

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    productsService.findCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const sortField = sortBy === "price-asc" ? "price" : sortBy === "price-desc" ? "price" : sortBy === "newest" ? "createdAt" : "name"
        const sortOrder = sortBy === "price-asc" ? "asc" : "desc"

        const response = await productsService.findAll(
          page - 1,
          20,
          {
            search: searchQuery || undefined,
            categoryId: selectedCategory || undefined,
          },
          sortBy !== "relevance" ? { field: sortField as any, order: sortOrder as any } : undefined
        )

        setProducts(response.content || [])
        setTotalElements(response.totalElements || 0)
        setTotalPages(response.totalPages || 0)
      } catch {
        setProducts([])
        setTotalElements(0)
        setTotalPages(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, selectedCategory, sortBy, page])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (localQuery.trim()) {
      router.replace(`/products/search?q=${encodeURIComponent(localQuery.trim())}&page=1`)
    }
  }, [localQuery, router])

  const updateSort = useCallback((sort: string) => {
    const params = new URLSearchParams(searchParams)
    if (sort === "relevance") params.delete("sort")
    else params.set("sort", sort)
    params.set("page", "1")
    router.replace(`?${params.toString()}`)
  }, [router, searchParams])

  const updatePage = useCallback((pageNum: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNum.toString())
    router.replace(`?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold text-[#1a1a1a]">
          {searchQuery ? `Resultados para "${searchQuery}"` : "Buscar Produtos"}
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <Input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Buscar presentes..."
            className="flex-1"
          />
          <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Category Sidebar */}
        <aside className="lg:w-[240px] flex-shrink-0">
          <div className="rounded-xl border border-[#e8e4e0] bg-white p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#1a1a1a]">
              <SlidersHorizontal className="h-4 w-4" />
              Categorias
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedCategory(null); router.replace(`/products/search?q=${encodeURIComponent(searchQuery)}&page=1`) }}
                className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-amber-50 text-amber-700 font-medium"
                    : "text-[#788090] hover:bg-zinc-50"
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); router.replace(`/products/search?q=${encodeURIComponent(searchQuery)}&category=${cat.id}&page=1`) }}
                  className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-amber-50 text-amber-700 font-medium"
                      : "text-[#788090] hover:bg-zinc-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="mx-auto h-16 w-16 text-[#e8e4e0] mb-4" />
              <p className="text-lg text-[#788090]">Nenhum produto encontrado</p>
              <p className="text-sm text-[#788090] mt-2">
                {searchQuery
                  ? `Não encontramos resultados para "${searchQuery}". Tente buscar por outros termos.`
                  : "Digite um termo de busca para encontrar presentes."}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-[#788090]">
                  {totalElements} resultado{totalElements !== 1 ? "s" : ""} encontrado
                  {totalElements !== 1 ? "s" : ""}
                  {searchQuery && ` para "${searchQuery}"`}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => updateSort(e.target.value)}
                  className="rounded-md border border-[#e8e4e0] bg-white px-3 py-2 text-sm text-[#1a1a1a]"
                >
                  <option value="relevance">Relevância</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="newest">Mais Recentes</option>
                </select>
              </div>

              <div className="grid gap-x-6 gap-y-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    highlightText={searchQuery}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    totalItems={totalElements}
                    itemsPerPage={20}
                    currentPage={page}
                    onPageChange={updatePage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-10">
          <div className="mb-8 animate-pulse space-y-3">
            <div className="h-8 w-64 rounded bg-[#e8e4e0]" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded bg-[#e8e4e0]" />
              <div className="h-10 w-24 rounded bg-[#e8e4e0]" />
            </div>
          </div>
          <div className="flex gap-10">
            <div className="h-64 w-60 rounded-xl bg-[#e8e4e0]" />
            <div className="flex-1">
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square rounded-xl bg-[#e8e4e0]" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-full rounded bg-[#e8e4e0]" />
                      <div className="h-4 w-3/4 rounded bg-[#e8e4e0]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
