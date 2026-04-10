import { useState, useCallback } from "react"
import { http } from "@/lib/api"

export interface MessageRequest {
  ocasiao: string
  relacionamento: string
  produto: string
  tom?: string
  contexto?: string
  comprimento?: "curto" | "medio" | "longo"
}

export interface MessageResponse {
  mensagem: string
}

export function useMessageGeneration() {
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateMessage = useCallback(async (request: MessageRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await http.post<MessageResponse>("/ai/generate-message", request)
      setMessage(response.mensagem)
      setLoading(false)
      return response
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao gerar mensagem"
      setError(msg)
      setLoading(false)
      throw err
    }
  }, [])

  const clearMessage = useCallback(() => {
    setMessage("")
    setError(null)
  }, [])

  return { message, loading, error, generateMessage, clearMessage }
}
