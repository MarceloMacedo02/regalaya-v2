import { Metadata } from "next"
import { categories } from "@/lib/mock-data"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Gift } from "lucide-react"

/**
 * Dynamic Metadata for SEO
 */
export const metadata: Metadata = {
  title: "Categorias | Regalaya",
  description: "Explore todas as categorias de presentes. Chocolates, flores, vinhos, experiências e muito mais.",
}

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-[#788090]">
          <li>
            <Link href="/" className="hover:text-[#be7374] transition-colors">
              Home
            </Link>
          </li>
          <li className="text-[#788090]">/</li>
          <li className="text-[#1a1a1a] font-medium">Categorias</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-bold text-[#1a1a1a] md:text-3xl">
          Todas as Categorias
        </h1>
        <p className="text-base text-[#788090]">
          Explore nossa coleção completa de presentes
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group"
          >
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 bg-white border border-[#e8e4e0] rounded-xl">
              {/* Image Area */}
              <div className="relative aspect-square bg-gradient-to-br from-[#fed2cc]/40 to-[#fed2cc]/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
                    <Gift className="h-10 w-10 text-[#be7374]" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <h2 className="text-lg font-bold text-[#1a1a1a] group-hover:text-[#be7374] transition-colors">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 text-xs text-[#788090] line-clamp-2">
                    {category.description}
                  </p>
                )}
              </CardContent>

              <CardFooter className="px-4 pb-4 pt-0">
                <div className="flex items-center text-xs text-[#788090]">
                  <span className="font-medium">{category.productCount} produtos</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
