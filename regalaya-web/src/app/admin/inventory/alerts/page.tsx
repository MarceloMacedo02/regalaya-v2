"use client"

import { StockAlerts } from "@/components/admin/inventory/stock-alerts"
import { useInventory } from "@/contexts/inventory-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, CheckCircle, TrendingUp, Package, Calendar, Clock } from "lucide-react"

export default function InventoryAlertsPage() {
  const { alerts, metrics, resolveAlert, ignoreAlert } = useInventory()

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId)
  }

  const handleIgnoreAlert = (alertId: string) => {
    ignoreAlert(alertId)
  }

  // Alertas por Tipo
  const alertsByType = {
    lowStock: alerts.filter(a => a.type === "low-stock" && a.status === "active").length,
    outOfStock: alerts.filter(a => a.type === "out-of-stock" && a.status === "active").length,
    expiry: alerts.filter(a => a.type === "expiry" && a.status === "active").length,
    restock: alerts.filter(a => a.type === "restock" && a.status === "active").length,
    overstock: alerts.filter(a => a.type === "overstock" && a.status === "active").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alertas de Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie alertas de estoque baixo, esgotados, validade e reposição
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeAlerts} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Requerem ação imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos (Alta/Média)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => (a.priority === "high" || a.priority === "medium") && a.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Atenção necessária
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.status === "resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter(a => a.status === "ignored").length} ignorados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas por Tipo */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{alertsByType.lowStock}</div>
              <p className="text-xs text-muted-foreground">Estoque Baixo</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{alertsByType.outOfStock}</div>
              <p className="text-xs text-muted-foreground">Esgotados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{alertsByType.expiry}</div>
              <p className="text-xs text-muted-foreground">Validade</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{alertsByType.restock}</div>
              <p className="text-xs text-muted-foreground">Reposição</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{alertsByType.overstock}</div>
              <p className="text-xs text-muted-foreground">Excesso</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      <StockAlerts
        alerts={alerts}
        onResolveAlert={handleResolveAlert}
        onIgnoreAlert={handleIgnoreAlert}
      />

      {/* Guia de Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Guia de Ações Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">Alertas Críticos</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Produtos esgotados: Repor urgentemente ou desativar anúncio</li>
                <li>• Estoque crítico: Acionar fornecedor imediatamente</li>
                <li>• Validade próxima: Promover venda com desconto</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600">Alertas Altos</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Estoque baixo: Programar compra para próxima semana</li>
                <li>• Ponto de reposição: Acionar reposição automática</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

