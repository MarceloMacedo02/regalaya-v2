"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Mail, MessageSquare, Eye, Download, Upload, Loader2, FileText } from "lucide-react"
import { templatesService } from "@/services/templates.service"
import type { Template, CommunicationType } from "@/services/templates.service"
import { TemplateEditor } from "@/components/admin/communications/TemplateEditor"
import { useToast } from "@/hooks/use-toast"

export default function TemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await templatesService.findAll()
      setTemplates(data)
    } catch {
      toast({
        title: "Erro ao carregar templates",
        description: "Não foi possível carregar a lista de templates.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesType = typeFilter === "all" || template.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [templates, searchQuery, typeFilter])

  const handleCreate = () => {
    setEditingTemplate(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!templateToDelete) return
    try {
      await templatesService.delete(templateToDelete)
      setTemplates(templates.filter(t => t.id !== templateToDelete))
      toast({ title: "Template excluído", description: "O template foi removido com sucesso." })
    } catch {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir o template.", variant: "destructive" })
    }
    setTemplateToDelete(null)
  }

  const handleSave = async (data: {
    name: string
    type: CommunicationType
    subject: string
    content: string
    variables: string
    description: string
    isActive: boolean
    category: string
  }) => {
    setIsSaving(true)
    try {
      if (editingTemplate) {
        await templatesService.update(editingTemplate.id, data)
        toast({ title: "Template atualizado", description: "O template foi atualizado com sucesso." })
      } else {
        await templatesService.create(data)
        toast({ title: "Template criado", description: "O template foi cadastrado com sucesso." })
      }
      await fetchTemplates()
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o template.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      const json = await templatesService.exportTemplates()
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `templates-regalaya-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: "Exportação concluída", description: "Templates exportados com sucesso." })
    } catch {
      toast({ title: "Erro na exportação", description: "Não foi possível exportar os templates.", variant: "destructive" })
    }
  }

  const handleImport = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const jsonContent = event.target?.result as string
          await templatesService.importTemplates(jsonContent)
          toast({ title: "Importação concluída", description: "Templates importados com sucesso." })
          await fetchTemplates()
        } catch {
          toast({ title: "Erro na importação", description: "Não foi possível importar os templates.", variant: "destructive" })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const getTypeIcon = (type: CommunicationType) => {
    return type === "EMAIL" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates de Comunicação</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie templates de email e WhatsApp para campanhas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport} className="gap-1">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleCreate} className="btn-elegant gap-1">
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total de Templates</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Templates Email</span>
            <div className="h-9 w-9 rounded-lg bg-[#00A8E8]/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-[#00A8E8]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#00A8E8]">{templates.filter(t => t.type === "EMAIL").length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Templates WhatsApp</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{templates.filter(t => t.type === "WHATSAPP").length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Templates Ativos</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{templates.filter(t => t.isActive).length}</div>
        </div>
      </div>

      {/* Filters */}
      <Card className="admin-card">
        <CardContent className="pt-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Buscar por nome ou conteúdo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de comunicação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-600">Nome</TableHead>
              <TableHead className="font-semibold text-gray-600">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-600">Categoria</TableHead>
              <TableHead className="font-semibold text-gray-600">Versão</TableHead>
              <TableHead className="font-semibold text-gray-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-600">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FileText className="h-10 w-10" />
                    <p>Nenhum template encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map(template => (
                <TableRow key={template.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-800">{template.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{template.description || template.content.substring(0, 60)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      {getTypeIcon(template.type)}
                      {template.type === "EMAIL" ? "Email" : "WhatsApp"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {template.category ? (
                      <Badge variant="outline">{template.category}</Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">v{template.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={template.isActive ? "admin-badge-success" : "admin-badge-secondary"}>
                      {template.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(template)} className="text-gray-400 hover:text-[#00A8E8]">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setTemplateToDelete(template.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto dialog-elegant">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingTemplate ? "Editar Template" : "Novo Template"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {editingTemplate ? "Altere as informações do template" : "Preencha as informações para criar um novo template"}
            </DialogDescription>
          </DialogHeader>
          <TemplateEditor
            template={editingTemplate}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <DialogContent className="dialog-elegant">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTemplateToDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
