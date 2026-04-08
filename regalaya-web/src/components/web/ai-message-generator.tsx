"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles,
  Loader2,
  Edit3,
  Send,
  Heart,
  MessageCircle
} from "lucide-react"
import type { MessageTone } from "@/types/ai"

const MAX_CHARS = 500

const TONE_OPTIONS: { value: MessageTone; label: string; description: string }[] = [
  { value: "formal", label: "Formal", description: "Profesional y respetuoso" },
  { value: "informal", label: "Informal", description: "Amigable y cercano" },
  { value: "romantic", label: "Romântico", description: "Carinhoso e apaixonado" },
  { value: "funny", label: "Humor", description: "Divertido e leve" },
  { value: "professional", label: "Corporativo", description: "Formal empresarial" },
]

interface AIMessageGeneratorProps {
  recipientName?: string
  productName?: string
  occasion?: string
  onMessageGenerated?: (message: string) => void
  onCopy?: (message: string) => void
}

export function AIMessageGenerator({
  recipientName = "querido(a)",
  productName,
  occasion,
  onMessageGenerated,
  onCopy,
}: AIMessageGeneratorProps) {
  const [message, setMessage] = useState("")
  const [editedMessage, setEditedMessage] = useState("")
  const [selectedTone, setSelectedTone] = useState<MessageTone>("informal")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"generate" | "edit">("generate")

  const generateMessage = useCallback(async () => {
    setIsGenerating(true)
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const templates: Record<MessageTone, string[]> = {
      formal: [
        `Prezado(a) ${recipientName}, gostaria de presenteá-lo(a) com este item${productName ? ` - ${productName}` : ''} por ocasião${occasion ? ` de ${occasion}` : ''}. Esperando que goste, exprimo meus melhores votos.`,
        `${recipientName}, segue este presente${productName ? ` - ${productName}` : ''} como forma de reconhecimento${occasion ? ` pela ${occasion}` : ''}. Atenciosamente.`,
      ],
      informal: [
        `Oi ${recipientName}! Te mandei esse presentinho${productName ? ` (${productName})` : ''} prazer${occasion ? ` por causa da ${occasion}` : ''}! Espero que goteee! 🎁`,
        `Eii ${recipientName}, achei que você ia curtir isso aqui${productName ? ` - ${productName}` : ''}! ${occasion ? `Parabéns pela ${occasion}!` : ''} Beijooo!`,
      ],
      romantic: [
        `Meu amor ${recipientName}, escolhi este presente${productName ? ` - ${productName}` : ''} pensando em você${occasion ? ` paraCelebrar nossa ${occasion}` : ''}. Você é muito especial para mim! ❤️`,
        `Querido(a) ${recipientName}, este presente${productName ? ` (${productName})` : ''} é pequeno comparado ao quanto você significa para mim${occasion ? ` nesta data especial (${occasion})` : ''}. Com todo meu amor, 💕`,
      ],
      funny: [
        `ATENÇÃO ${recipientName.toUpperCase()}! Você acaba de receber um pacote misterioso${productName ? ` contendo ${productName}` : ''}! ${occasion ? `Motivo: ${occasion}!` : ''} Não sei se é piada ou presente, mas hopes que goste! 😄`,
        `Sabe aquele presente que você não sabia que precisava? Agora você tem! ${productName ? `(${productName})` : ''} ${recipientName}, ${occasion ? `feliz ${occasion}!` : 'surpresa!'} Agora me deve um café! ☕`,
      ],
      professional: [
        `${recipientName}, segue${productName ? ` o ${productName}` : ''} como agradecimento${occasion ? ` pela ${occasion}` : ''}. Foi um prazer trabalhar com você. Atenciosamente,`,
        `${recipientName}, gostaria de presenteá-lo(a) com este item${productName ? ` (${productName})` : ''} em${occasion ? ` celebração da ${occasion}` : ''}. Att,`,
      ],
    }

    const randomIndex = Math.floor(Math.random() * templates[selectedTone].length)
    const generatedMessage = templates[selectedTone][randomIndex]
    
    setMessage(generatedMessage)
    setEditedMessage(generatedMessage)
    setActiveTab("edit")
    onMessageGenerated?.(generatedMessage)
    
    setIsGenerating(false)
  }, [recipientName, productName, occasion, selectedTone, onMessageGenerated])

  const handleCopy = useCallback(() => {
    const textToCopy = activeTab === "edit" ? editedMessage : message
    navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)
    onCopy?.(textToCopy)
    
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }, [message, editedMessage, activeTab, onCopy])

  const charCount = (activeTab === "edit" ? editedMessage : message).length
  const isOverLimit = charCount > MAX_CHARS

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          Gerar Mensagem Personalizada
        </CardTitle>
        <CardDescription>
          Nossa IA cria mensagens perfeitas para cada ocasião
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tone Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Selecione o tom da mensagem:</label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((tone) => (
              <Button
                key={tone.value}
                variant={selectedTone === tone.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTone(tone.value)}
                className="relative"
              >
                {tone.label}
                {selectedTone === tone.value && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {TONE_OPTIONS.find(t => t.value === selectedTone)?.description}
          </p>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateMessage} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando mensagem...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Mensagem com IA
            </>
          )}
        </Button>

        {/* Message Display / Edit */}
        {(message || editedMessage) && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generate" | "edit")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar Nova
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Edit3 className="mr-2 h-4 w-4" />
                Editar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="whitespace-pre-wrap text-sm">{message || "Clique em 'Gerar Mensagem' para criar uma mensagem automática."}</p>
              </div>
            </TabsContent>

            <TabsContent value="edit" className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  placeholder="Edite sua mensagem aqui..."
                  className="min-h-[120px]"
                />
                
                {/* Character Counter */}
                <div className="flex items-center justify-between text-xs">
                  <span className={isOverLimit ? "text-red-500" : "text-muted-foreground"}>
                    {charCount} / {MAX_CHARS} caracteres
                  </span>
                  {isOverLimit && (
                    <span className="text-red-500 font-medium">
                      Limite excedido! Remova {charCount - MAX_CHARS} caracteres
                    </span>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Copy Button */}
        {(message || editedMessage) && (
          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full"
            disabled={isOverLimit}
          >
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copiar Mensagem
              </>
            )}
          </Button>
        )}

        {/* Quick Actions */}
        {(message || editedMessage) && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <MessageCircle className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
