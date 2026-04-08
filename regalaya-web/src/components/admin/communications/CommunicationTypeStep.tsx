"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, AlertTriangle } from "lucide-react"
import type { CommunicationType } from "@/services/templates.service"

interface CommunicationTypeStepProps {
  selectedType: CommunicationType
  onTypeChange: (type: CommunicationType) => void
  error?: string
}

const COMMUNICATION_TYPES = [
  {
    key: "EMAIL" as CommunicationType,
    label: "Email Marketing",
    description: "Envie emails personalizados com templates ricos em conteúdo",
    icon: Mail,
    color: "bg-[#00A8E8]",
    limits: {
      dailyLimit: "10.000 emails/dia",
      maxContent: "Sem limite de caracteres",
      features: ["HTML rico", "Imagens", "Links", "Variáveis dinâmicas"],
    },
  },
  {
    key: "WHATSAPP" as CommunicationType,
    label: "WhatsApp",
    description: "Mensagens diretas via WhatsApp Business API",
    icon: MessageSquare,
    color: "bg-green-500",
    limits: {
      dailyLimit: "1.000 mensagens/dia",
      maxContent: "160 caracteres por mensagem",
      features: ["Texto simples", "Variáveis dinâmicas", "Entrega rápida"],
    },
  },
]

export function CommunicationTypeStep({ selectedType, onTypeChange, error }: CommunicationTypeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Tipo de Comunicação</h3>
        <p className="text-sm text-gray-500 mt-1">Escolha o canal de envio da campanha</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {COMMUNICATION_TYPES.map(type => {
          const Icon = type.icon
          const isSelected = selectedType === type.key
          return (
            <Card
              key={type.key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-[#003566] border-[#003566]" : "border-gray-200"
              }`}
              onClick={() => onTypeChange(type.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onTypeChange(type.key)}
              aria-selected={isSelected}
            >
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className={`h-12 w-12 rounded-lg ${type.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{type.label}</p>
                      {isSelected && <Badge className="bg-[#003566]">Selecionado</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{type.description}</p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        <span>Limite: {type.limits.dailyLimit}</span>
                      </div>
                      <p className="text-xs text-gray-500">Conteúdo: {type.limits.maxContent}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {type.limits.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-[10px]">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Atenção</p>
            <p className="text-xs text-amber-700 mt-1">
              O tipo de comunicação deve ser compatível com o template selecionado.
              Templates de email não podem ser usados para WhatsApp e vice-versa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
