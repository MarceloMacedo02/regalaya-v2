"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import type { ApiError } from "@/types/api"

export default function CartPage() {
  const {
    items, subtotal, couponCode, couponDiscount,
    updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, isLoading
  } = useCart()

  const [couponInput, setCouponInput] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [clearing, setClearing] = useState(false)

  const total = subtotal - couponDiscount

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError("")
    try {
      await applyCoupon(couponInput.trim().toUpperCase())
      setCouponInput("")
      toast({ title: "Cupom aplicado!", description: "Desconto adicionado ao carrinho." })
    } catch (err) {
      const apiErr = err as ApiError
      setCouponError(apiErr?.message || "Cupom inválido")
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon()
    } catch {}
  }

  const handleClearCart = async () => {
    if (!confirm("Tem certeza que deseja limpar o carrinho?")) return
    setClearing(true)
    try {
      await clearCart()
    } finally {
      setClearing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <ShoppingBag className="h-12 w-12 text-zinc-400 animate-pulse" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Carregando carrinho...
          </h1>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <ShoppingBag className="h-12 w-12 text-zinc-400" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Seu carrinho está vazio
          </h1>
          <p className="mb-8 text-muted-foreground">
            Parece que você ainda não adicionou nenhum presente ao carrinho.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Ver Presentes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Meu Carrinho
        </h1>
        <Button
          variant="ghost"
          onClick={handleClearCart}
          disabled={clearing}
          className="text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {clearing ? "Limpando..." : "Limpar carrinho"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  {item.productImage ? (
                    <Image
                      src={item.productImage.split(",")[0]}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-zinc-300" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50 line-clamp-2">
                      {item.productName}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.unitPrice)} cada
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#be7374]">
                        {formatPrice(item.subtotal)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" asChild>
            <Link href="/products" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Continuar Comprando
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-zinc-50 px-6 py-4">
              <h3 className="font-semibold text-zinc-900">Resumo do Pedido</h3>
            </div>
            <div className="p-6 space-y-4">
              {couponCode ? (
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{couponCode}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 h-auto p-1"
                    onClick={handleRemoveCoupon}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código do cupom"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponInput.trim() || couponLoading}
                    >
                      {couponLoading ? "..." : "Aplicar"}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-red-500">{couponError}</p>
                  )}
                </div>
              )}

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} itens)
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-xs text-muted-foreground">Calculado no checkout</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span className="font-medium">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#be7374]">{formatPrice(total)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
