/**
 * JSON-LD Schema Generator
 *
 * Gera schemas estruturados para SEO
 * https://schema.org/
 */

import type { Product } from "@/types/product"
import { APP_NAME, SITE_URL } from "@/lib/constants"

interface OrganizationSchema {
  "@context": string
  "@type": string
  name: string
  url: string
  logo: string
  sameAs?: string[]
  contactPoint?: {
    "@type": string
    telephone: string
    contactType: string
  }[]
}

interface ProductSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  image: string[]
  brand: {
    "@type": string
    name: string
  }
  offers: {
    "@type": string
    price: number
    priceCurrency: string
    availability: string
    url: string
  }
  aggregateRating?: {
    "@type": string
    ratingValue: string
    reviewCount: string
  }
}

interface WebSiteSchema {
  "@context": string
  "@type": string
  name: string
  description: string
  url: string
  language: string
}

interface BreadcrumbListSchema {
  "@context": string
  "@type": string
  itemListElement: {
    "@type": string
    position: number
    name: string
    item: string
  }[]
}

interface ArticleSchema {
  "@context": string
  "@type": string
  headline: string
  description: string
  image: string[]
  author: {
    "@type": string
    name: string
  }
  publisher: {
    "@type": string
    name: string
    logo: {
      "@type": string
      url: string
    }
  }
  datePublished: string
  dateModified: string
}

/**
 * Gera schema de Organização
 */
export function generateOrganizationSchema(data: {
  name: string
  url: string
  logo: string
  phone?: string
  socialLinks?: string[]
}): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    logo: data.logo,
    sameAs: data.socialLinks,
    contactPoint: data.phone
      ? [{
          "@type": "ContactPoint",
          telephone: data.phone,
          contactType: "customer service",
        }]
      : undefined,
  }
}

/**
 * Gera schema de Produto
 */
export function generateProductSchema(product: Product, productUrl: string): ProductSchema {
  const availability = product.stock > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock"

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.shortDescription || product.name,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: APP_NAME,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BRL",
      availability,
      url: productUrl,
    },
  }
}

/**
 * Gera schema de Website
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    description: "Encontre o presente perfeito para cada ocasião especial",
    url: SITE_URL,
    language: "pt-BR",
  }
}

/**
 * Gera schema de Breadcrumb
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * Gera schema de Artigo (para Blog)
 */
export function generateArticleSchema(data: {
  headline: string
  description: string
  image: string[]
  authorName: string
  datePublished: string
  dateModified: string
}): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description,
    image: data.image,
    author: {
      "@type": "Person",
      name: data.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
  }
}
