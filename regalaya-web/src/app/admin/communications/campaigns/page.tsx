"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, MessageSquare, Calendar, Users, Eye, Copy, Trash2, Loader2, Send, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED"

interface Campaign {
  id: string
  name: string
  type: "EMAIL" | "WHATSAPP"
  segment: string
  templateName: string
  status: CampaignStatus
  recipients: number
  scheduledDate: string | null
  createdAt: string
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Promoção Dia das Mães 2026",
    type: "EMAIL",
    segment: "Todos os Clientes",
    templateName: "Promoção Sazonal",
    status: "SCHEDULED",
    recipients: 1250,
    scheduledDate: "2026-05-01 09:00",
    createdAt: "2026-04-01",
  },
  {
    id: "2",
    name: "Boas-vindas novos clientes",
    type: "EMAIL",
    segment: "Clientes Novos",
    templateName: "Boas-vindas",
    status: "SENT",
    recipients: 95,
    scheduledDate: null,
    createdAt: "2026-03-28",
  },
  {
    id: "3",
    name: "Recuperação de clientes inativos",
    type: "WHATSAPP",
    segment: "Clientes Inativos",
    templateName: "Reativação",
    status: "DRAFT",
    recipients: 320,
    scheduledDate: null,
    createdAt: "2026-03-25",
  },
]

const STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> = {
  DRAFT: { label: "Rascunho", className: "admin-badge-secondary" },
  SCHEDULED: { label: "Agendada", className: "admin-badge-warning" },
  SENT: { label: "Enviada", className: "admin-badge-success" },
  CANCELLED: { label: "Cancelada", className: "bg-red-100 text-red-800" },
}

export default function CampaignsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id))
    toast({ title: "Campanha excluída", description: "A campanha foi removida com sucesso." })
  }

  const handleDuplicate = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: String(Date.now()),
      name: `${campaign.name} (cópia)`,
      status: "DRAFT",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCampaigns([...campaigns, newCampaign])
    toast({ title: "Campanha duplicada", description: "Uma cópia da campanha foi criada." })
  }

  const getTypeIcon = (type: "EMAIL" | "WHATSAPP") => {
    return type === "EMAIL" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas de Comunicação</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie suas campanhas de email e WhatsApp</p>
        </div>
        <Button onClick={() => router.push("/admin/communications/campaigns/new")} className="btn-elegant gap-1">
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total de Campanhas</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agendadas</span>
            <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">{campaigns.filter(c => c.status === "SCHEDULED").length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Enviadas</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Send className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{campaigns.filter(c => c.status === "SENT").length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Destinatários Total</span>
            <div className="h-9 w-9 rounded-lg bg-[#00A8E8]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#00A8E8]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{campaigns.reduce((acc, c) => acc + c.recipients, 0).toLocaleString("pt-BR")}</div>
        </div>
      </div>

      {/* Table */}
      <Card className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-600">Nome</TableHead>
              <TableHead className="font-semibold text-gray-600">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-600">Segmento</TableHead>
              <TableHead className="font-semibold text-gray-600">Destinatários</TableHead>
              <TableHead className="font-semibold text-gray-600">Status</TableHead>
              <TableHead className="font-semibold text-gray-600">Agendamento</TableHead>
              <TableHead className="text-right font-semibold text-gray-600">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FileText className="h-10 w-10" />
                    <p>Nenhuma campanha encontrada</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map(campaign => (
                <TableRow key={campaign.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-800">{campaign.name}</p>
                      <p className="text-xs text-gray-500">{campaign.templateName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      {getTypeIcon(campaign.type)}
                      {campaign.type === "EMAIL" ? "Email" : "WhatsApp"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{campaign.segment}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-900">{campaign.recipients.toLocaleString("pt-BR")}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_CONFIG[campaign.status].className}>
                      {STATUS_CONFIG[campaign.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {campaign.scheduledDate || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#003566]">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(campaign)} className="text-gray-400 hover:text-[#00A8E8]">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(campaign.id)} className="text-gray-400 hover:text-red-500">
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
    </div>
  )
}
