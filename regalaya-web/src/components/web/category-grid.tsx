import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { Category } from "@/lib/mock-data"

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Categorias</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-32 w-full overflow-hidden">
                  <Image
                    src={category.image || "/images/categories/chocolates.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.productCount} produtos</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}