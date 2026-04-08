"use client"

import { CustomerProfile } from "@/services"
import { formatPrice, formatDate } from "@/lib/utils"
import { User, Mail, Phone, Calendar, DollarSign, ShoppingBag, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CustomerSidebarProps {
  customer: CustomerProfile
}

export default function CustomerSidebar({ customer }: CustomerSidebarProps) {
  const getSegmentBadgeVariant = (color: string) => {
    switch (color) {
      case "#FFD700": return "default"
      case "#22C55E": return "secondary"
      case "#6B7280": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Card principal - Foto e informações */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-[#003566]/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-[#003566]">
                {customer.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
          </div>
          <CardTitle className="text-lg">{customer.name}</CardTitle>
          <Badge
            variant={getSegmentBadgeVariant(customer.segmentColor)}
            className="mt-2"
            style={{ backgroundColor: customer.segmentColor, color: '#fff' }}
          >
            {customer.segmentLabel}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">{customer.email || "-"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">{customer.phone || "-"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">
              {customer.createdAt ? formatDate(customer.createdAt) : "-"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Award className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700">Plano: {customer.plan}</span>
          </div>
        </CardContent>
      </Card>

      {/* Card de métricas resumidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métricas Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">LTV</span>
            <span className="font-semibold text-green-600">{formatPrice(customer.metrics.ltv)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Gasto</span>
            <span className="font-semibold">{formatPrice(customer.metrics.ltv)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Pedidos</span>
            <span className="font-semibold">{customer.metrics.totalOrders}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Frequência</span>
            <span className="font-semibold">{customer.metrics.purchaseFrequency}/mês</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Última Compra</span>
            <span className="font-semibold text-xs">
              {customer.metrics.lastPurchaseDate
                ? formatDate(customer.metrics.lastPurchaseDate)
                : "Nunca"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card de Categoria Favorita */}
      {customer.metrics.favoriteCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Categoria Preferida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{customer.metrics.favoriteCategory}</span>
              <Badge variant="outline">
                {customer.metrics.categorySpentPercentage.toFixed(1)}% do LTV
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card de segmentação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Segmentação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">{customer.metrics.segment.description}</p>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: customer.segmentColor }}
            />
            <span className="text-sm text-gray-700">{customer.metrics.segment.label}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}