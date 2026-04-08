"use client"

import Link from "next/link"
import { useWishlist } from "@/hooks/useWishlist"
import { ProductCard } from "@/components/web/product-card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ShoppingCart, Trash2, Sparkles } from "lucide-react"
import { useState } from "react"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, moveToCart, toggleWishlist } = useWishlist()
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async () => {
    const wishlistUrls = wishlist.map(p => `${window.location.origin}/products/${p.slug}`).join('\n')
    const shareText = ` Minha lista de desejos da Regalaya:\n${wishlistUrls}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha Lista de Desejos - Regalaya",
          text: shareText,
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const handleMoveToCart = (productId: string) => {
    moveToCart(productId)
    // TODO: Show toast notification
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Heart className="h-12 w-12 text-zinc-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Sua lista de desejos está vazia
          </h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Adicione produtos que você ama à sua lista de desejos para não esquecê-los.
          </p>
          <Link href="/products">
            <Button size="lg">
              Ver produtos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              Lista de Desejos
            </h1>
            <p className="mt-2 text-muted-foreground">
              {wishlist.length} {wishlist.length === 1 ? "produto salvo" : "produtos salvos"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              {isCopied ? "Copiado!" : "Compartilhar"}
            </Button>
            <Button variant="outline" onClick={clearWishlist}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar tudo
            </Button>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="mb-8 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 dark:border-amber-800 dark:from-amber-950/30 dark:to-yellow-950/30">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
            <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Precisa de ajuda para escolher?
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Nossa IA pode ajudá-lo a encontrar o presente perfeito baseado na sua lista de desejos.
            </p>
          </div>
          <Link href="/recommendations">
            <Button>
              Ver Recomendações
            </Button>
          </Link>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((product) => (
          <div key={product.id} className="relative group">
             <ProductCard 
               product={product} 
               showFavoriteButton={true}
             />
            {/* Move to Cart Button */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                className="shadow-lg"
                onClick={() => handleMoveToCart(product.id)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State after actions */}
      {wishlist.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            Todos os produtos foram movidos para o carrinho ou removidos.
          </p>
          <Link href="/products" className="mt-4">
            <Button variant="outline">Continuar Comprando</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
