"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Cake,
  Heart,
  Star,
  Loader2,
  Phone,
  MessageCircle,
  ChevronRight,
  Search,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { contactService } from "@/services"
import type {
  Contact,
  ContactDetail,
  CreateContactRequest,
  UpdateContactRequest,
  CreateSpecialDateRequest,
  UpdateSpecialDateRequest,
  SpecialDate,
  SpecialDateType,
  RecurrenceType,
  ImportContactEntry,
  ImportReport,
} from "@/types/user"

const SPECIAL_DATE_TYPE_LABELS: Record<SpecialDateType, string> = {
  BIRTHDAY: "Aniversário",
  ANNIVERSARY: "Aniversário de Casamento",
  CHRISTMAS: "Natal",
  WEDDING: "Casamento",
  CUSTOM: "Data Especial",
}

const SPECIAL_DATE_TYPE_ICONS: Record<SpecialDateType, React.ReactNode> = {
  BIRTHDAY: <Cake className="h-4 w-4" />,
  ANNIVERSARY: <Heart className="h-4 w-4" />,
  CHRISTMAS: <Star className="h-4 w-4" />,
  WEDDING: <Heart className="h-4 w-4" />,
  CUSTOM: <Calendar className="h-4 w-4" />,
}

const SPECIAL_DATE_TYPE_COLORS: Record<SpecialDateType, string> = {
  BIRTHDAY: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  ANNIVERSARY: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  CHRISTMAS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  WEDDING: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  CUSTOM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
}

