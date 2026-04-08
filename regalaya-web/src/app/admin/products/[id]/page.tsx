import { Metadata } from "next"
import { ProductForm } from "@/components/admin/product-form"
import { productsService } from "@/services/products.service"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const product = await productsService.findById(id)
    return {
      title: `Editar: ${product.name} | Regalaya Admin`,
      description: "Editar informações do produto",
    }
  } catch {
    return {
      title: "Editar Produto | Regalaya Admin",
      description: "Editar informações do produto",
    }
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  
  try {
    const product = await productsService.findById(id)
    return <ProductForm product={product} mode="edit" />
  } catch (error) {
    notFound()
  }
}