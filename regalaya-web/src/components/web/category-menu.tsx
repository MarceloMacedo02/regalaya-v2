"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { categories } from "@/lib/mock-data"
import { ChevronDown, ChevronRight } from "lucide-react"

interface CategoryMenuProps {
  isMobile?: boolean
}

export function CategoryMenu({ isMobile = false }: CategoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveCategory(null)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (isMobile) {
    return (
      <div className="space-y-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={() => setIsOpen(false)}
          >
            <span>{category.name}</span>
            <span className="text-xs text-muted-foreground">({category.productCount})</span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        Categorias
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[600px] rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex">
            {/* Categories List */}
            <div className="w-48 border-r border-zinc-200 dark:border-zinc-800 p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onClick={() => {
                    window.location.href = `/categories/${category.slug}`
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                    activeCategory === category.id
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span>{category.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Category Details */}
            <div className="flex-1 p-4">
              {activeCategory ? (
                <CategoryDetail categoryId={activeCategory} onClose={() => setIsOpen(false)} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p className="text-sm">Passe o mouse sobre uma categoria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Category Detail Component
function CategoryDetail({ categoryId, onClose }: { categoryId: string; onClose: () => void }) {
  const category = categories.find((c) => c.id === categoryId)

  if (!category) return null

  // Get related categories (same first letter for demo)
  const relatedCategories = categories
    .filter((c) => c.id !== categoryId)
    .slice(0, 4)

  return (
    <div>
      <div className="mb-4">
        <Link
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className="text-lg font-semibold text-zinc-900 hover:text-amber-600 dark:text-zinc-100"
        >
          {category.name}
        </Link>
        <p className="text-sm text-muted-foreground">{category.description}</p>
        <p className="mt-1 text-sm text-amber-600">{category.productCount} produtos</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase text-zinc-500">Subcategorias</p>
        <div className="grid grid-cols-2 gap-2">
          {relatedCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/categories/${sub.slug}`}
              onClick={onClose}
              className="text-sm text-zinc-600 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
        >
          Ver todos os {category.name} →
        </Link>
      </div>
    </div>
  )
}
