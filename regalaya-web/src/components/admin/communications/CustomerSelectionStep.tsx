"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Star, UserPlus, UserMinus, Filter } from "lucide-react"
import type { CustomerSegment } from "@/hooks/useCampaignWizard"

interface CustomerSelectionStepProps {
  selectedSegment: CustomerSegment
  onSegmentChange: (segment: CustomerSegment) => void
  error?: string
  customerCount?: number
}

const SEGMENTS = [
  {
    key: "ALL" as CustomerSegment,
    label: "Todos os Clientes",
    description: "Envie para toda a base de clientes",
    icon: Users,
    color: "bg-[#003566]",
    estimatedCount: 1250,
  },
  {
    key: "VIP" as CustomerSegment,
    label: "Clientes VIP",
    description: "Clientes com alto valor de compra e frequência",
    icon: Star,
    color: "bg-amber-500",
    estimatedCount: 180,
  },
  {
    key: "NEW" as CustomerSegment,
    label: "Clientes Novos",
    description: "Clientes cadastrados nos últimos 30 dias",
    icon: UserPlus,
    color: "bg-green-500",
    estimatedCount: 95,
  },
  {
    key: "INACTIVE" as CustomerSegment,
    label: "Clientes Inativos",
    description: "Clientes sem compras nos últimos 90 dias",
    icon: UserMinus,
    color: "bg-red-500",
    estimatedCount: 320,
  },
  {
    key: "CUSTOM" as CustomerSegment,
    label: "Filtros Personalizados",
    description: "Defina critérios específicos de segmentação",
    icon: Filter,
    color: "bg-[#00A8E8]",
    estimatedCount: null,
  },
]

export function CustomerSelectionStep({ selectedSegment, onSegmentChange, error, customerCount }: CustomerSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Seleção de Clientes</h3>
        <p className="text-sm text-gray-500 mt-1">Escolha o segmento de clientes que receberá esta campanha</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {SEGMENTS.map(segment => {
          const Icon = segment.icon
          const isSelected = selectedSegment === segment.key
          return (
            <Card
              key={segment.key}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-[#003566] border-[#003566]" : "border-gray-200"
              }`}
              onClick={() => onSegmentChange(segment.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSegmentChange(segment.key)}
              aria-selected={isSelected}
            >
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg ${segment.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{segment.label}</p>
                      {isSelected && <Badge className="bg-[#003566]">Selecionado</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{segment.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      ~{segment.estimatedCount?.toLocaleString("pt-BR") || "—"} clientes estimados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {customerCount !== undefined && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
          <span className="text-sm font-medium text-blue-800">Clientes selecionados:</span>
          <span className="text-lg font-bold text-blue-900">{customerCount.toLocaleString("pt-BR")}</span>
        </div>
      )}
    </div>
  )
}
