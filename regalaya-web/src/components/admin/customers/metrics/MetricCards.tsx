"use client"

import { CustomerMetrics } from "@/services"
import { DollarSign, ShoppingBag, TrendingUp, Calendar, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"

interface MetricCardsProps {
  metrics: CustomerMetrics
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      title: "LTV",
      value: formatPrice(metrics.ltv),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Lifetime Value"
    },
    {
      title: "Total Gasto",
      value: formatPrice(metrics.ltv),
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Valor total acumulado"
    },
    {
      title: "Pedidos",
      value: metrics.totalOrders.toString(),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Total de compras"
    },
    {
      title: "Frequência",
      value: `${metrics.purchaseFrequency}/mês`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Compras por mês"
    },
    {
      title: "Valor Médio",
      value: formatPrice(metrics.averageOrderValue),
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Por pedido"
    },
    {
      title: "Segmento",
      value: metrics.segment.label,
      icon: Target,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Classificação atual"
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {card.title}
                </span>
                <div className={`h-8 w-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <div className={`text-lg font-bold ${card.color}`}>
                {card.value}
              </div>
              <p className="text-xs text-gray-400 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}