"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Code, Mail, MessageSquare, Bold, Italic, Underline, List, ListOrdered } from "lucide-react"
import { TemplateVariableParser } from "./TemplateVariableParser"
import type { CommunicationType, Template } from "@/services/templates.service"

interface TemplateEditorProps {
  template?: Template | null
  onSave: (data: {
    name: string
    type: CommunicationType
    subject: string
    content: string
    variables: string
    description: string
    isActive: boolean
    category: string
  }) => void
  onCancel: () => void
  isSaving?: boolean
}

export function TemplateEditor({ template, onSave, onCancel, isSaving }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || "")
  const [type, setType] = useState<CommunicationType>(template?.type || "EMAIL")
  const [subject, setSubject] = useState(template?.subject || "")
  const [content, setContent] = useState(template?.content || "")
  const [variables, setVariables] = useState(template?.variables || "")
  const [description, setDescription] = useState(template?.description || "")
  const [category, setCategory] = useState(template?.category || "")
  const [isActive, setIsActive] = useState(template?.isActive ?? true)
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit")

  const handleVariablesChange = useCallback((vars: string[]) => {
    setVariables(vars.join(","))
  }, [])

  const handleInsertVariable = useCallback((variable: string) => {
    setContent(prev => prev + `{{${variable}}}`)
  }, [])

  const previewContent = useMemo(() => {
    return content
      .replace(/\{\{nome\}\}/g, "João Silva")
      .replace(/\{\{email\}\}/g, "joao@email.com")
      .replace(/\{\{telefone\}\}/g, "(86) 99999-9999")
      .replace(/\{\{produto\}\}/g, "Caixa de Bombons Premium")
      .replace(/\{\{valor\}\}/g, "R$ 99,90")
      .replace(/\{\{codigo_pedido\}\}/g, "PED-12345")
      .replace(/\{\{data_entrega\}\}/g, "15/04/2026")
      .replace(/\{\{mensagem\}\}/g, "Feliz aniversário!")
      .replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, "[valor]")
  }, [content])

  const handleSave = () => {
    onSave({
      name,
      type,
      subject: type === "EMAIL" ? subject : "",
      content,
      variables,
      description,
      isActive,
      category,
    })
  }

  const insertFormatButton = (variable: string) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs"
      onClick={() => handleInsertVariable(variable)}
    >
      {`{{${variable}}}`}
    </Button>
  )

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">Nome do Template *</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Boas-vindas por Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-type">Tipo de Comunicação *</Label>
              <Select value={type} onValueChange={(v) => setType(v as CommunicationType)}>
                <SelectTrigger id="template-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="WHATSAPP">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template-category">Categoria</Label>
              <Input
                id="template-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: ONBOARDING, PROMO, POS_VENDA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Descrição</Label>
              <Input
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição do template"
              />
            </div>
          </div>

          {type === "EMAIL" && (
            <div className="space-y-2">
              <Label htmlFor="template-subject">Assunto do Email *</Label>
              <Input
                id="template-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Bem-vindo à Regalaya, {{nome}}!"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="template-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="template-active">Template ativo</Label>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conteúdo do Template</CardTitle>
            <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as "edit" | "preview")}>
              <TabsList>
                <TabsTrigger value="edit" className="gap-1">
                  <Code className="h-4 w-4" />
                  Editar
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Quick insert buttons */}
          <div className="flex flex-wrap gap-1">
            {["nome", "email", "telefone", "produto", "valor"].map(v => insertFormatButton(v))}
          </div>

          {previewMode === "edit" ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo do template aqui... Use {{variavel}} para variáveis dinâmicas."
              className="min-h-[200px] font-mono text-sm"
            />
          ) : (
            <div className="min-h-[200px] p-4 rounded-lg border bg-gray-50 whitespace-pre-wrap">
              {previewContent || <span className="text-gray-400">Nenhum conteúdo para preview</span>}
            </div>
          )}

          {type === "WHATSAPP" && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Caracteres: {content.length}</span>
              <Badge variant={content.length > 160 ? "destructive" : "secondary"}>
                {content.length > 160 ? "Excede 160 caracteres" : "Dentro do limite"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variable Parser */}
      <TemplateVariableParser content={content} onVariablesChange={handleVariablesChange} />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !name || !content}>
          {isSaving ? "Salvando..." : template ? "Atualizar Template" : "Criar Template"}
        </Button>
      </div>
    </div>
  )
}
