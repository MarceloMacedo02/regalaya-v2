import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SITE_URL } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { blogPosts, blogCategories } from "@/types/blog"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/shared/json-ld"
import {
  Calendar,
  Clock,
  Share2,
  Bookmark,
  ArrowLeft,
  Link as LinkIcon,
  Copy,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return {
      title: "Post não encontrado | Regalaya",
    }
  }

  return {
    title: `${post.title} | Regalaya`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: "pt_BR",
      siteName: "Regalaya",
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [
        {
          url: `${SITE_URL}${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${SITE_URL}${post.coverImage}`],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category.id === post.category.id)
    .slice(0, 3)

  const shareUrl = `${SITE_URL}/blog/${post.slug}`

  return (
    <article className="min-h-screen">
      {/* JSON-LD */}
      <ArticleJsonLd
        headline={post.title}
        description={post.excerpt}
        image={[`${SITE_URL}${post.coverImage}`]}
        authorName={post.author.name}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.category.name, url: `/blog/categories/${post.category.slug}` },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      {/* Hero */}
      <div className="relative h-[400px] w-full bg-muted">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Badge className="mb-4">{post.category.name}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
              {post.title}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-4">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min de leitura
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Link */}
            <Button variant="ghost" asChild className="mb-6 gap-2">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Blog
              </Link>
            </Button>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Compartilhe este post
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Compartilhar no Facebook"
                  onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Compartilhar no Twitter"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Compartilhar no LinkedIn"
                  onClick={() => window.open(`https://linkedin.com/shareArticle?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Copiar link"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Author Bio */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{post.author.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {post.author.bio}
                    </p>
                    <div className="flex gap-2">
                      {post.author.socialLinks?.instagram && (
                        <Button variant="ghost" size="sm">
                          Instagram
                        </Button>
                      )}
                      {post.author.socialLinks?.twitter && (
                        <Button variant="ghost" size="sm">
                          Twitter
                        </Button>
                      )}
                      {post.author.socialLinks?.linkedin && (
                        <Button variant="ghost" size="sm">
                          LinkedIn
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Table of Contents */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Neste artigo
                </h3>
                <nav className="space-y-2 text-sm">
                  <a href="#" className="block text-muted-foreground hover:text-foreground">
                    Introdução
                  </a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground">
                    Dicas principais
                  </a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground">
                    Conclusão
                  </a>
                </nav>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Posts Relacionados</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <div className="relative h-16 w-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                            <Image
                              src={relatedPost.coverImage}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedPost.readTime} min
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Categorias</h3>
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs"
                    >
                      <Link href={`/blog/categories/${category.slug}`}>
                        {category.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </article>
  )
}
