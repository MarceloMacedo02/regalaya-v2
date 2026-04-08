import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"

/**
 * Sitemap dinâmico para SEO
 * 
 * Gera automaticamente URLs para:
 * - Páginas estáticas
 * - Produtos (quando integrado com API)
 * - Categorias
 * - Posts do blog
 * - Páginas institucionais
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL

  // URLs estáticas
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/recommendations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    // Páginas institucionais
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ]

  // URLs dinâmicas (categorias)
  // TODO: Quando integrado com API, buscar categorias reais
  const categoryUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/categories/chocolates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/categories/flores`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/categories/bebidas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/categories/experiencias`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // URLs dinâmicas (produtos)
  // TODO: Quando integrado com API, buscar produtos reais
  const productUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/products/caixa-bombons-belga`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/products/bouquet-flores-artesanais`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/products/vinho-tinto-premium`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ]

  // URLs dinâmicas (blog posts)
  // TODO: Quando integrado com API, buscar posts reais
  const blogUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog/como-escolher-presente-perfeito`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/presentes-dia-namorados`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/presentes-natal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // URLs dinâmicas (categorias de blog)
  const blogCategoryUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog/categories/dicas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/categories/ocasioes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/categories/tendencias`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]

  return [
    ...staticUrls,
    ...categoryUrls,
    ...productUrls,
    ...blogUrls,
    ...blogCategoryUrls,
  ]
}
