"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TopProduct } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils"
import { TrendingUp, Package } from "lucide-react"

interface TopProductsProps {
  products: TopProduct[]
  limit?: number
}

export function TopProducts({ products, limit = 5 }: TopProductsProps) {
  const displayProducts = products.slice(0, limit)

  const maxRevenue = Math.max(...products.map((p) => p.revenue))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Produtos Mais Vendidos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Top {limit} produtos por receita
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayProducts.map((product, index) => {
            const percentage = (product.revenue / maxRevenue) * 100

            return (
              <div key={product.productId} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {product.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.unitsSold} unidades
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatPrice(product.revenue)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                {/* Barra de progresso visual */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {products.length > limit && (
          <div className="mt-4 text-center">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver todos os produtos →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
