"use client"

import { useState, useRef, useEffect, useCallback, Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useRecommendations } from "@/hooks/useRecommendations"
import { useCart } from "@/hooks/useCart"
import type { ChatMessage, ChatConversation, ProductRecommendation } from "@/types/ai"
import { formatPrice } from "@/lib/utils"
import { 
  MessageCircle, Send, Mic, MicOff, Loader2, Sparkles,
  User, Bot, X, History, ShoppingBag, Gift, PartyPopper, TrendingUp
} from "lucide-react"
import { http } from "@/lib/api"

// ─── Helpers para busca de produtos no chat ──────────────────────────────────

const STOP_WORDS = new Set([
  'de','da','do','das','dos','para','com','sem','por','uma','um','que','em',
  'no','na','quero','busco','preciso','gostaria','presente','presentes','ideia',
  'ideias','seu','sua','meu','minha','bom','boa','tipo','algo','como','mais',
  'ver','isso','essa','este','esta','tenho','procuro','vai','legal'
])

/** Extrai a keyword mais relevante da mensagem do usuário */
function extractSearchQuery(message: string): string {
  const words = message.toLowerCase()
    .replace(/[^a-záàâãéèêíìîóòôõúùûç0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w))
  
  // Retorna as 2 primeiras palavras relevantes para melhor busca
  return words.slice(0, 2).join(' ') || message.slice(0, 20)
}

/** Busca produtos no banco via search — stock > 0, sem IA, funciona agora */
async function fetchProductsBySearch(query: string): Promise<ProductRecommendation[]> {
  if (!query.trim()) return []
  try {
    // Tenta endpoint de tags primeiro (disponível após reinício do backend)
    // Fallback para search geral que funciona sempre
    const endpoints = [
      `/ai/products-by-tag?q=${encodeURIComponent(query)}&size=6`,
      `/products?search=${encodeURIComponent(query)}&size=6`
    ]

    for (const url of endpoints) {
      try {
        const res = await http.get<any>(url)
        const data = res.data
        // /products retorna { content: [...] }, /ai/products-by-tag retorna [...]
        const items: any[] = Array.isArray(data) ? data : (data?.content ?? [])
        if (items.length === 0) continue

        return items
          .filter(p => (p.stock ?? 1) >= 1)
          .slice(0, 6)
          .map(p => ({
            productId: p.id,
            reason: p.shortDescription || `Em estoque: ${p.name}`,
            matchScore: 90,
            product: {
              id: p.id,
              name: p.name,
              price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price || '0')),
              images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
              slug: p.slug || '',
            }
          }))
      } catch {
        // tenta próximo endpoint
      }
    }
    return []
  } catch (e) {
    console.error('Falha ao buscar produtos:', e)
    return []
  }
}

// Quick suggestion buttons
const QUICK_SUGGESTIONS = [
  { id: "gift-ideas", label: "Ideias de presente", icon: Gift },
  { id: "birthday", label: "Aniversário", icon: PartyPopper },
  { id: "wedding", label: "Casamento", icon: Sparkles },
  { id: "corporate", label: "Presente corporativo", icon: BriefcaseIcon },
  { id: "trending", label: "Mais vendidos", icon: TrendingUp },
  { id: "under-100", label: "até R$100", icon: ShoppingBag },
]

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

function ChatProductCard({ rec }: { rec: ProductRecommendation }) {
  const { addItem } = useCart()
  const firstImage = rec.product.images?.[0] || ""
  const price = typeof rec.product.price === 'number' ? rec.product.price : 0

  return (
    <div className="flex-shrink-0 w-44 rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative h-32 w-full bg-zinc-100 overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={rec.product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gift className="h-10 w-10 text-zinc-300" />
          </div>
        )}
        {rec.matchScore && (
          <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
            {rec.matchScore}% match
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-1.5">
        <Link href={`/products/${rec.product.slug}`}>
          <p className="text-xs font-semibold text-zinc-800 line-clamp-2 leading-snug hover:text-amber-600 transition-colors">
            {rec.product.name}
          </p>
        </Link>
        <p className="text-sm font-bold text-[#be7374]">{formatPrice(price)}</p>
        {rec.reason && (
          <p className="text-[9px] text-zinc-400 italic line-clamp-2 leading-relaxed">
            "{rec.reason}"
          </p>
        )}
        <button
          onClick={() => addItem({ productId: rec.product.id, name: rec.product.name, price, quantity: 1, image: firstImage })}
          className="w-full text-[10px] font-bold py-1.5 rounded-lg bg-[#be7374] text-white hover:bg-[#a85f60] active:scale-95 transition-all flex items-center justify-center gap-1 mt-1"
        >
          <ShoppingBag className="h-2.5 w-2.5" />
          Adicionar
        </button>
      </div>
    </div>
  )
}

interface AIChatProps {
  initialConversation?: ChatConversation
  onNewConversation?: () => void
  className?: string
}

