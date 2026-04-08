import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SITE_URL } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { blogPosts, blogCategories } from "@/types/blog"
import {
  Calendar,
  Clock,
  ArrowRight,
  Rss,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogCategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = blogCategories.find(c => c.slug === categorySlug)

  if (!category) {
    return {
      title: "Categoria não encontrada | Regalaya",
    }
  }

  return {
    title: `${category.name} | Blog | Regalaya`,
    description: category.description || `Posts sobre ${category.name}`,
    openGraph: {
      title: `${category.name} | Blog | Regalaya`,
      description: category.description || `Posts sobre ${category.name}`,
      type: "website",
      locale: "pt_BR",
      siteName: "Regalaya",
      url: `${SITE_URL}/blog/categories/${category.slug}`,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/categories/${category.slug}`,
    },
  }
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category: categorySlug } = await params
  const category = blogCategories.find(c => c.slug === categorySlug)

  if (!category) {
    notFound()
  }

  const categoryPosts = blogPosts.filter(post => post.category.id === category.id)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${category.color} text-white mb-4`}>
            <Rss className="h-4 w-4" />
            {category.name}
          </div>
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground">
            {category.description || `Todos os posts sobre ${category.name.toLowerCase()}`}
          </p>
        </div>

        {/* Back Link */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/blog">
              ← Voltar ao Blog
            </Link>
          </Button>
        </div>

        {/* Posts Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {categoryPosts.length} {categoryPosts.length === 1 ? "post" : "posts"} encontrado{categoryPosts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Posts Grid */}
        {categoryPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryPosts.map((post) => (
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
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Rss className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Nenhum post encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Ainda não há posts nesta categoria.
            </p>
            <Button asChild>
              <Link href="/blog">Ver todos os posts</Link>
            </Button>
          </div>
        )}

        {/* All Categories */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Outras Categorias</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {blogCategories
              .filter(c => c.id !== category.id)
              .map((cat) => (
                <Button
                  key={cat.id}
                  variant="outline"
                  size="lg"
                  asChild
                  className="gap-2"
                >
                  <Link href={`/blog/categories/${cat.slug}`}>
                    {cat.name}
                  </Link>
                </Button>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}
