# Page Templates - Regalaya

## Template 1: Página Principal (Home)

```tsx
import { products, categories, banners } from "@/lib/mock-data"
import { HeroBanner } from "@/components/web/hero-banner"
import { PromoBanners } from "@/components/web/promo-banners"
import { FeaturedProductsGrid } from "@/components/web/featured-products-grid"
import { Sidebar } from "@/components/web/sidebar"
import { OccasionSection } from "@/components/web/occasion-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Presentes Inesquecíveis | Regalaya",
  description: "Encontre o presente perfeito para cada momento especial.",
}

export default function HomePage() {
  const featuredProducts = products.slice(0, 8)
  const activeBanners = banners.filter(b => b.isActive)

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      {/* Header é renderizado pelo layout */}
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
            <Sidebar categories={categories} />
          </aside>

          {/* Main Content */}
          <main className="flex-grow space-y-12">
            {/* Hero Banner */}
            <HeroBanner 
              title="Envie Seu Amor"
              subtitle="Novidades"
              priceFrom={29.90}
              ctaText="Enviar Presente"
              ctaHref="/products"
            />

            {/* Promo Banners */}
            <PromoBanners />

            {/* Featured Products */}
            <section>
              <div className="relative flex items-center justify-center my-16">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dotted border-gray-300"></div>
                </div>
                <h2 className="relative px-8 bg-white text-5xl font-['Sacramento',cursive] text-black">
                  Destaques
                </h2>
              </div>
              <FeaturedProductsGrid products={featuredProducts} />
            </section>

            {/* Occasions */}
            <OccasionSection />

            {/* CTA Section */}
            <section className="py-16">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-black">
                  Precisa de ajuda para escolher?
                </h2>
                <p className="mb-8 text-lg text-[#788090]">
                  Nossa IA pode ajudar você a encontrar o presente perfeito
                </p>
                <div className="flex justify-center gap-4">
                  <a 
                    href="/recommendations"
                    className="bg-[#be7374] text-white px-8 py-3 rounded-full text-sm font-bold uppercase hover:bg-[#a86263] transition-colors"
                  >
                    Ver Recomendações
                  </a>
                  <a 
                    href="/chat"
                    className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold uppercase border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Falar com Chat IA
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer é renderizado pelo layout */}
    </div>
  )
}
```

---

## Template 2: Página de Produtos (Shop/Category)

```tsx
'use client';

import { useState } from 'react';
import { products, categories } from "@/lib/mock-data";
import { Sidebar } from "@/components/web/sidebar";
import { FeaturedProductsGrid } from "@/components/web/featured-products-grid";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos | Regalaya",
  description: "Explore nossa coleção de presentes especiais.",
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    page?: string;
  };
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products by category if provided
  const filteredProducts = searchParams.category
    ? products.filter(p => p.category === searchParams.category)
    : products;

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (searchParams.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4 text-sm">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="text-[#788090] hover:text-[#be7374]">Home</a></li>
          <li className="text-gray-400">/</li>
          <li className="text-black font-medium">
            {searchParams.category ? categories.find(c => c.slug === searchParams.category)?.name : 'Todos os Produtos'}
          </li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - Filters */}
          <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
            <Sidebar categories={categories} />
            
            {/* Additional Filters */}
            <div className="mt-8 bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-sm font-bold text-black uppercase mb-4">Filtros</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-black uppercase mb-3">Preço</h4>
                <div className="space-y-2">
                  {['Até R$50', 'R$50 - R$100', 'R$100 - R$200', 'Acima de R$200'].map((range) => (
                    <label key={range} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-gray-200" />
                      <span>{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-black uppercase mb-3">Avaliação</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-gray-200" />
                      <span>{rating}+ estrelas</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <p className="text-sm text-[#788090]">
                  {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''}
                </p>
                
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select className="text-sm border border-gray-200 rounded-md px-3 py-2">
                  <option value="default">Ordenar por</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="name">Nome A-Z</option>
                </select>

                {/* View Mode */}
                <div className="hidden md:flex items-center gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <FeaturedProductsGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-[#788090] mb-4">
                  Nenhum produto encontrado
                </p>
                <a href="/products" className="text-[#be7374] hover:underline">
                  Ver todos os produtos
                </a>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

## Template 3: Página de Produto (Product Detail)

```tsx
'use client';

