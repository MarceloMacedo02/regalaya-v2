"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Send, FileText, Users, Mail, MessageSquare, CheckCircle2 } from "lucide-react"
import type { CommunicationType } from "@/services/templates.service"
import type { CustomerSegment } from "@/hooks/useCampaignWizard"

interface SchedulingStepProps {
  campaignName: string
  onCampaignNameChange: (name: string) => void
  sendNow: boolean
  onSendNowChange: (sendNow: boolean) => void
  scheduledDate: string | null
  onScheduledDateChange: (date: string | null) => void
  scheduledTime: string | null
  onScheduledTimeChange: (time: string | null) => void
  customerSegment: CustomerSegment
  communicationType: CommunicationType
  templateName?: string
  estimatedRecipients?: number
  error?: string
}

const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  ALL: "Todos os Clientes",
  VIP: "Clientes VIP",
  NEW: "Clientes Novos",
  INACTIVE: "Clientes Inativos",
  CUSTOM: "Filtros Personalizados",
}

export function SchedulingStep({
  campaignName,
  onCampaignNameChange,
  sendNow,
  onSendNowChange,
  scheduledDate,
  onScheduledDateChange,
  scheduledTime,
  onScheduledTimeChange,
  customerSegment,
  communicationType,
  templateName,
  estimatedRecipients,
  error,
}: SchedulingStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Agendamento e Confirmação</h3>
        <p className="text-sm text-gray-500 mt-1">Revise os detalhes e agende sua campanha</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Campaign Name */}
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Nome da Campanha *</Label>
        <Input
          id="campaign-name"
          value={campaignName}
          onChange={(e) => onCampaignNameChange(e.target.value)}
          placeholder="Ex: Promoção Dia das Mães 2026"
        />
      </div>

      {/* Scheduling Options */}
      <Card>
        <CardContent className="pt-5">
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  sendNow ? "border-[#003566] bg-[#003566]/5" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onSendNowChange(true)}
              >
                <Send className={`h-5 w-5 mb-2 ${sendNow ? "text-[#003566]" : "text-gray-400"}`} />
                <p className={`font-semibold text-sm ${sendNow ? "text-[#003566]" : "text-gray-600"}`}>
                  Enviar Agora
                </p>
                <p className="text-xs text-gray-500 mt-1">Envio imediato para todos os selecionados</p>
              </button>
              <button
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  !sendNow ? "border-[#003566] bg-[#003566]/5" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onSendNowChange(false)}
              >
                <Calendar className={`h-5 w-5 mb-2 ${!sendNow ? "text-[#003566]" : "text-gray-400"}`} />
                <p className={`font-semibold text-sm ${!sendNow ? "text-[#003566]" : "text-gray-600"}`}>
                  Agendar para Depois
                </p>
                <p className="text-xs text-gray-500 mt-1">Escolha a data e hora do envio</p>
              </button>
            </div>

            {!sendNow && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scheduled-date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data
                  </Label>
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate || ""}
                    onChange={(e) => onScheduledDateChange(e.target.value || null)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled-time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hora
                  </Label>
                  <Input
                    id="scheduled-time"
                    type="time"
                    value={scheduledTime || ""}
                    onChange={(e) => onScheduledTimeChange(e.target.value || null)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-5">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Resumo da Campanha
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Campanha:</span>
              </div>
              <span className="font-medium text-gray-900">{campaignName || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>Segmento:</span>
              </div>
              <Badge variant="secondary">{SEGMENT_LABELS[customerSegment]}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                {communicationType === "EMAIL" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                <span>Canal:</span>
              </div>
              <span className="font-medium text-gray-900">{communicationType === "EMAIL" ? "Email" : "WhatsApp"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Template:</span>
              </div>
              <span className="font-medium text-gray-900">{templateName || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Agendamento:</span>
              </div>
              <span className="font-medium text-gray-900">
                {sendNow ? "Envio imediato" : scheduledDate && scheduledTime ? `${scheduledDate} às ${scheduledTime}` : "Não agendado"}
              </span>
            </div>
            {estimatedRecipients !== undefined && (
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="font-medium text-gray-700">Destinatários estimados:</span>
                <span className="font-bold text-[#003566]">{estimatedRecipients.toLocaleString("pt-BR")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
