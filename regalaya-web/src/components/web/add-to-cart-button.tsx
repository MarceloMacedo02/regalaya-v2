"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/useCart"
import { Heart, Share2, ShoppingCart, CheckCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  stock: number
  images: string[]
  slug: string
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, items } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
      })

      toast({
        title: "Adicionado ao carrinho!",
        description: (
          <div className="mt-1">
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {quantity}x {formatPrice(product.price * quantity)}
            </p>
          </div>
        ),
        duration: 3000,
      })
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar ao carrinho. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const currentQuantity = items.find((item) => item.productId === product.id)?.quantity || 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="quantity">Quantidade</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={product.stock}
                  className="text-center w-20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              {currentQuantity > 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  Você tem {currentQuantity} no carrinho
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              size="lg" 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
            >
              {isAdding ? "Adicionando..." : `Adicionar ao Carrinho - ${formatPrice(product.price * quantity)}`}
            </Button>
            <Button size="lg" variant="outline" aria-label="Adicionar aos favoritos">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" aria-label="Compartilhar">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
