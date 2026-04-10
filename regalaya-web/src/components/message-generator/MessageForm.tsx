"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LengthSelector } from "./LengthSelector"
import { MessageRequest } from "@/hooks/useMessageGeneration"

interface MessageFormProps {
  onSubmit: (request: MessageRequest) => void
  loading: boolean
}

const OCCASION_OPTIONS = [
  "Aniversário",
  "Dia das Mães",
  "Dia dos Pais",
  "Dia dos Namorados",
  "Natal",
  "Amigo Secreto",
  "Casamento",
  "Formatura",
  "Outro",
]

const RELATIONSHIP_OPTIONS = [
  "Mãe",
  "Pai",
  "Namorado(a)",
  "Esposo(a)",
  "Amigo(a)",
  "Irmão(ã)",
  "Colega de trabalho",
  "Outro",
]

const TONE_OPTIONS = [
  "Sentimental",
  "Formal",
  "Engraçado",
  "Poético",
  "Descontraído",
]

export function MessageForm({ onSubmit, loading }: MessageFormProps) {
  const [ocasiao, setOcasiao] = useState("")
  const [relacionamento, setRelacionamento] = useState("")
  const [produto, setProduto] = useState("")
  const [tom, setTom] = useState("Sentimental")
  const [contexto, setContexto] = useState("")
  const [comprimento, setComprimento] = useState<"curto" | "medio" | "longo">("medio")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ocasiao, relacionamento, produto, tom, contexto, comprimento })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Ocasião */}
      <div className="space-y-2">
        <Label htmlFor="ocasiao">Ocasião *</Label>
        <select
          id="ocasiao"
          value={ocasiao}
          onChange={(e) => setOcasiao(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
        >
          <option value="">Selecione a ocasião...</option>
          {OCCASION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Relacionamento */}
      <div className="space-y-2">
        <Label htmlFor="relacionamento">Relacionamento *</Label>
        <select
          id="relacionamento"
          value={relacionamento}
          onChange={(e) => setRelacionamento(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
        >
          <option value="">Selecione o relacionamento...</option>
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Produto */}
      <div className="space-y-2">
        <Label htmlFor="produto">Produto / Presente *</Label>
        <Input
          id="produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          placeholder="Ex: Buquê de rosas vermelhas"
          required
        />
      </div>

      {/* Tom */}
      <div className="space-y-2">
        <Label htmlFor="tom">Tom da mensagem</Label>
        <select
          id="tom"
          value={tom}
          onChange={(e) => setTom(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#8B5CF6] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
        >
          {TONE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Contexto */}
      <div className="space-y-2">
        <Label htmlFor="contexto">Contexto adicional (opcional)</Label>
        <Textarea
          id="contexto"
          value={contexto}
          onChange={(e) => setContexto(e.target.value)}
          placeholder="Ex: Ela é psicóloga e adora ler. Queremos algo que demonstre admiração..."
          rows={3}
        />
      </div>

      {/* Comprimento */}
      <LengthSelector value={comprimento} onChange={setComprimento} />

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !ocasiao || !relacionamento || !produto}
        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Gerando mensagem...
          </>
        ) : (
          "✨ Gerar Mensagem"
        )}
      </Button>
    </form>
  )
}
