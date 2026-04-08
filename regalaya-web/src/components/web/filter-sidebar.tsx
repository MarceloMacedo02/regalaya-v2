"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Category } from "@/types/category"
import { X, SlidersHorizontal } from 'lucide-react'

export interface FilterState {
  search: string
  categoryId: string | null
  minPrice: number | null
  maxPrice: number | null
  tags: string[]
  inStock: boolean | null
}

interface FilterSidebarProps {
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
  initialValues?: Partial<FilterState>
}

// All available tags from products
const AVAILABLE_TAGS = [
  "chocolate", "belga", "presentes", "flores", "buque", "romantico",
  "vinho", "premium", "bebida", "spa", "relaxamento", "bem-estar",
  "relogio", "acessorio", "elegante", "caneca", "personalizado", "diy",
  "almofada", "decoracao", "conforto", "porta-joias", "artesanal", "organizador"
]

export function FilterSidebar({ categories, onFilterChange, initialValues }: FilterSidebarProps) {
  const router = useRouter()

  const [search, setSearch] = useState(initialValues?.search || "")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialValues?.categoryId || null)
  const [minPrice, setMinPrice] = useState<number | null>(initialValues?.minPrice ?? null)
  const [maxPrice, setMaxPrice] = useState<number | null>(initialValues?.maxPrice ?? null)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialValues?.tags || [])
  const [inStock, setInStock] = useState<boolean | null>(initialValues?.inStock ?? null)
  const [showAllTags, setShowAllTags] = useState(false)

  // Check if any filters are active
  const hasActiveFilters = search || selectedCategoryId || minPrice || maxPrice || selectedTags.length > 0 || inStock !== null

  // Apply filters when any value changes
  const applyFilters = useCallback(() => {
    const filters: FilterState = {
      search,
      categoryId: selectedCategoryId,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null,
      tags: selectedTags,
      inStock: inStock,
    }

    // Only update URL if we're in a context that needs it
    // Skip for category pages where filtering is handled locally
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/products')) {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (selectedCategoryId) params.set("category", selectedCategoryId)
      if (minPrice !== null) params.set("minPrice", minPrice.toString())
      if (maxPrice !== null) params.set("maxPrice", maxPrice.toString())
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))
      if (inStock !== null) params.set("inStock", inStock.toString())

      router.replace(`?${params.toString()}`)
    }
    onFilterChange(filters)
  }, [search, selectedCategoryId, minPrice, maxPrice, selectedTags, inStock, router, onFilterChange])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearch("")
    setSelectedCategoryId(null)
    setMinPrice(null)
    setMaxPrice(null)
    setSelectedTags([])
    setInStock(null)

    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/products')) {
      router.replace("?")
    }
    onFilterChange({
      search: "",
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      tags: [],
      inStock: null,
    })
  }, [router, onFilterChange])

  // Apply filters on initial load and when params change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Toggle tag
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Get displayed tags (show first 10 or all)
  const displayedTags = showAllTags ? AVAILABLE_TAGS : AVAILABLE_TAGS.slice(0, 10)

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <Card className="bg-white border border-[#e8e4e0] rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-[#788090]">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-[10px] text-red-500 hover:text-red-600 h-auto py-0 px-1"
              >
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-1">
            <Label className="text-xs text-[#788090]">Buscar</Label>
            <Input
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label className="text-xs text-[#788090]">Categoria</Label>
            <SelectPrimitive.Root
              value={selectedCategoryId || "all"}
              onValueChange={(value) => {
                setSelectedCategoryId(value === "all" ? null : value)
              }}
            >
              <SelectPrimitive.Trigger className="w-full flex items-center justify-between rounded-md border border-input bg-background px-2 py-1.5 text-xs">
                <SelectPrimitive.Value placeholder="Todas as categorias">
                  {selectedCategoryId
                    ? categories.find(c => c.id === selectedCategoryId)?.name
                    : "Todas as categorias"}
                </SelectPrimitive.Value>
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Content>
                <SelectPrimitive.Viewport className="bg-white dark:bg-zinc-900 rounded-md border shadow-md p-1">
                  <SelectPrimitive.Item value="all" className="relative flex items-center px-2 py-1 text-xs outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                    <SelectPrimitive.ItemText>Todas as categorias</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                  {categories.map((category) => (
                    <SelectPrimitive.Item
                      key={category.id}
                      value={category.id}
                      className="relative flex items-center px-2 py-1 text-xs outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                    >
                      <SelectPrimitive.ItemText>{category.name}</SelectPrimitive.ItemText>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>
              </SelectPrimitive.Content>
            </SelectPrimitive.Root>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <Label className="text-xs text-[#788090]">Preço</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice !== null ? minPrice.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value
                  setMinPrice(value === "" ? null : parseFloat(value))
                }}
                className="w-full h-8 text-xs"
              />
              <span className="text-[10px] text-[#788090]">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice !== null ? maxPrice.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value
                  setMaxPrice(value === "" ? null : parseFloat(value))
                }}
                className="w-full h-8 text-xs"
              />
            </div>
          </div>

          {/* Tags Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-[#788090]">Tags</Label>
            <div className="flex flex-wrap gap-1">
              {displayedTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  className="h-6 text-[10px] px-1.5 py-0"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
            {AVAILABLE_TAGS.length > 10 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowAllTags(!showAllTags)}
                className="h-auto p-0 text-[10px]"
              >
                {showAllTags ? "Menos" : `+${AVAILABLE_TAGS.length - 10}`}
              </Button>
            )}
          </div>

          {/* Availability Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-[#788090]">Disponibilidade</Label>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={inStock === true}
                  onCheckedChange={(checked) => {
                    setInStock(checked ? true : null)
                  }}
                  className="h-3 w-3"
                />
                <Label htmlFor="inStock" className="text-[10px] font-normal cursor-pointer">
                  Em estoque
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onSale"
                  checked={inStock === false}
                  onCheckedChange={(checked) => {
                    setInStock(checked ? false : null)
                  }}
                  className="h-3 w-3"
                />
                <Label htmlFor="onSale" className="text-[10px] font-normal cursor-pointer">
                  Fora de estoque
                </Label>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-1.5 border-t border-[#e8e4e0]">
              <p className="text-[10px] text-[#788090] mb-1.5">Ativos:</p>
              <div className="flex flex-wrap gap-1">
                {selectedCategoryId && (
                  <span className="inline-flex items-center gap-1 bg-[#fed2cc]/60 text-[#be7374] text-[10px] px-1.5 py-0.5 rounded">
                    {categories.find(c => c.id === selectedCategoryId)?.name}
                    <button onClick={() => setSelectedCategoryId(null)} className="hover:text-[#be7374]">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-[#f6f3f2] text-[#1a1a1a] text-[10px] px-1.5 py-0.5 rounded">
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="hover:text-[#be7374]">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                {inStock !== null && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded">
                    {inStock ? "Em estoque" : "Fora de estoque"}
                    <button onClick={() => setInStock(null)} className="hover:text-green-600">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}
