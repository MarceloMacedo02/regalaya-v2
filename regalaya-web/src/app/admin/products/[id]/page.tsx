import { Metadata } from "next"
import { ProductForm } from "@/components/admin/product-form"
import { products } from "@/lib/mock-data"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  return {
    title: product ? `Editar: ${product.name} | Regalaya Admin` : "Editar Produto | Regalaya Admin",
    description: "Editar informações do produto",
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return <ProductForm product={product} mode="edit" />
}
