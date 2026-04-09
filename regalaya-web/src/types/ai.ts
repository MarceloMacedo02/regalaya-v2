// AI and Chat Types

export type MessageTone = "formal" | "informal" | "romantic" | "funny" | "professional"

export interface AIRecommendationFeedback {
  recommendationId: string
  liked: boolean
  comment?: string
}

export interface GeneratedMessage {
  id: string
  content: string
  tone: MessageTone
  createdAt: string
  productId?: string
}

export interface MessageTemplate {
  id: string
  name: string
  content: string
  tone: MessageTone
}

// Chat Types
export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  suggestions?: string[]
  products?: ProductRecommendation[]
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ChatInput {
  message: string
  voiceInput?: boolean
  conversationId?: string
}

// IA Recommendation Types
export interface AIRecommendationRequest {
  recipientName?: string
  occasion: string
  ageRange: string
  interests: string[]
  budget?: number
}

export interface AIRecommendationResponse {
  recommendations: ProductRecommendation[]
  generatedMessage?: string
}

export interface ProductRecommendation {
  productId: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    slug: string
  }
  reason: string
  matchScore: number
}

// Feedback Types
export interface RecommendationFeedback {
  productId: string
  liked: boolean
  comment?: string
  timestamp: string
}
