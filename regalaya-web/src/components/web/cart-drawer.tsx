"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag, Trash2, MessageCircle, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { useRecommendations } from "@/hooks/useRecommendations"
import { formatPrice, cn } from "@/lib/utils"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, updateQuantity, removeItem, updateGiftMessage, updateGiftInfo, giftMessage, senderName, recipientName, giftContext } = useCart()
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
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className="rounded-lg border p-3">
                      <div className="flex gap-4">
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
                              <ShoppingBag className="h-8 w-8 text-zinc-300" />
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
                    </div>
                  ))}
                </div>

                {/* Global Gift Message Section */}
                <div className="mt-6 rounded-lg bg-zinc-50 border border-zinc-100 p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowGiftSection(!showGiftSection)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#be7374]/10 text-[#be7374]">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">Dedicatória do Presente</p>
                        <p className="text-[10px] text-zinc-500">Uma mensagem para toda a sua entrega</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#be7374] h-auto p-0 hover:bg-transparent">
                      {showGiftSection ? 'Fechar' : giftMessage ? 'Editar' : 'Adicionar'}
                    </Button>
                  </div>
                  
                  {(showGiftSection || giftMessage) && (
                    <div className={cn("mt-4 space-y-3", !showGiftSection && "hidden")}>
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">De:</label>
                          <input 
                            type="text"
                            placeholder="Seu nome"
                            className="w-full text-xs p-2 border rounded-md focus:ring-1 focus:ring-[#be7374] outline-none"
                            value={senderName || ''}
                            onChange={(e) => updateGiftInfo(giftMessage, e.target.value, recipientName, giftContext)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Para:</label>
                          <input 
                            type="text"
                            placeholder="Nome dela/dele"
                            className="w-full text-xs p-2 border rounded-md focus:ring-1 focus:ring-[#be7374] outline-none"
                            value={recipientName || ''}
                            onChange={(e) => updateGiftInfo(giftMessage, senderName, e.target.value, giftContext)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Intenção / Ideia do Presente:</label>
                        <textarea 
                          placeholder="Ex: É para minha esposa, ela é psicóloga e ama coisas finas..."
                          className="w-full text-xs p-2 border rounded-md focus:ring-1 focus:ring-[#be7374] outline-none bg-white min-h-[60px] resize-none"
                          value={giftContext || ''}
                          onChange={(e) => updateGiftInfo(giftMessage, senderName, recipientName, e.target.value)}
                        />
                      </div>

                      <div className="flex justify-between items-center bg-white p-2 rounded-t-md border-b border-zinc-100 mt-2">
                        <span className="text-[10px] text-zinc-500 font-medium">Sugerir com IA:</span>
                        <button 
                          onClick={handleAiSuggest}
                          disabled={msgLoading}
                          className="text-[10px] text-[#be7374] font-bold flex items-center gap-1 hover:underline px-2 py-1 bg-[#be7374]/5 rounded transition-colors"
                        >
                          {msgLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          Gerar Mensagens
                        </button>
                      </div>

                      {aiSuggestions.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
                          {aiSuggestions.map((msg, idx) => (
                            <button
                              key={idx}
                              onClick={() => updateGiftMessage(msg)}
                              className={cn(
                                "flex-shrink-0 w-36 p-3 text-[10px] rounded-lg border bg-white text-left transition-all shadow-sm",
                                giftMessage === msg ? 'border-[#be7374] ring-1 ring-[#be7374]/20' : 'hover:border-zinc-300'
                              )}
                            >
                              <span className="block font-bold mb-1 text-[#be7374] uppercase tracking-wider text-[8px]">
                                {idx === 0 ? 'Emocional' : idx === 1 ? 'Divertida' : 'Inspiradora'}
                              </span>
                              <span className="line-clamp-4 leading-relaxed italic text-zinc-600">"{msg}"</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <textarea
                        className="w-full text-sm p-3 border rounded-b-md focus:ring-1 focus:ring-[#be7374] outline-none min-h-[100px] bg-white resize-none shadow-inner"
                        placeholder="Deixe uma mensagem especial para quem vai receber o presente..."
                        value={giftMessage || ''}
                        onChange={(e) => updateGiftMessage(e.target.value)}
                      />
                      
                      <div className="flex gap-2 items-start bg-amber-50 p-3 rounded-lg border border-amber-100/50">
                        <div className="mt-0.5">
                           <Sparkles className="h-3 w-3 text-amber-500" />
                        </div>
                        <p className="text-[10px] text-amber-800 leading-normal">
                          <strong>Dica Regalaya:</strong> Esta mensagem será enviada por <strong>WhatsApp</strong> para Paula assim que o presente for entregue.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!showGiftSection && giftMessage && (
                    <div className="mt-3 p-3 bg-white rounded-md border border-zinc-100 shadow-sm italic text-xs text-zinc-600 line-clamp-2">
                       "{giftMessage}"
                    </div>
                  )}
                </div>
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
