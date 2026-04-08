"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Meu Carrinho ({itemCount})
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                <Button onClick={onClose} asChild>
                  <Link href="/products">Ver produtos</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 rounded-lg border p-3">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      {item.productImage ? (
                        <Image
                          src={item.productImage.split(",")[0].replace(/[\[\]"]/g, "")}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-medium text-sm line-clamp-2">{item.productName}</p>
                        <p className="mt-1 text-sm font-semibold text-[#be7374]">
                          {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="rounded-full p-1 text-gray-400 hover:text-red-500"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t px-6 py-4">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild onClick={onClose}>
                  <Link href="/cart">Finalizar Compra</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild onClick={onClose}>
                  <Link href="/products">Continuar Comprando</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
