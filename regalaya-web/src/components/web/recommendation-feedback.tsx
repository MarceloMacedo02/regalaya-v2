"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles
} from "lucide-react"
import type { ProductRecommendation, RecommendationFeedback } from "@/types/ai"

interface RecommendationFeedbackProps {
  recommendations: ProductRecommendation[]
  onFeedbackSubmit?: (feedback: RecommendationFeedback[]) => void
  onRefreshRecommendations?: () => void
  isRefreshing?: boolean
}

export function RecommendationFeedback({
  recommendations,
  onFeedbackSubmit,
  onRefreshRecommendations,
  isRefreshing = false,
}: RecommendationFeedbackProps) {
  const [feedbackState, setFeedbackState] = useState<Record<string, {
    liked: boolean | null
    comment: string
    submitted: boolean
  }>>({})

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const handleFeedback = useCallback((productId: string, liked: boolean) => {
    setFeedbackState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        liked,
        submitted: false,
      }
    }))
  }, [])

  const handleCommentChange = useCallback((productId: string, comment: string) => {
    setFeedbackState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comment,
      }
    }))
  }, [])

  const submitFeedback = useCallback(async (productId: string) => {
    const feedback = feedbackState[productId]
    if (feedback?.liked === null) return

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    setFeedbackState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        submitted: true,
      }
    }))

    setToastMessage(feedback?.liked ? "Obrigado pelo feedback positivo! 🎉" : "Obrigado! Vamos melhorar as recomendações.")
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }, [feedbackState])

  const submitAllFeedback = useCallback(async () => {
    const allFeedback: RecommendationFeedback[] = recommendations
      .filter(rec => feedbackState[rec.productId]?.liked !== null)
      .map(rec => ({
        productId: rec.productId,
        liked: feedbackState[rec.productId].liked!,
        comment: feedbackState[rec.productId].comment,
        timestamp: new Date().toISOString(),
      }))

    if (allFeedback.length === 0) return

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    onFeedbackSubmit?.(allFeedback)
    
    setToastMessage(`Feedback enviado para ${allFeedback.length} produto(s)!`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }, [recommendations, feedbackState, onFeedbackSubmit])

  const getFeedbackState = (productId: string) => {
    return feedbackState[productId] || { liked: null, comment: "", submitted: false }
  }

  const totalFeedbackGiven = Object.values(feedbackState).filter(f => f.liked !== null).length
  const totalSubmitted = Object.values(feedbackState).filter(f => f.submitted).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold">Avalie as Recomendações</h3>
        </div>
        {totalFeedbackGiven > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={submitAllFeedback}
            disabled={totalFeedbackGiven === totalSubmitted}
          >
            {totalSubmitted === totalFeedbackGiven ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Enviado
              </>
            ) : (
              <>
                Enviar Feedback ({totalFeedbackGiven})
              </>
            )}
          </Button>
        )}
      </div>

      {/* Feedback Cards */}
      <div className="grid gap-4">
        {recommendations.map((rec) => {
          const state = getFeedbackState(rec.productId)
          
          return (
            <Card key={rec.productId} className={`transition-all ${state.submitted ? "opacity-75" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-medium">
                    {rec.product.name}
                  </CardTitle>
                  {state.submitted && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {rec.reason}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Like/Dislike Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-2">
                    Esta recomendação foi útil?
                  </span>
                  <Button
                    variant={state.liked === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFeedback(rec.productId, true)}
                    disabled={state.submitted}
                    className={`${state.liked === true ? "bg-green-500 hover:bg-green-600" : ""}`}
                  >
                    <ThumbsUp className="mr-1 h-4 w-4" />
                    Gostei
                  </Button>
                  <Button
                    variant={state.liked === false ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleFeedback(rec.productId, false)}
                    disabled={state.submitted}
                  >
                    <ThumbsDown className="mr-1 h-4 w-4" />
                    Não gostei
                  </Button>
                </div>

                {/* Comment Input (shown after feedback) */}
                {state.liked !== null && !state.submitted && (
                  <div className="flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Textarea
                      placeholder="Adicione um comentário (opcional)..."
                      value={state.comment}
                      onChange={(e) => handleCommentChange(rec.productId, e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => submitFeedback(rec.productId)}
                      className="shrink-0"
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Enviar
                    </Button>
                  </div>
                )}

                {/* Submitted State */}
                {state.submitted && (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Feedback enviado com sucesso!
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Refresh Button */}
      {onRefreshRecommendations && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={onRefreshRecommendations}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Ver outras recomendações
              </>
            )}
          </Button>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-green-500 bg-green-50 dark:bg-green-950 shadow-lg">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
