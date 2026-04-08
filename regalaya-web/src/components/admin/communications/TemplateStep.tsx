"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Mail, MessageSquare, Eye, Loader2 } from "lucide-react"
import { templatesService } from "@/services/templates.service"
import type { CommunicationType, Template } from "@/services/templates.service"

interface TemplateStepProps {
  communicationType: CommunicationType
  selectedTemplateId: string | null
  onTemplateSelect: (templateId: string) => void
  customization: Record<string, string>
  onCustomizationChange: (customization: Record<string, string>) => void
  error?: string
}

export function TemplateStep({
  communicationType,
  selectedTemplateId,
  onTemplateSelect,
  customization,
  onCustomizationChange,
  error,
}: TemplateStepProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true)
      try {
        const all = await templatesService.findAll(communicationType)
        setTemplates(all.filter(t => t.isActive))
      } catch {
        // Error handled silently
      } finally {
        setIsLoading(false)
      }
    }
    fetchTemplates()
  }, [communicationType])

  const filteredTemplates = templates.filter(t =>
    !searchQuery ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const detectedVariables = previewTemplate?.content.match(/\{\{([a-zA-Z0-9_]+)\}\}/g)?.map(v => v.replace(/[{}]/g, "")) || []

  const handleCustomizationChange = (variable: string, value: string) => {
    onCustomizationChange({ ...customization, [variable]: value })
  }

  const getPreviewContent = () => {
    if (!previewTemplate) return ""
    let content = previewTemplate.content
    detectedVariables.forEach(variable => {
      const value = customization[variable] || `[${variable}]`
      content = content.replace(new RegExp(`\\{\\{${variable}\\}\\}`, "g"), value)
    })
    return content
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Seleção de Template</h3>
        <p className="text-sm text-gray-500 mt-1">
          Escolha um template de {communicationType === "EMAIL" ? "email" : "WhatsApp"} para sua campanha
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Mail className="h-10 w-10 mx-auto mb-2" />
          <p>Nenhum template encontrado para {communicationType === "EMAIL" ? "email" : "WhatsApp"}</p>
          <p className="text-xs mt-1">Crie um template primeiro na seção de Templates</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplateId === template.id ? "ring-2 ring-[#003566] border-[#003566]" : "border-gray-200"
              }`}
              onClick={() => onTemplateSelect(template.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onTemplateSelect(template.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {template.type === "EMAIL" ? (
                      <Mail className="h-4 w-4 text-[#00A8E8]" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-green-500" />
                    )}
                    <p className="font-semibold text-gray-900 text-sm">{template.name}</p>
                  </div>
                  <Badge variant={template.type === "EMAIL" ? "default" : "secondary"} className="text-[10px]">
                    v{template.version}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{template.description || template.content.substring(0, 80)}...</p>
                {template.category && (
                  <Badge variant="outline" className="mt-2 text-[10px]">{template.category}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview & Customization */}
      {selectedTemplateId && (
        <Card className="border-dashed">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Preview e Personalização</h4>
              <button
                className="text-sm text-[#00A8E8] hover:underline flex items-center gap-1"
                onClick={() => setPreviewTemplate(templates.find(t => t.id === selectedTemplateId) || null)}
              >
                <Eye className="h-4 w-4" />
                Ver preview
              </button>
            </div>

            {previewTemplate && (
              <div className="space-y-4">
                {/* Variables customization */}
                {detectedVariables.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm text-gray-700">Personalizar variáveis:</Label>
                    {detectedVariables.map(variable => (
                      <div key={variable} className="grid gap-1">
                        <Label className="text-xs font-mono text-gray-600">{`{{${variable}}}`}</Label>
                        <Input
                          value={customization[variable] || ""}
                          onChange={(e) => handleCustomizationChange(variable, e.target.value)}
                          placeholder={`Valor para ${variable}`}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview */}
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="whitespace-pre-wrap text-sm">
                    {getPreviewContent()}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
