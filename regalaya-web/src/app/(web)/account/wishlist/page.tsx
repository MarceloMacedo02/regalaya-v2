"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Share2, Grid, List } from "lucide-react"
import { products } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

// Mock wishlist items (using products from mock-data)
const wishlistItems = products.slice(0, 6).map((product, index) => ({
  ...product,
  addedAt: new Date(Date.now() - index * 86400000).toISOString(),
}))

export default function WishlistPage() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlist, setWishlist] = useState(wishlistItems)

  const handleRemove = (id: string) => {
    setWishlist(wishlist.filter(item => item.id !== id))
    toast({
      title: "Item removido",
      description: "O produto foi removido da sua lista de desejos.",
    })
  }

  const handleAddToCart = (product: typeof products[0]) => {
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    })
  }

  const handleShare = () => {
    toast({
      title: "Link copiado",
      description: "O link da sua wishlist foi copiado para a área de transferência.",
    })
  }

  const handleMoveAllToCart = () => {
    toast({
      title: "Todos os itens adicionados",
      description: `${wishlist.length} itens foram adicionados ao carrinho.`,
    })
  }

  if (wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lista de Desejos</h1>
          <p className="text-muted-foreground">
            Salve seus produtos favoritos para comprar depois
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">Sua lista está vazia</h3>
            <p className="text-muted-foreground mb-6">
              Adicione produtos à sua lista de desejos para encontrá-los facilmente depois.
            </p>
            <Button asChild>
              <Link href="/products">Ver produtos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lista de Desejos</h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? "item" : "itens"} salvo{wishlist.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" size="sm" onClick={handleMoveAllToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Mover todos
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9 rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-9 w-9 rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {!product.isActive && (
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      Esgotado
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {product.compareAtPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                    <span className="text-lg font-bold">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.isActive}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Adicionar
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemove(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 bg-muted rounded">
                    <Image
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Adicionado em {new Date(product.addedAt).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {product.compareAtPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {product.compareAtPrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                      <span className="font-bold">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isActive}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemove(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
