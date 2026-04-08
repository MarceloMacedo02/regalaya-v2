import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"

/**
 * Robots.txt para SEO
 * 
 * Define regras para crawlers de mecanismos de busca
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/categories/",
          "/products/",
          "/blog/",
          "/about",
          "/contact",
          "/faq",
        ],
        disallow: [
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart",
          "/wishlist",
          "/recommendations",
          "/chat",
          "/login",
          "/api/",
          "/_next/",
          "/*.json$",
        ],
      },
      // Google crawler - otimizações específicas
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/categories/",
          "/products/",
          "/blog/",
        ],
      },
      // Bing crawler
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/categories/",
          "/products/",
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl,
  }
}
