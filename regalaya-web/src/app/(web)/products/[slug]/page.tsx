import { Metadata } from "next"
import { productsService } from "@/services/products.service"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { ProductGallery } from "@/components/web/product-gallery"
import { ProductDescription } from "@/components/web/product-description"
import { DeliveryInfo } from "@/components/web/delivery-info"
import { Check } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/web/product-card"
import { AddToCartButton } from "@/components/web/add-to-cart-button"
import type { Product } from "@/types/product"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchProductsByCategory(categoryId: string, excludeId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products?categoryId=${categoryId}&size=4`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.content || []).filter((p: Product) => p.id !== excludeId)
  } catch {
    return []
  }
}

/**
 * Dynamic Metadata for SEO and Open Graph
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://regalaya.com.br"

  if (!product) {
    return {
      title: "Produto não encontrado | Regalaya",
      description: "O produto que você procura não foi encontrado.",
    }
  }

  return {
    title: `${product.name} | Regalaya`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: [
        {
          url: product.images?.[0] || `${baseUrl}/images/products/chocolates.jpg`,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
      type: "website",
      url: `${baseUrl}/products/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription || product.description,
      images: [product.images?.[0] || `${baseUrl}/images/products/chocolates.jpg`],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const product = await fetchProductBySlug(slug)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">Produto não encontrado</h1>
        <p className="text-[#788090] mb-6">O produto que você procura não existe ou foi removido.</p>
        <Link href="/products" className="text-[#be7374] hover:underline">
          ← Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const relatedProducts = product.categoryId
    ? await fetchProductsByCategory(product.categoryId, product.id)
    : []

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
          <li>
            <Link href="/products" className="hover:text-[#be7374] transition-colors">
              Produtos
            </Link>
          </li>
          <li className="text-[#788090]">/</li>
          <li className="text-[#1a1a1a] font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Product Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="default" className="mb-2 text-xs">
                {typeof product.category === 'string' ? product.category : (product.category as any)?.name}
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-[#1a1a1a] md:text-3xl">
              {product.name}
            </h1>
            {product.sku && (
              <p className="mt-1 text-xs text-[#788090]">SKU: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-[#be7374] md:text-4xl">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-[#788090] line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <Badge variant="destructive" className="text-xs">
                  Economize {formatPrice(product.compareAtPrice - product.price)}
                </Badge>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {(product.stock ?? 0) > 0 ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Em estoque ({product.stock} unidades)
                </span>
              </>
            ) : (
              <span className="text-sm text-red-600 font-medium">Fora de estoque</span>
            )}
          </div>

          {/* Enhanced Product Description */}
          <ProductDescription
            name={product.name}
            description={product.description}
            shortDescription={product.shortDescription}
            category={typeof product.category === 'string' ? product.category : (product.category as any)?.name || ""}
            tags={[]}
          />

          {/* Add to Cart */}
          <AddToCartButton product={product as any} />

          {/* Delivery Info */}
          <DeliveryInfo stock={product.stock ?? 0} />

          {/* Payment Info */}
          <Card className="border-[#e8e4e0]">
            <CardContent className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">
                Formas de Pagamento
              </h3>
              <div className="space-y-2 text-xs text-[#788090]">
                <p>
                  <span className="font-medium text-[#1a1a1a]">PIX:</span>{" "}
                  {formatPrice(product.price)} (5% off)
                </p>
                <p>
                  <span className="font-medium text-[#1a1a1a]">Cartão:</span>{" "}
                  até 12x de {formatPrice(product.price / 12)} sem juros
                </p>
                <p>
                  <span className="font-medium text-[#1a1a1a]">Boleto:</span>{" "}
                  {formatPrice(product.price)} (5% off)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
