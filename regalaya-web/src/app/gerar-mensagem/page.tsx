"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageForm } from "@/components/message-generator/MessageForm"
import { MessagePreview } from "@/components/message-generator/MessagePreview"
import { useMessageGeneration, MessageRequest } from "@/hooks/useMessageGeneration"
import { Sparkles, MessageSquare } from "lucide-react"

export default function GenerateMessagePage() {
  const { message, loading, error, generateMessage, clearMessage } = useMessageGeneration()
  const [lastRequest, setLastRequest] = useState<MessageRequest | null>(null)

  const handleSubmit = async (request: MessageRequest) => {
    setLastRequest(request)
    try {
      await generateMessage(request)
    } catch {
      // Error handled by hook
    }
  }

  const handleRegenerate = async () => {
    if (lastRequest) {
      await generateMessage(lastRequest)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gerar Mensagem Personalizada</h1>
              <p className="text-sm text-slate-500">Crie mensagens emocionais para acompanhar seus presentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#8B5CF6]" />
                Configurar Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MessageForm onSubmit={handleSubmit} loading={loading} />
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Preview da Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              {message ? (
                <MessagePreview
                  message={message}
                  onRegenerate={handleRegenerate}
                  loading={loading}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <MessageSquare className="h-16 w-16 mb-4 text-slate-300" />
                  <p className="text-sm">Preencha o formulário para gerar sua mensagem</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
