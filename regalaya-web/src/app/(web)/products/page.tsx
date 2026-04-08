"use client"

import { useState, useCallback, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { productsService } from "@/services/products.service"
import { ProductCard } from "@/components/web/product-card"
import { FilterSidebar } from "@/components/web/filter-sidebar"
import { SortSelect } from "@/components/web/sort-select"
import { Pagination } from "@/components/web/pagination"
import { Loader2 } from "lucide-react"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"

// Filters type
type Filters = {
  search: string | null
  categoryId: string | null
  minPrice: number | null
  maxPrice: number | null
  tags: string[]
  inStock: boolean | null
}

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get filters from URL
  const searchQuery = searchParams.get("search") || ""
  const categoryId = searchParams.get("category") || null
  const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null
  const tagsParam = searchParams.get("tags") || ""
  const tags = tagsParam ? tagsParam.split(",") : []
  const inStockParam = searchParams.get("inStock")
  const inStock = inStockParam === "true" ? true : inStockParam === "false" ? false : null
  const sortBy = searchParams.get("sort") || "relevance"
  const page = parseInt(searchParams.get("page") || "1", 10)

  // API state
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories on mount
  useEffect(() => {
    productsService.findCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  // Fetch products when filters change
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
            categoryId: categoryId || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            inStock: inStock || undefined,
          },
          sortBy !== "relevance" ? { field: sortField as any, order: sortOrder as any } : undefined
        )

        setProducts(response.content || [])
        setTotalElements(response.totalElements || 0)
        setTotalPages(response.totalPages || 0)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setProducts([])
        setTotalElements(0)
        setTotalPages(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, categoryId, minPrice, maxPrice, inStock, sortBy, page])

  // Update URL when filters change
  const updateFilters = useCallback((filters: Filters) => {
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.categoryId) params.set("category", filters.categoryId)
    if (filters.minPrice !== null) params.set("minPrice", filters.minPrice.toString())
    if (filters.maxPrice !== null) params.set("maxPrice", filters.maxPrice.toString())
    if (sortBy !== "relevance") params.set("sort", sortBy)
    params.set("page", "1")

    router.replace(`?${params.toString()}`)
  }, [router, sortBy])

  // Update URL when sort changes
  const updateSort = useCallback((sort: string) => {
    const params = new URLSearchParams(searchParams)
    if (sort === "relevance") params.delete("sort")
    else params.set("sort", sort)
    params.set("page", "1")
    router.replace(`?${params.toString()}`)
  }, [router, searchParams])

  // Update URL when page changes
  const updatePage = useCallback((pageNum: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNum.toString())
    router.replace(`?${params.toString()}`)
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-bold text-[#1a1a1a]">Todos os Presentes</h1>
        <p className="text-base text-[#788090]">
          Encontre o presente perfeito para cada ocasião
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="lg:w-[280px] flex-shrink-0">
          <FilterSidebar
            categories={categories}
            onFilterChange={updateFilters}
          />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[#788090]">
              {totalElements} produto{totalElements !== 1 ? 's' : ''} encontrado{totalElements !== 1 ? 's' : ''}
            </p>
            <SortSelect value={sortBy} onChange={updateSort} />
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#788090]">Nenhum produto encontrado</p>
              <p className="text-sm text-[#788090] mt-2">Tente ajustar os filtros ou buscar por outro termo</p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}

          {/* Pagination */}
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
        </div>
      </div>
    </div>
  )
}

/**
 * Products page with Suspense wrapper for useSearchParams
 */
export default function ProductsPageWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-10">
          {/* Header Skeleton */}
          <div className="mb-10 animate-pulse space-y-3">
            <div className="h-8 w-64 rounded bg-[#e8e4e0]" />
            <div className="h-4 w-96 rounded bg-[#e8e4e0]" />
          </div>

          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Sidebar Skeleton */}
            <div className="lg:w-[280px] flex-shrink-0">
              <div className="animate-pulse space-y-4 rounded-xl border border-[#e8e4e0] bg-white p-6">
                <div className="h-5 w-24 rounded bg-[#e8e4e0]" />
                <div className="space-y-3">
                  <div className="h-10 w-full rounded bg-[#e8e4e0]" />
                  <div className="h-10 w-full rounded bg-[#e8e4e0]" />
                </div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between animate-pulse">
                <div className="h-4 w-48 rounded bg-[#e8e4e0]" />
                <div className="h-10 w-40 rounded bg-[#e8e4e0]" />
              </div>

              <div className="grid gap-x-6 gap-y-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      <ProductsPageContent />
    </Suspense>
  )
}
