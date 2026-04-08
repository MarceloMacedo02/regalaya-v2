"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, MessageSquare, Calendar, Users, Eye, Trash2, Loader2, Send, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { communicationsService, type CampaignStatus, type CommunicationCampaign } from "@/services/communications.service"

const STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> = {
  DRAFT: { label: "Rascunho", className: "admin-badge-secondary" },
  SCHEDULED: { label: "Agendada", className: "admin-badge-warning" },
  SENT: { label: "Enviada", className: "admin-badge-success" },
  CANCELLED: { label: "Cancelada", className: "bg-red-100 text-red-800" },
}

const SEGMENT_LABELS: Record<string, string> = {
  ALL: "Todos os Clientes",
  VIP: "Clientes VIP",
  NEW: "Clientes Novos",
  INACTIVE: "Clientes Inativos",
  CUSTOM: "Filtros Personalizados",
}

export default function CampaignsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<CommunicationCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true)
        const data = await communicationsService.listCampaigns()
        setCampaigns(data)
      } catch {
        toast({
          title: "Erro ao carregar campanhas",
          description: "Não foi possível carregar as campanhas.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCampaigns()
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      await communicationsService.deleteCampaign(id)
      setCampaigns((current) => current.filter((campaign) => campaign.id !== id))
      toast({ title: "Campanha excluída", description: "A campanha foi removida com sucesso." })
    } catch {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir a campanha.", variant: "destructive" })
    }
  }

  const getTypeIcon = (type: "EMAIL" | "WHATSAPP") => {
    return type === "EMAIL" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
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
          <div className="text-2xl font-bold text-amber-600">{campaigns.filter((c) => c.status === "SCHEDULED").length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Enviadas</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Send className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{campaigns.filter((c) => c.status === "SENT").length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Destinatários Total</span>
            <div className="h-9 w-9 rounded-lg bg-[#00A8E8]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#00A8E8]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((acc, campaign) => acc + campaign.recipientCount, 0).toLocaleString("pt-BR")}
          </div>
        </div>
      </div>

      <Card className="admin-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
                campaigns.map((campaign) => (
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
                      <span className="text-sm text-gray-600">{SEGMENT_LABELS[campaign.segmentCode] || campaign.segmentCode}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-900">{campaign.recipientCount.toLocaleString("pt-BR")}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_CONFIG[campaign.status].className}>
                        {STATUS_CONFIG[campaign.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{campaign.scheduledAt || "—"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-[#003566]"
                          onClick={() => router.push(`/admin/communications/campaigns/${campaign.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(campaign.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
