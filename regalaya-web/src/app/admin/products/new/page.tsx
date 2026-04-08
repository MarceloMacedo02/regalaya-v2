import { Metadata } from "next"
import { ProductForm } from "@/components/admin/product-form"

export const metadata: Metadata = {
  title: "Novo Produto | Regalaya Admin",
  description: "Cadastrar novo produto",
}

export default function NewProductPage() {
  return <ProductForm mode="create" />
}
