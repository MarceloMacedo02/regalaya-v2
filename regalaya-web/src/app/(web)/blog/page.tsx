import type { Metadata } from "next"
import { SITE_URL } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { blogPosts, blogCategories } from "@/types/blog"
import { ArticleJsonLd } from "@/components/shared/json-ld"
import {
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Bookmark,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Blog | Regalaya",
  description: "Dicas, tendências e ideias de presentes para cada ocasião especial. Leia nosso blog e encontre inspiração.",
  openGraph: {
    title: "Blog | Regalaya",
    description: "Dicas e ideias de presentes para cada ocasião.",
    type: "website",
    locale: "pt_BR",
    siteName: "Regalaya",
    url: `${SITE_URL}/blog`,
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
}

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.isFeatured)
  const regularPosts = blogPosts.filter(post => !post.isFeatured)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Blog
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Blog Regalaya</h1>
          <p className="text-lg text-muted-foreground">
            Dicas, tendências e ideias de presentes para cada ocasião especial
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/blog">Todos</Link>
            </Button>
            {blogCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                asChild
              >
                <Link href={`/blog/categories/${category.slug}`}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              Destaques
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full bg-muted">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <Badge className="absolute top-2 left-2">
                        {post.category.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mb-4">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full gap-2">
                      <Link href={`/blog/${post.slug}`}>
                        Ler mais
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Todos os Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-0 shadow-md">
                <CardHeader className="p-0">
                  <div className="relative h-40 w-full bg-muted">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {post.category.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mb-3 text-sm">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} min
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="ghost" className="w-full gap-2 p-0 h-auto">
                    <Link href={`/blog/${post.slug}`}>
                      Ler mais
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-12">
          <Button variant="outline" disabled>Anterior</Button>
          <Button variant="outline">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Próximo</Button>
        </div>

        {/* Newsletter */}
        <section className="mt-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Receba novidades no seu e-mail</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Inscreva-se em nossa newsletter e receba dicas exclusivas, promoções e novidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1"
            />
            <Button>Inscrever-se</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
