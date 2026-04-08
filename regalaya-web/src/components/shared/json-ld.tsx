"use client"

import type { Product } from "@/types/product"
import {
  generateProductSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
} from "@/lib/seo"
import { JsonLdScript } from "@/components/shared/json-ld-script"
import { SITE_URL, APP_NAME } from "@/lib/constants"

interface ProductJsonLdProps {
  product: Product
}

/**
 * JSON-LD para página de produto
 */
export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const schema = generateProductSchema(product, `${SITE_URL}/products/${product.slug}`)
  return <JsonLdScript schema={schema} />
}

interface OrganizationJsonLdProps {
  name?: string
  phone?: string
  socialLinks?: string[]
}

/**
 * JSON-LD para organização (colocar no layout)
 */
export function OrganizationJsonLd({
  name = APP_NAME,
  phone,
  socialLinks,
}: OrganizationJsonLdProps) {
  const schema = generateOrganizationSchema({
    name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    phone,
    socialLinks,
  })
  return <JsonLdScript schema={schema} />
}

interface WebSiteJsonLdProps {
  name?: string
  description?: string
}

/**
 * JSON-LD para website (colocar no layout)
 */
export function WebSiteJsonLd({
  name = APP_NAME,
  description,
}: WebSiteJsonLdProps) {
  const schema = generateWebSiteSchema()
  if (name) schema.name = name
  if (description) schema.description = description
  return <JsonLdScript schema={schema} />
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[]
}

/**
 * JSON-LD para breadcrumb
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = generateBreadcrumbSchema(items)
  return <JsonLdScript schema={schema} />
}

interface ArticleJsonLdProps {
  headline: string
  description: string
  image: string[]
  authorName: string
  datePublished: string
  dateModified: string
}

/**
 * JSON-LD para artigo de blog
 */
export function ArticleJsonLd({
  headline,
  description,
  image,
  authorName,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const schema = generateArticleSchema({
    headline,
    description,
    image,
    authorName,
    datePublished,
    dateModified,
  })
  return <JsonLdScript schema={schema} />
}

interface AggregateRating {
  ratingValue: number
  reviewCount: number
  bestRating?: number
  worstRating?: number
}

interface Offer {
  price: number
  priceCurrency: string
  availability: string
  url: string
}

interface Review {
  author: string
  datePublished: string
  reviewBody: string
  reviewRating: {
    ratingValue: number
    bestRating: number
    worstRating: number
  }
}

/**
 * JSON-LD avançado para produto com reviews e ratings
 */
export function ProductWithReviewsJsonLd({
  product,
  rating,
  reviews = [],
}: {
  product: Product
  rating?: AggregateRating
  reviews?: Review[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: APP_NAME,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BRL",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
    },
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.ratingValue.toString(),
        reviewCount: rating.reviewCount.toString(),
        bestRating: rating.bestRating?.toString() || "5",
        worstRating: rating.worstRating?.toString() || "1",
      },
    }),
    ...(reviews.length > 0 && {
      review: reviews.map(r => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.author,
        },
        datePublished: r.datePublished,
        reviewBody: r.reviewBody,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.reviewRating.ratingValue.toString(),
          bestRating: r.reviewRating.bestRating.toString(),
          worstRating: r.reviewRating.worstRating.toString(),
        },
      })),
    }),
  }

  return <JsonLdScript schema={schema} />
}
