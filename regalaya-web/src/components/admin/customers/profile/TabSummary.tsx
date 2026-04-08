"use client"

import { useEffect, useState } from "react"
import { customersService, type CustomerMetrics } from "@/services"
import MetricCards from "@/components/admin/customers/metrics/MetricCards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, ShoppingBag, Target, TrendingUp } from "lucide-react"
import { cn, formatPrice, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface TabSummaryProps {
  customerId: string
  metrics: CustomerMetrics
}

export default function TabSummary({ customerId, metrics: initialMetrics }: TabSummaryProps) {
  const { toast } = useToast()
  const [metrics, setMetrics] = useState<CustomerMetrics>(initialMetrics)
  const [isRecalculating, setIsRecalculating] = useState(false)

  const fetchMetrics = async () => {
    try {
      const profile = await customersService.getCustomerProfile(customerId)
      setMetrics(profile.metrics)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as métricas.",
        variant: "destructive",
      })
    }
  }

  const handleRecalculate = async () => {
    setIsRecalculating(true)
    try {
      await customersService.recalculateCustomerSegmentation(customerId)
      await fetchMetrics()
      toast({
        title: "Sucesso",
        description: "Métricas recalculadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao recalcular métricas.",
        variant: "destructive",
      })
    } finally {
      setIsRecalculating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header da aba */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Resumo do Cliente</h2>
          <p className="text-sm text-gray-500">Visão geral das métricas e segmentação</p>
        </div>
        <Button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRecalculating && "animate-spin")} />
          {isRecalculating ? "Recalculando..." : "Recalcular"}
        </Button>
      </div>

      {/* Cards de métricas */}
      <MetricCards metrics={metrics} />

      {/* Informações detalhadas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Segmentação */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-[#003566]" />
              Segmentação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Segmento</span>
              <span
                className="px-2.5 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: metrics.segment.color }}
              >
                {metrics.segment.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Descrição</span>
              <span className="text-sm text-gray-700">{metrics.segment.description}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-sm font-medium",
                metrics.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {metrics.isActive ? "Ativo" : "Inativo"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Compras */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              Histórico de Compras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total de Pedidos</span>
              <span className="font-semibold text-gray-900">{metrics.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Frequência</span>
              <span className="font-semibold text-gray-900">{metrics.purchaseFrequency} pedidos/mês</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Última Compra</span>
              <span className="font-semibold text-gray-900">
                {metrics.lastPurchaseDate ? formatDate(metrics.lastPurchaseDate) : "Nunca"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Dias desde última</span>
              <span className="font-semibold text-gray-900">
                {metrics.daysSinceLastPurchase != null
                  ? `${metrics.daysSinceLastPurchase} dias`
                  : "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Categoria Preferida */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Categoria Mais Comprada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.favoriteCategory ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Categoria</span>
                  <span className="font-semibold text-gray-900">{metrics.favoriteCategory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Participação no LTV</span>
                  <span className="font-semibold text-green-600">
                    {metrics.categorySpentPercentage.toFixed(1)}%
                  </span>
                </div>
                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${metrics.categorySpentPercentage}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma categoria identificada ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Valor Médio por Pedido</span>
              <span className="font-semibold text-gray-900">{formatPrice(metrics.averageOrderValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Lifetime Value (LTV)</span>
              <span className="font-semibold text-green-600">{formatPrice(metrics.ltv)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
