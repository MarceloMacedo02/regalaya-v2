"use client"

import { useState, useRef, useEffect, useCallback, Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff,
  Loader2,
  Sparkles,
  User,
  Bot,
  X,
  History,
  Lightbulb,
  ShoppingBag,
  Gift,
  PartyPopper,
  TrendingUp,
  ExternalLink
} from "lucide-react"
import type { ChatMessage, ChatConversation, ProductRecommendation } from "@/types/ai"
import { ProductCard } from "./product-card"

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

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    // Add user message
    addMessage({
      role: "user",
      content: userMessage,
    })

    // Simulate AI typing
    setIsTyping(true)
    
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    setIsTyping(false)

    // Generate response based on user input
    const responses = generateAIResponse(userMessage)
    
    addMessage({
      role: "assistant",
      content: responses.message,
      suggestions: responses.suggestions,
      products: responses.products,
    })
  }, [input, addMessage])

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes("aniversário") || lowerInput.includes("birthday")) {
      return {
        message: "Para aniversário, temos várias opções incríveis! 🎂\n\n🎁 **Algumas ideias populares:**\n- Chocolates artesanais\n- Flores personalizadas\n- Kits de spa\n- Joias delicadas\n- Experiências como jantar romântico\n\nQual dessas categorias te interessou mais? Posso sugerir produtos específicos!",
        suggestions: ["Chocolates", "Flores", "Kits spa", "Joias"]
      }
    }
    
    if (lowerInput.includes("namorad") || lowerInput.includes("romântico") || lowerInput.includes("amor")) {
      return {
        message: "Que lindo! Presentear quem amamos é especial. 💕\n\n❤️ **Mais populares para Dia dos Namorados:**\n- Perfumes importados\n- Joias (colares, anéis, pulseiras)\n- Rosas preservadas\n- Experiências (jantar, final de semana)\n- Caixas de chocolates gourmet\n\nQual é o estilo do seu parceiro(a)?",
        suggestions: ["Perfumes", "Joias", "Rosas", "Experiências"]
      }
    }
    
    if (lowerInput.includes("corporativo") || lowerInput.includes("trabalho") || lowerInput.includes("colega")) {
      return {
        message: "Para presentes corporativos, temos opções elegantes! 👔\n\n💼 **Ideias profissionais:**\n- Canetas de luxo\n- Acessórios para escritório\n- Wines ou whiskys premium\n- Quadros decorativos\n- Kits de café gourmet\n\nQual é o contexto - segredo, amigo oculto, ou presente de empresa?",
        suggestions: ["Canetas", "Acessórios", "Wines", "Kits café"]
      }
    }
    
    if (lowerInput.includes("mãe") || lowerInput.includes("pai") || lowerInput.includes("familia")) {
      return {
        message: "Presentear a família é sempre especial! 👨‍👩‍👧‍👦\n\n🏠 **Opções para familiares:**\n- Decoração para casa\n- Eletrodomésticos úteis\n- Roupas e acessórios\n- Livros ou cursos\n- Experiências em família\n\nPara quem é o presente? Posso ser mais específico!",
        suggestions: ["Decoração", "Eletrodomésticos", "Roupas", "Experiências"]
      }
    }

    // Mock products for demonstration
    const mockProducts: ProductRecommendation[] = [
      {
        productId: "p1",
        reason: "Perfeito para a ocasião citada",
        matchScore: 98,
        product: {
          id: "p1",
          name: "Kit Spa Relaxante Premium",
          price: 189.90,
          images: ["/images/products/kit-spa.jpg"],
          slug: "kit-spa-relaxante-premium",
          category: { name: "Bem-estar" }
        } as any
      },
      {
        productId: "p2",
        reason: "Um dos nossos itens mais vendidos",
        matchScore: 95,
        product: {
          id: "p2",
          name: "Vinho Tinto Reserva Especial",
          price: 145.00,
          images: ["/images/products/vinho.jpg"],
          slug: "vinho-tinto-reserva",
          category: { name: "Bebidas" }
        } as any
      }
    ]

    // Default response
    return {
      message: "Entendi! Adoro ajudar a encontrar o presente perfeito. 🎁\n\nPara eu poder sugerir as melhores opções, me conta:\n1. **Para quem** é o presente?\n2. **Qual a ocasião**?\n3. **Qual o orçamento**?\n\nCom essas informações, posso fazer recomendações personalizadas!",
      suggestions: QUICK_SUGGESTIONS.slice(0, 3).map(s => s.label),
      products: lowerInput.length > 5 ? mockProducts : undefined
    }
  }

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
            <div
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "user"
                  ? "bg-amber-500 text-white rounded-br-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 rounded-bl-sm"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === "assistant" && (
                  <Bot className="h-5 w-5 mt-0.5 text-amber-600 flex-shrink-0" />
                )}
                {message.role === "user" && (
                  <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        message.role === "user"
                          ? "bg-white/20 text-white hover:bg-white/30"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Recommendations in Chat */}
          {message.role === "assistant" && message.products && message.products.length > 0 && (
            <div className="flex justify-start pl-10 -mt-2 mb-4">
              <div className="flex gap-4 overflow-x-auto pb-2 max-w-full scrollbar-hide">
                {message.products.map((rec) => (
                  <div key={rec.productId} className="min-w-[200px] max-w-[220px]">
                    <ProductCard 
                      product={{
                        ...rec.product,
                        stock: 10,
                        isActive: true
                      } as any} 
                      showFavoriteButton={false}
                      showImageCount={false}
                      className="scale-90 origin-top-left"
                    />
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg mt-[-20px] relative z-10 border border-amber-100 dark:border-amber-900/30">
                      <p className="text-[10px] text-amber-800 dark:text-amber-300 line-clamp-2 italic">
                        "{rec.reason}"
                      </p>
                    </div>
                  </div>
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