import { useState } from 'react';
import { products } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  ShieldCheck,
  RotateCcw,
  ChevronRight
} from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = products.find(p => p.slug === params.slug);
  
  return {
    title: `${product?.name} | Regalaya`,
    description: product?.description || 'Detalhes do produto',
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.slug === params.slug) || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4 text-sm">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="text-[#788090] hover:text-[#be7374]">Home</a></li>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <li><a href="/products" className="text-[#788090] hover:text-[#be7374]">Produtos</a></li>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <li className="text-black font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#f9f9f9] mb-4">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-[#be7374]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Title */}
            <p className="text-xs text-[#788090] uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-black mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center text-[#fcb900]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < product.rating ? "currentColor" : "none"}
                    className={i < product.rating ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-[#788090]">
                ({product.reviewCount} avaliações)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.oldPrice && (
                <p className="text-lg text-gray-400 line-through">
                  R$ {product.oldPrice.toFixed(2)}
                </p>
              )}
              <p className="text-4xl font-bold text-black">
                R$ {product.price.toFixed(2)}
              </p>
              {product.oldPrice && (
                <Badge className="bg-[#be7374] text-white mt-2">
                  {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-[#788090] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-6 py-3 text-black font-medium min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <Button className="flex-1 bg-[#be7374] hover:bg-[#a86263] text-white py-6 text-sm font-bold uppercase">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>

              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Truck, title: "Frete Grátis", desc: "Para compras acima de R$99" },
                { icon: ShieldCheck, title: "Compra Segura", desc: "Seus dados protegidos" },
                { icon: RotateCcw, title: "Troca Fácil", desc: "30 dias para trocar ou devolver" },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-[#788090]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black">{feature.title}</h4>
                    <p className="text-xs text-[#788090]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="border-t border-gray-100 pt-12">
          <div className="flex gap-8 mb-8 border-b border-gray-100">
            {['Descrição', 'Avaliações', 'Envio & Devolução'].map((tab, idx) => (
              <button
                key={tab}
                className={`pb-4 text-sm font-bold uppercase transition-colors ${
                  idx === 0
                    ? 'text-[#be7374] border-b-2 border-[#be7374]'
                    : 'text-[#788090] hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            <p className="text-[#788090] leading-relaxed">
              {product.fullDescription || product.description}
            </p>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <div className="relative flex items-center justify-center my-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dotted border-gray-300"></div>
            </div>
            <h2 className="relative px-8 bg-white text-5xl font-['Sacramento',cursive] text-black">
              Produtos Relacionados
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.slice(0, 4).map((product) => (
              <a key={product.id} href={`/products/${product.slug}`} className="group text-center">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f9f9f9] mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="bg-white p-2 rounded shadow-lg text-[#788090] hover:text-[#be7374]">
                      <ShoppingCart size={16} />
                    </div>
                    <div className="bg-white p-2 rounded shadow-lg text-[#788090] hover:text-[#be7374]">
                      <Heart size={16} />
                    </div>
                  </div>
                </div>
                <p className="text-[13px] font-bold text-black mb-1">
                  R$ {product.price.toFixed(2)}
                </p>
                <h4 className="text-[12px] font-bold text-black uppercase mb-2">
                  {product.name}
                </h4>
                <div className="flex justify-center text-[#fcb900] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill="currentColor" />
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## Template 4: Página de Conta (Account)

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";

interface AccountPageProps {
  children: React.ReactNode;
}

const menuItems = [
  { href: '/account', label: 'Perfil', icon: User },
  { href: '/account/orders', label: 'Meus Pedidos', icon: Package },
  { href: '/account/addresses', label: 'Endereços', icon: MapPin },
  { href: '/account/wishlist', label: 'Lista de Desejos', icon: Heart },
  { href: '/account/security', label: 'Segurança', icon: Settings },
];

export default function AccountLayout({ children }: AccountPageProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4 text-sm">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="text-[#788090] hover:text-[#be7374]">Home</a></li>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <li className="text-black font-medium">Minha Conta</li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Menu */}
          <aside className="lg:w-[280px] flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {/* User Info */}
              <div className="p-6 bg-[#fed2cc]/60">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-[#be7374]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black">Nome do Usuário</h3>
                    <p className="text-xs text-[#788090]">email@exemplo.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="divide-y divide-gray-100">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                        isActive
                          ? 'bg-[#fed2cc]/30 text-[#be7374]'
                          : 'text-[#788090] hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  );
                })}

                {/* Logout */}
                <button className="flex items-center gap-3 px-6 py-4 w-full text-[#788090] hover:bg-gray-50 hover:text-black transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Sair</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="bg-white border border-gray-100 rounded-xl p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

## Template 5: Página de Blog

```tsx
import { Button } from "@/components/ui/button";
import { Calendar, User as UserIcon, Clock, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  slug: string;
}

// Mock data
const posts: BlogPost[] = [
  {
    id: '1',
    title: '10 Ideias de Presentes Criativos para o Dia dos Namorados',
    excerpt: 'Descubra presentes únicos que vão conquistar seu amor.',
    content: 'Conteúdo completo do post...',
    author: 'Maria Silva',
    date: '2026-04-01',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e5392?q=80&w=800',
    category: 'Dicas de Presentes',
    slug: '10-ideias-presentes-dia-namorados',
  },
  // More posts...
];

export const metadata: Metadata = {
  title: "Blog | Regalaya",
  description: "Dicas e inspirações para presentes perfeitos.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4 text-sm">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="text-[#788090] hover:text-[#be7374]">Home</a></li>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <li className="text-black font-medium">Blog</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-[#f9f6f0] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-['Sacramento',cursive] text-black mb-4">
            Nosso Blog
          </h1>
          <p className="text-lg text-[#788090] max-w-2xl mx-auto">
            Dicas, inspirações e novidades para te ajudar a encontrar o presente perfeito
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <main className="flex-grow">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  {/* Image */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  {/* Category */}
                  <p className="text-xs text-[#be7374] uppercase tracking-wider mb-2">
                    {post.category}
                  </p>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-black mb-3 group-hover:text-[#be7374] transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-[#788090] mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Read More */}
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-sm font-bold text-[#be7374] uppercase hover:underline"
                  >
                    Ler Mais →
                  </a>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Anterior</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">Próximo</Button>
              </nav>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[280px] flex-shrink-0 space-y-8">
            {/* Search */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-sm font-bold text-black uppercase mb-4">Buscar</h3>
              <input
                type="text"
                placeholder="Buscar no blog..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-[#be7374] focus:ring-2 focus:ring-[#be7374]/20 outline-none"
              />
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-sm font-bold text-black uppercase mb-4">Categorias</h3>
              <ul className="space-y-3">
                {['Dicas de Presentes', 'Datas Especiais', 'Tendências', 'DIY'].map((cat) => (
                  <li key={cat}>
                    <a href="#" className="text-sm text-[#788090] hover:text-[#be7374] transition-colors">
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-sm font-bold text-black uppercase mb-4">Posts Recentes</h3>
              <ul className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <li key={post.id}>
                    <a href={`/blog/${post.slug}`} className="text-sm font-medium text-black hover:text-[#be7374] transition-colors">
                      {post.title}
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
```

---

## Template 6: Página de Contato

```tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Regalaya",
  description: "Entre em contato conosco.",
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#788090] antialiased">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4 text-sm">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="text-[#788090] hover:text-[#be7374]">Home</a></li>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <li className="text-black font-medium">Contato</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-[#f9f6f0] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-['Sacramento',cursive] text-black mb-4">
            Fale Conosco
          </h1>
          <p className="text-lg text-[#788090] max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato por qualquer um dos canais abaixo.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          {[
            {
              icon: Mail,
              title: "Email",
              info: "contato@regalaya.com",
              subInfo: "Respondemos em até 24h",
            },
            {
              icon: Phone,
              title: "Telefone",
              info: "(11) 99999-9999",
              subInfo: "Seg-Sex, 9h-18h",
            },
            {
              icon: MapPin,
              title: "Endereço",
              info: "Av. Paulista, 1000",
              subInfo: "São Paulo - SP",
            },
          ].map((card) => (
            <div key={card.title} className="bg-white border border-gray-100 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-[#fed2cc]/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <card.icon className="h-6 w-6 text-[#be7374]" />
              </div>
              <h3 className="text-sm font-bold text-black uppercase mb-2">{card.title}</h3>
              <p className="text-base font-bold text-black mb-1">{card.info}</p>
              <p className="text-xs text-[#788090]">{card.subInfo}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Contact Form */}
          <main className="flex-grow">
            <div className="bg-white border border-gray-100 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-black mb-8">Envie uma Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#be7374] focus:ring-2 focus:ring-[#be7374]/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#be7374] focus:ring-2 focus:ring-[#be7374]/20 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#be7374] focus:ring-2 focus:ring-[#be7374]/20 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#be7374] focus:ring-2 focus:ring-[#be7374]/20 outline-none resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-[#be7374] hover:bg-[#a86263] text-white px-8 py-6 text-sm font-bold uppercase"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[280px] flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-sm font-bold text-black uppercase mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Atendimento
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span>Segunda - Sexta</span>
                  <span className="font-medium text-black">9h - 18h</span>
                </li>
                <li className="flex justify-between">
                  <span>Sábado</span>
                  <span className="font-medium text-black">9h - 13h</span>
                </li>
                <li className="flex justify-between">
                  <span>Domingo</span>
                  <span className="font-medium text-[#be7374]">Fechado</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
```

---

**Última atualização**: 2026-04-03
**Versão**: 1.0.0
