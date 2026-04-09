"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, MessageCircle, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useRecommendations } from "@/hooks/useRecommendations"
import { cn, formatPrice } from "@/lib/utils"
import type { ApiError } from "@/types/api"

export default function CartPage() {
  const {
    items, subtotal, couponCode, couponDiscount, giftMessage, senderName, recipientName, giftContext,
    updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, updateGiftMessage, updateGiftInfo, isLoading
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

  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearCart = async () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
      return
    }
    
    setClearing(true)
    try {
      await clearCart()
      setShowClearConfirm(false)
      toast({ title: "Carrinho limpo", description: "Todos os itens foram removidos." })
    } finally {
      setClearing(false)
    }
  }

  const { generateMessage, msgLoading } = useRecommendations()
  const [showGiftSection, setShowGiftSection] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const handleAiSuggest = async () => {
    try {
      const lastQuery = localStorage.getItem('regalaya_last_query') || "";
      const tones = ['emocional', 'divertida', 'inspiradora'];
      const results = await Promise.all(tones.map(tone => 
        generateMessage({
          ocasiao: 'Presente Especial',
          relacionamento: 'Pessoa Querida',
          produto: items.map(i => i.productName).join(", "),
          tom: tone,
          contexto: `De: ${senderName || 'N/A'}, Para: ${recipientName || 'N/A'}. Intenção: ${giftContext || ''}. Pedido Original: ${lastQuery}`
        })
      ));
      setAiSuggestions(results);
    } catch (err) {
      console.error('Erro ao sugerir mensagens:', err);
    }
  };

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
          {clearing ? "Limpando..." : showClearConfirm ? "Clique para confirmar" : "Limpar carrinho"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                  {item.productImage && item.productImage.split(",")[0] ? (
                    <Image
                      src={item.productImage.split(",")[0]}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
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
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2 h-auto py-1.5 px-2"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs font-medium">Remover</span>
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

          {/* Global Gift Message Section */}
          <div className="overflow-hidden rounded-lg border bg-zinc-50/50 shadow-sm mt-8">
            <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#be7374]" />
                <h3 className="font-semibold text-zinc-900">Dedicatória do Presente</h3>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setShowGiftSection(!showGiftSection)}
                className="text-[#be7374] hover:bg-[#be7374]/5"
              >
                {showGiftSection ? 'Fechar' : giftMessage ? 'Editar Dedicatória' : 'Adicionar Dedicatória'}
              </Button>
            </div>
            
            {(showGiftSection || giftMessage) && (
              <div className={cn("p-6 space-y-4", !showGiftSection && "hidden")}>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">De:</label>
                    <Input 
                      placeholder="Seu nome"
                      value={senderName || ''}
                      onChange={(e) => updateGiftInfo(giftMessage, e.target.value, recipientName, giftContext)}
                      className="bg-white border-zinc-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Para:</label>
                    <Input 
                      placeholder="Nome de quem recebe"
                      value={recipientName || ''}
                      onChange={(e) => updateGiftInfo(giftMessage, senderName, e.target.value, giftContext)}
                      className="bg-white border-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Intenção / Ideia do Presente:</label>
                  <textarea 
                    placeholder="Ex: É para minha esposa, ela é psicóloga e ama coisas finas..."
                    className="w-full text-sm p-3 border rounded-md focus:ring-1 focus:ring-[#be7374] outline-none bg-white min-h-[80px] resize-none border-zinc-200 shadow-sm"
                    value={giftContext || ''}
                    onChange={(e) => updateGiftInfo(giftMessage, senderName, recipientName, e.target.value)}
                  />
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded-t-lg border border-zinc-200 mt-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Sugerir com IA</p>
                    <p className="text-xs text-zinc-500">Crie uma mensagem emocionante usando sua ideia acima</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleAiSuggest}
                    disabled={msgLoading}
                    className="border-[#be7374] text-[#be7374] hover:bg-[#be7374]/5 gap-2"
                  >
                    {msgLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Gerar Mensagens
                  </Button>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {aiSuggestions.map((msg, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateGiftMessage(msg)}
                        className={cn(
                          "p-4 text-xs rounded-lg border bg-white text-left transition-all hover:shadow-md",
                          giftMessage === msg ? 'border-[#be7374] bg-[#be7374]/5' : 'border-zinc-200'
                        )}
                      >
                        <span className="block font-bold mb-2 text-[#be7374] uppercase tracking-wider text-[10px]">
                          {idx === 0 ? '❤️ Emocional' : idx === 1 ? '😂 Divertida' : '✨ Inspiradora'}
                        </span>
                        <p className="leading-relaxed italic text-zinc-600 line-clamp-4">"{msg}"</p>
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  className="w-full text-sm p-4 border rounded-b-lg focus:ring-1 focus:ring-[#be7374] focus:border-[#be7374] outline-none min-h-[120px] bg-white resize-none shadow-sm"
                  placeholder="Escreva sua mensagem especial aqui ou use as sugestões da IA acima..."
                  value={giftMessage || ''}
                  onChange={(e) => updateGiftMessage(e.target.value)}
                />
                
                <div className="flex gap-3 items-center bg-[#be7374]/5 p-4 rounded-lg border border-[#be7374]/10">
                  <Sparkles className="h-5 w-5 text-[#be7374]" />
                  <p className="text-xs text-[#be7374] leading-normal font-medium">
                    Esta mensagem personalizada será enviada diretamente via <strong>WhatsApp</strong> para o presenteado no momento da entrega.
                  </p>
                </div>
              </div>
            )}

            {!showGiftSection && giftMessage && (
              <div className="p-6 bg-white border-t border-zinc-100">
                <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100 italic text-zinc-600 relative">
                   <span className="absolute -top-2 left-4 px-2 bg-zinc-50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sua Mensagem</span>
                   "{giftMessage}"
                </div>
              </div>
            )}
          </div>
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
