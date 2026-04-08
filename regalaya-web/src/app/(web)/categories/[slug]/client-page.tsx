"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { ProductCard } from "@/components/web/product-card"
import { FilterSidebar, FilterState } from "@/components/web/filter-sidebar"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"

interface ClientCategoryPageProps {
  category: Category
  initialProducts: Product[]
  allCategories: Category[]
}

export function ClientCategoryPage({ category, initialProducts, allCategories }: ClientCategoryPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categoryId: category.id,
    minPrice: null,
    maxPrice: null,
    tags: [],
    inStock: null,
  })

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (filters.search &&
          !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.minPrice !== null && product.price < filters.minPrice) return false
      if (filters.maxPrice !== null && product.price > filters.maxPrice) return false

      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag =>
          product.tags.some(productTag =>
            productTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
        if (!hasMatchingTag) return false
      }

      if (filters.inStock !== null) {
        if (filters.inStock && product.stock <= 0) return false
        if (!filters.inStock && product.stock > 0) return false
      }

      return true
    })
  }, [filters, initialProducts])

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="container mx-auto px-4 py-10">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-[#788090]">
          <li>
            <Link href="/" className="hover:text-[#be7374] transition-colors">
              Home
            </Link>
          </li>
          <li className="text-[#788090]">/</li>
          <li>
            <Link href="/categories" className="hover:text-[#be7374] transition-colors">
              Categorias
            </Link>
          </li>
          <li className="text-[#788090]">/</li>
          <li className="text-[#1a1a1a] font-medium">{category.name}</li>
        </ol>
      </nav>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#1a1a1a] md:text-3xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-base text-[#788090]">{category.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <aside className="lg:w-[280px] flex-shrink-0">
          <FilterSidebar
            categories={allCategories}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-[#788090]">
                  Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? "produto" : "produtos"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f3f2]">
                <span className="text-2xl">📦</span>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-[#1a1a1a]">
                Nenhum produto encontrado
              </h2>
              <p className="mb-6 max-w-md text-sm text-[#788090]">
                Em breve teremos produtos nesta categoria.
              </p>
              <Link
                href="/products"
                className="text-sm font-medium text-[#be7374] hover:underline"
              >
                Ver todos os produtos →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
