import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/mock-data"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Presentes em Destaque</h2>
          <Button variant="ghost" asChild>
            <Link href="/products">Ver todos →</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={product.images[0] || "/images/products/chocolates.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  />
                  {product.compareAtPrice && (
                    <Badge className="absolute left-2 top-2 bg-red-500">
                      -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-4">
                  <Badge variant="secondary" className="w-fit text-xs">
                    {product.category}
                  </Badge>
                  <CardTitle className="line-clamp-2 text-lg">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.shortDescription}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4">
                  <div>
                    <span className="text-xl font-bold text-amber-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}