export default function ContactsPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactDetail | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isAddDateDialogOpen, setIsAddDateDialogOpen] = useState(false)
  const [isEditDateDialogOpen, setIsEditDateDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [importReport, setImportReport] = useState<ImportReport | null>(null)
  const [importPreview, setImportPreview] = useState<ImportContactEntry[]>([])
  const [importFileName, setImportFileName] = useState("")

  const [formData, setFormData] = useState<CreateContactRequest>({
    name: "",
    phone: "",
    whatsappId: "",
    consent: false,
  })

  const [dateFormData, setDateFormData] = useState<CreateSpecialDateRequest>({
    type: "BIRTHDAY",
    date: "",
    recurrence: "YEARLY",
  })

  const [editDateFormData, setEditDateFormData] = useState<UpdateSpecialDateRequest & { id: string }>({
    id: "",
    type: "BIRTHDAY",
    date: "",
    recurrence: "YEARLY",
  })

  const fetchContacts = useCallback(async (search?: string) => {
    try {
      setIsLoading(true)
      const data = await contactService.getAll(search)
      setContacts(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar contatos",
        description: "Não foi possível carregar suas pessoas queridas. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchContacts(searchQuery || undefined)
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, fetchContacts])

  const resetForm = () => {
    setFormData({ name: "", phone: "", whatsappId: "", consent: false })
    setEditingContact(null)
  }

  const handleOpenAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleOpenEditDialog = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      phone: contact.phone || "",
      whatsappId: contact.whatsappId || "",
      consent: contact.consent,
    })
    setIsAddDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      if (editingContact) {
        const updateData: UpdateContactRequest = {
          name: formData.name,
          phone: formData.phone || undefined,
          whatsappId: formData.whatsappId || undefined,
          consent: formData.consent,
        }
        await contactService.update(editingContact.id, updateData)
        toast({ title: "Contato atualizado", description: "O contato foi atualizado com sucesso." })
      } else {
        await contactService.create(formData)
        toast({ title: "Contato adicionado", description: "O contato foi cadastrado com sucesso." })
      }
      setIsAddDialogOpen(false)
      resetForm()
      fetchContacts(searchQuery || undefined)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o contato. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return
    try {
      await contactService.delete(id)
      toast({ title: "Contato excluído", description: "O contato foi removido com sucesso." })
      if (selectedContact?.id === id) {
        setIsDetailDialogOpen(false)
        setSelectedContact(null)
      }
      fetchContacts(searchQuery || undefined)
    } catch (error) {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir o contato.", variant: "destructive" })
    }
  }

  const handleOpenDetail = async (contact: Contact) => {
    try {
      const detail = await contactService.getById(contact.id)
      setSelectedContact(detail)
      setIsDetailDialogOpen(true)
    } catch (error) {
      toast({ title: "Erro ao carregar detalhes", description: "Não foi possível carregar os detalhes do contato.", variant: "destructive" })
    }
  }

  const handleOpenAddDateDialog = () => {
    setDateFormData({ type: "BIRTHDAY", date: "", recurrence: "YEARLY" })
    setIsAddDateDialogOpen(true)
  }

  const handleOpenEditDateDialog = (date: SpecialDate) => {
    setEditDateFormData({ id: date.id, type: date.type, date: date.date, recurrence: date.recurrence })
    setIsEditDateDialogOpen(true)
  }

  const handleAddSpecialDate = async () => {
    if (!selectedContact) return
    try {
      setIsSaving(true)
      await contactService.addSpecialDate(selectedContact.id, dateFormData)
      toast({ title: "Data especial adicionada", description: "A data especial foi cadastrada com sucesso." })
      setIsAddDateDialogOpen(false)
      const updated = await contactService.getById(selectedContact.id)
      setSelectedContact(updated)
    } catch (error) {
      toast({ title: "Erro ao adicionar", description: "Não foi possível adicionar a data especial.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateSpecialDate = async () => {
    if (!selectedContact) return
    try {
      setIsSaving(true)
      const { id, ...data } = editDateFormData
      await contactService.updateSpecialDate(selectedContact.id, id, data)
      toast({ title: "Data especial atualizada", description: "A data especial foi atualizada com sucesso." })
      setIsEditDateDialogOpen(false)
      const updated = await contactService.getById(selectedContact.id)
      setSelectedContact(updated)
    } catch (error) {
      toast({ title: "Erro ao atualizar", description: "Não foi possível atualizar a data especial.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSpecialDate = async (dateId: string) => {
    if (!selectedContact) return
    if (!confirm("Tem certeza que deseja excluir esta data especial?")) return
    try {
      await contactService.deleteSpecialDate(selectedContact.id, dateId)
      toast({ title: "Data especial excluída", description: "A data especial foi removida com sucesso." })
      const updated = await contactService.getById(selectedContact.id)
      setSelectedContact(updated)
    } catch (error) {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir a data especial.", variant: "destructive" })
    }
  }

  // Import handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportFileName(file.name)
    const text = await file.text()

    try {
      let entries: ImportContactEntry[] = []

      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text)
        const arr = Array.isArray(parsed) ? parsed : parsed.contacts || []
        entries = arr.map((item: any) => ({
          name: item.name || item.nome || "",
          phone: item.phone || item.telefone || "",
          whatsappId: item.whatsappId || item.whatsapp || "",
        }))
      } else if (file.name.endsWith(".csv")) {
        const lines = text.split("\n").filter((l) => l.trim())
        const header = lines[0].toLowerCase().split(/[;,]/).map((h) => h.trim())
        const nameIdx = header.findIndex((h) => h.includes("nome") || h.includes("name"))
        const phoneIdx = header.findIndex((h) => h.includes("telefone") || h.includes("phone"))
        const whatsIdx = header.findIndex((h) => h.includes("whatsapp"))

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(/[;,]/).map((c) => c.trim())
          entries.push({
            name: cols[nameIdx] || "",
            phone: phoneIdx >= 0 ? cols[phoneIdx] : "",
            whatsappId: whatsIdx >= 0 ? cols[whatsIdx] : "",
          })
        }
      }

      if (entries.length === 0) {
        toast({ title: "Arquivo vazio", description: "Nenhum contato encontrado no arquivo.", variant: "destructive" })
        return
      }

      if (entries.length > 100) {
        toast({ title: "Limite excedido", description: "Máximo de 100 contatos por importação.", variant: "destructive" })
        return
      }

      setImportPreview(entries)
      setImportReport(null)
    } catch {
      toast({ title: "Erro ao ler arquivo", description: "Formato não suportado. Use CSV ou JSON.", variant: "destructive" })
    }
  }

  const handleImport = async () => {
    if (importPreview.length === 0) return
    try {
      setIsSaving(true)
      const report = await contactService.importContacts(importPreview)
      setImportReport(report)
      toast({
        title: "Importação concluída",
        description: `${report.success} de ${report.total} contatos importados com sucesso.`,
      })
      fetchContacts(searchQuery || undefined)
    } catch (error) {
      toast({ title: "Erro na importação", description: "Não foi possível importar os contatos.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR")
  }

  const getNextOccurrence = (dateStr: string, recurrence: RecurrenceType) => {
    const date = new Date(dateStr + "T00:00:00")
    const now = new Date()
    const thisYear = now.getFullYear()

    if (recurrence === "ONCE") {
      return formatDate(dateStr)
    }

    let nextDate = new Date(thisYear, date.getMonth(), date.getDate())
    if (nextDate < now) {
      nextDate = new Date(thisYear + 1, date.getMonth(), date.getDate())
    }

    const diffTime = nextDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hoje!"
    if (diffDays === 1) return "Amanhã"
    if (diffDays < 7) return `Em ${diffDays} dias`
    if (diffDays < 30) return `Em ${Math.floor(diffDays / 7)} semanas`
    return `Em ${Math.floor(diffDays / 30)} meses`
  }

  if (isLoading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pessoas Queridas</h1>
          <p className="text-muted-foreground">
            Cadastre pessoas especiais e nunca esqueça uma data importante
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button onClick={handleOpenAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Add/Edit Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContact ? "Editar Contato" : "Adicionar Nova Pessoa"}</DialogTitle>
            <DialogDescription>
              {editingContact
                ? "Atualize as informações desta pessoa querida."
                : "Cadastre uma pessoa especial para lembrar de datas importantes."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsappId">WhatsApp</Label>
              <Input
                id="whatsappId"
                placeholder="ID do WhatsApp ou número"
                value={formData.whatsappId || ""}
                onChange={(e) => setFormData({ ...formData, whatsappId: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => setFormData({ ...formData, consent: !!checked })}
              />
              <Label htmlFor="consent" className="text-sm">
                Consento receber notificações sobre datas especiais
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.name}>
              {isSaving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>
              ) : editingContact ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{selectedContact?.name}</DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => selectedContact && handleOpenEditDialog(selectedContact)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => selectedContact && handleDelete(selectedContact.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {selectedContact?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{selectedContact.phone}</span>
              </div>
            )}
            {selectedContact?.whatsappId && (
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span>{selectedContact.whatsappId}</span>
              </div>
            )}

            {/* Special Dates */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Datas Especiais
                </h4>
                <Button variant="ghost" size="sm" onClick={handleOpenAddDateDialog}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              {selectedContact?.specialDates && selectedContact.specialDates.length > 0 ? (
                <div className="space-y-2">
                  {selectedContact.specialDates.map((date) => (
                    <div key={date.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${SPECIAL_DATE_TYPE_COLORS[date.type]}`}>
                          {SPECIAL_DATE_TYPE_ICONS[date.type]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{SPECIAL_DATE_TYPE_LABELS[date.type]}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(date.date)} • {getNextOccurrence(date.date, date.recurrence)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditDateDialog(date)}>
                          <Edit className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSpecialDate(date.id)}>
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma data especial cadastrada
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Special Date Dialog */}
      <Dialog open={isAddDateDialogOpen} onOpenChange={setIsAddDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Data Especial</DialogTitle>
            <DialogDescription>Cadastre uma data importante para esta pessoa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dateType">Tipo de Data</Label>
              <select
                id="dateType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={dateFormData.type}
                onChange={(e) => setDateFormData({ ...dateFormData, type: e.target.value as SpecialDateType })}
              >
                {Object.entries(SPECIAL_DATE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" value={dateFormData.date} onChange={(e) => setDateFormData({ ...dateFormData, date: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recurrence">Recorrência</Label>
              <select
                id="recurrence"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={dateFormData.recurrence}
                onChange={(e) => setDateFormData({ ...dateFormData, recurrence: e.target.value as RecurrenceType })}
              >
                <option value="YEARLY">Anualmente</option>
                <option value="MONTHLY">Mensalmente</option>
                <option value="ONCE">Uma única vez</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDateDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button onClick={handleAddSpecialDate} disabled={isSaving || !dateFormData.date}>
              {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adicionando...</> : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Special Date Dialog */}
      <Dialog open={isEditDateDialogOpen} onOpenChange={setIsEditDateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Data Especial</DialogTitle>
            <DialogDescription>Atualize as informações desta data especial.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editDateType">Tipo de Data</Label>
              <select
                id="editDateType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={editDateFormData.type}
                onChange={(e) => setEditDateFormData({ ...editDateFormData, type: e.target.value as SpecialDateType })}
              >
                {Object.entries(SPECIAL_DATE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDate">Data</Label>
              <Input id="editDate" type="date" value={editDateFormData.date} onChange={(e) => setEditDateFormData({ ...editDateFormData, date: e.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editRecurrence">Recorrência</Label>
              <select
                id="editRecurrence"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={editDateFormData.recurrence}
                onChange={(e) => setEditDateFormData({ ...editDateFormData, recurrence: e.target.value as RecurrenceType })}
              >
                <option value="YEARLY">Anualmente</option>
                <option value="MONTHLY">Mensalmente</option>
                <option value="ONCE">Uma única vez</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDateDialogOpen(false)} disabled={isSaving}>Cancelar</Button>
            <Button onClick={handleUpdateSpecialDate} disabled={isSaving || !editDateFormData.date}>
              {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={(open) => {
        setIsImportDialogOpen(open)
        if (!open) {
          setImportPreview([])
          setImportReport(null)
          setImportFileName("")
          if (fileInputRef.current) fileInputRef.current.value = ""
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Contatos
            </DialogTitle>
            <DialogDescription>
              Importe até 100 contatos de uma vez usando arquivo CSV ou JSON.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={handleFileSelect}
              />
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">
                {importFileName || "Clique para selecionar um arquivo"}
              </p>
              <p className="text-xs text-muted-foreground">CSV ou JSON (máx. 100 contatos)</p>
            </div>

            {/* Preview */}
            {importPreview.length > 0 && !importReport && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{importPreview.length} contatos encontrados</p>
                  <Button variant="ghost" size="sm" onClick={() => { setImportPreview([]); setImportFileName(""); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {importPreview.slice(0, 5).map((entry, i) => (
                    <div key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {entry.name}
                      {entry.phone && <span className="text-muted-foreground/60">• {entry.phone}</span>}
                    </div>
                  ))}
                  {importPreview.length > 5 && (
                    <p className="text-xs text-muted-foreground">+{importPreview.length - 5} mais...</p>
                  )}
                </div>
              </div>
            )}

            {/* Import Report */}
            {importReport && (
              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Resultado da Importação</p>
                  <Badge variant={importReport.errors > 0 ? "destructive" : "default"}>
                    {importReport.success}/{importReport.total}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {importReport.success} sucesso
                  </span>
                  {importReport.errors > 0 && (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      {importReport.errors} erros
                    </span>
                  )}
                </div>
                {importReport.errorDetails.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {importReport.errorDetails.map((err, i) => (
                      <p key={i} className="text-xs text-red-500">
                        Linha {err.row}: {err.name || "(sem nome)"} — {err.reason}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Fechar
            </Button>
            {!importReport && importPreview.length > 0 && (
              <Button onClick={handleImport} disabled={isSaving} className="gap-2">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Importando...</> : "Importar Contatos"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contacts List */}
      {contacts.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "Nenhum contato encontrado" : "Nenhuma pessoa cadastrada"}
            </h3>
            <p className="text-muted-foreground mb-4 text-center max-w-sm">
              {searchQuery
                ? `Nenhum resultado para "${searchQuery}". Tente outro termo.`
                : "Cadastre pessoas queridas para nunca esquecer datas especiais como aniversários e casamentos."}
            </p>
            {!searchQuery && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importar
                </Button>
                <Button onClick={handleOpenAddDialog} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Pessoa
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleOpenDetail(contact)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{contact.name}</CardTitle>
                      {contact.specialDates && contact.specialDates.length > 0 && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {contact.specialDates.length} data{contact.specialDates.length > 1 ? "s" : ""}{" "}
                          especial{contact.specialDates.length > 1 ? "is" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  {contact.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </p>
                  )}
                  {contact.whatsappId && (
                    <p className="flex items-center gap-2">
                      <MessageCircle className="h-3 w-3" />
                      WhatsApp
                    </p>
                  )}
                  {!contact.phone && !contact.whatsappId && (
                    <p className="italic">Sem informações de contato</p>
                  )}
                </div>

                {contact.specialDates && contact.specialDates.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-1">
                    {contact.specialDates.slice(0, 2).map((date) => (
                      <p key={date.id} className="text-xs flex items-center gap-2 text-muted-foreground">
                        {SPECIAL_DATE_TYPE_ICONS[date.type]}
                        {SPECIAL_DATE_TYPE_LABELS[date.type]} •{" "}
                        {getNextOccurrence(date.date, date.recurrence)}
                      </p>
                    ))}
                    {contact.specialDates.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{contact.specialDates.length - 2} mais
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