export function AIChat({ 
  initialConversation,
  onNewConversation,
  className 
}: AIChatProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([
    initialConversation || {
      id: "1",
      title: "Nova conversa",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Olá! 👋 Sou o assistente de presentes da Regalaya. Como posso ajudar você hoje? Posso sugerir presentes perfeitos para qualquer ocasião!",
          timestamp: new Date().toISOString(),
          suggestions: ["Ideias para aniversário", "Presente para namorada", "Presente corporativo"]
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ])
  const [activeConversationId, setActiveConversationId] = useState<string>(
    initialConversation?.id || "1"
  )
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [input])

  const getActiveMessages = () => {
    return activeConversation?.messages || []
  }

  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? { 
            ...conv, 
            messages: [...conv.messages, newMessage],
            updatedAt: new Date().toISOString()
          }
        : conv
    ))

    return newMessage
  }, [activeConversationId])

  const { chat } = useRecommendations()

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    addMessage({
      role: "user",
      content: userMessage,
    })

    const allMessages: { role: 'user' | 'assistant'; content: string }[] = getActiveMessages()
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    if (!allMessages.find(m => m.content === userMessage && m.role === 'user')) {
      allMessages.push({ role: 'user', content: userMessage })
    }

    setIsTyping(true)
    
    try {
      // Busca em paralelo: resposta da IA + produtos no banco (direta, sempre funciona)
      const searchQuery = extractSearchQuery(userMessage)
      const [chatResponse, productsResponse] = await Promise.allSettled([
        chat(allMessages),
        fetchProductsBySearch(searchQuery)
      ])

      const aiReply = chatResponse.status === 'fulfilled'
        ? chatResponse.value
        : { message: 'Desculpe, ocorreu um erro. Tente novamente.', suggestions: [] }

      const products = productsResponse.status === 'fulfilled' ? productsResponse.value : []
      
      addMessage({
        role: "assistant",
        content: aiReply.message,
        suggestions: aiReply.suggestions,
        products: products.length > 0 ? products : undefined,
      })
    } catch (err) {
      console.error('Chat error:', err)
      addMessage({
        role: "assistant",
        content: "Desculpe, ocorreu um erro. Tente novamente.",
      })
    } finally {
      setIsTyping(false)
    }
  }, [input, addMessage, chat, getActiveMessages])


  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion)
    // Auto-send after a small delay
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }, [handleSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would use Web Speech API
  }

  const startNewConversation = () => {
    const newConv: ChatConversation = {
      id: Date.now().toString(),
      title: "Nova conversa",
      messages: [
        {
          id: "welcome-" + Date.now(),
          role: "assistant",
          content: "Olá! 👋 Sou o assistente de presentes da Regalaya. Como posso ajudar você hoje?",
          timestamp: new Date().toISOString(),
          suggestions: QUICK_SUGGESTIONS.slice(0, 3).map(s => s.label)
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(newConv.id)
    onNewConversation?.()
  }

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      {/* Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base">Assistente de Presentes</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {isTyping ? (
                    <>
                      <span className="mr-1 flex h-2 w-2">
                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      </span>
                      Digitando...
                    </>
                  ) : (
                    <>Online</>
                  )}
                </Badge>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Sidebar - Conversation History */}
      {showHistory && (
        <div className="border-b p-3 space-y-2 max-h-48 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground">Conversas anteriores</p>
          {conversations.map(conv => (
            <Button
              key={conv.id}
              variant={conv.id === activeConversationId ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => setActiveConversationId(conv.id)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span className="truncate">{conv.title}</span>
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={startNewConversation}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Nova conversa
          </Button>
        </div>
      )}

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {getActiveMessages().map((message) => (
          <Fragment key={message.id}>
            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                message.role === "user"
                  ? "bg-amber-500 text-white rounded-br-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 rounded-bl-sm"
              }`}>
                <div className="flex items-start gap-2">
                  {message.role === "assistant" && <Bot className="h-5 w-5 mt-1 text-amber-600 flex-shrink-0" />}
                  {message.role === "user" && <User className="h-5 w-5 mt-1 text-white flex-shrink-0" />}
                  <div className={`text-sm leading-relaxed ${message.role === "user" ? "text-white" : "text-zinc-800"} [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_p]:my-1`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 ml-7">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Cards — every assistant message that has products (always, to drive sales) */}
            {message.role === "assistant" && message.products && message.products.length > 0 && (
              <div className="ml-8 mt-1">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Presentes em estoque • escolha e adicione ao carrinho
                </p>
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                  {message.products.map((rec) => (
                    <ChatProductCard key={rec.productId} rec={rec} />
                  ))}
                </div>
              </div>
            )}
          </Fragment>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Quick Suggestions */}
      {getActiveMessages().length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_SUGGESTIONS.slice(0, 4).map(suggestion => (
              <Button
                key={suggestion.id}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSuggestionClick(suggestion.label)}
              >
                <suggestion.icon className="mr-1 h-3 w-3" />
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[44px] max-h-[150px] resize-none"
            disabled={isTyping}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "text-red-500" : ""}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </div>
    </Card>
  )
}
