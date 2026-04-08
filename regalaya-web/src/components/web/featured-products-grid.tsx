"use client"

import Link from "next/link"
import { ProductCard } from "@/components/web/product-card"
import type { Product } from "@/lib/mock-data"

interface FeaturedProductsGridProps {
  products: Product[]
  title?: string
}

export function FeaturedProductsGrid({
  products,
  title = 'Produtos em Destaque',
}: FeaturedProductsGridProps) {
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1a1a1a] md:text-3xl">{title}</h2>
        <Link
          href="/products"
          className="text-sm font-semibold text-[#be7374] transition-colors hover:text-[#be7374]/80"
        >
          Ver Todos →
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
