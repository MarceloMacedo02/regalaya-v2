"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Copy, Check } from "lucide-react"

interface TemplateVariableParserProps {
  content: string
  onVariablesChange?: (variables: string[]) => void
}

const AVAILABLE_VARIABLES = [
  { key: "nome", label: "Nome do cliente", example: "João Silva" },
  { key: "email", label: "Email do cliente", example: "joao@email.com" },
  { key: "telefone", label: "Telefone", example: "(86) 99999-9999" },
  { key: "produto", label: "Nome do produto", example: "Caixa de Bombons" },
  { key: "valor", label: "Valor", example: "R$ 99,90" },
  { key: "codigo_pedido", label: "Código do pedido", example: "PED-12345" },
  { key: "data_entrega", label: "Data de entrega", example: "15/04/2026" },
  { key: "mensagem", label: "Mensagem personalizada", example: "Feliz aniversário!" },
]

export function TemplateVariableParser({ content, onVariablesChange }: TemplateVariableParserProps) {
  const [customVariables, setCustomVariables] = useState<string[]>([])
  const [newVariable, setNewVariable] = useState("")
  const [copied, setCopied] = useState(false)

  const detectedVariables = content.match(/\{\{([a-zA-Z0-9_]+)\}\}/g)?.map(v => v.replace(/[{}]/g, "")) || []

  const allVariables = [...new Set([...detectedVariables, ...customVariables])]

  const handleAddCustomVariable = useCallback(() => {
    if (newVariable && !customVariables.includes(newVariable) && !detectedVariables.includes(newVariable)) {
      const updated = [...customVariables, newVariable]
      setCustomVariables(updated)
      setNewVariable("")
      onVariablesChange?.([...detectedVariables, ...updated])
    }
  }, [newVariable, customVariables, detectedVariables, onVariablesChange])

  const handleRemoveCustomVariable = useCallback((variable: string) => {
    const updated = customVariables.filter(v => v !== variable)
    setCustomVariables(updated)
    onVariablesChange?.([...detectedVariables, ...updated])
  }, [customVariables, detectedVariables, onVariablesChange])

  const handleCopyVariable = useCallback((variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">Variáveis do Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detected variables */}
        {allVariables.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Variáveis detectadas:</Label>
            <div className="flex flex-wrap gap-2">
              {allVariables.map(variable => (
                <div key={variable} className="flex items-center gap-1">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {`{{${variable}}}`}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleCopyVariable(variable)}
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  {customVariables.includes(variable) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveCustomVariable(variable)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available variables */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Variáveis disponíveis:</Label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_VARIABLES.map(variable => (
              <div
                key={variable.key}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-[#003566]">{`{{${variable.key}}}`}</p>
                  <p className="text-[10px] text-gray-500 truncate">{variable.label}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleCopyVariable(variable.key)}
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Add custom variable */}
        <div className="flex gap-2">
          <Input
            value={newVariable}
            onChange={(e) => setNewVariable(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
            placeholder="Nova variável (ex: desconto)"
            className="text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAddCustomVariable()}
          />
          <Button onClick={handleAddCustomVariable} size="sm" className="gap-1">
            <Plus className="h-3 w-3" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
