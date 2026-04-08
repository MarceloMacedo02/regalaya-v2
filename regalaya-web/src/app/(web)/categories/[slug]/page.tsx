import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ClientCategoryPage } from "./client-page"
import { productsService } from "@/services/products.service"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categories = await productsService.findCategories()
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    return { title: "Categoria não encontrada | Regalaya" }
  }

  return {
    title: `${category.name} | Regalaya`,
    description: category.description || `Comprar ${category.name} na Regalaya`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const [categories, allProducts] = await Promise.all([
    productsService.findCategories(),
    productsService.findAll(0, 100),
  ])

  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const categoryProducts = (allProducts.content || []).filter(
    (p: Product) => p.categoryId === category.id
  )

  return (
    <ClientCategoryPage
      category={category}
      initialProducts={categoryProducts}
      allCategories={categories}
    />
  )
}
