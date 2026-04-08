"use client"

import { useState } from "react"
import { TurnoverReport } from "@/components/admin/inventory/reports/turnover-report"
import { LossesReport } from "@/components/admin/inventory/reports/losses-report"
import { useInventory } from "@/contexts/inventory-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  PieChart,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function InventoryReportsPage() {
  const { items, movements } = useInventory()
  const [activeReport, setActiveReport] = useState<"overview" | "turnover" | "losses">("overview")

  // Calcular métricas para visão geral
  const totalValue = items.reduce((acc, item) => acc + item.currentStock * item.unitCost, 0)
  const totalPotentialRevenue = items.reduce((acc, item) => acc + item.currentStock * item.salePrice, 0)
  const totalProfit = totalPotentialRevenue - totalValue
  const profitMargin = totalPotentialRevenue > 0 ? (totalProfit / totalPotentialRevenue) * 100 : 0

  const stockStatus = {
    available: items.filter(i => i.status === "available").length,
    low: items.filter(i => i.status === "low").length,
    outOfStock: items.filter(i => i.status === "out-of-stock").length,
  }

  const categoryBreakdown = items.reduce((acc, item) => {
    if (!acc[item.categoryName]) {
      acc[item.categoryName] = { count: 0, value: 0 }
    }
    acc[item.categoryName].count += 1
    acc[item.categoryName].value += item.currentStock * item.unitCost
    return acc
  }, {} as Record<string, { count: number; value: number }>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios de Estoque</h1>
          <p className="text-muted-foreground">
            Análises completas de giro, perdas, valor e desempenho de estoque
          </p>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="flex gap-2 border-b pb-4 overflow-x-auto">
        <Button
          variant={activeReport === "overview" ? "default" : "outline"}
          onClick={() => setActiveReport("overview")}
          className="whitespace-nowrap"
        >
          <PieChart className="h-4 w-4 mr-2" />
          Visão Geral
        </Button>
        <Button
          variant={activeReport === "turnover" ? "default" : "outline"}
          onClick={() => setActiveReport("turnover")}
          className="whitespace-nowrap"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Giro de Estoque
        </Button>
        <Button
          variant={activeReport === "losses" ? "default" : "outline"}
          onClick={() => setActiveReport("losses")}
          className="whitespace-nowrap"
        >
          <TrendingDown className="h-4 w-4 mr-2" />
          Perdas e Ajustes
        </Button>
      </div>

      {/* Visão Geral */}
      {activeReport === "overview" && (
        <>
          {/* Métricas Principais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Baseado no custo atual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Potencial</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalPotentialRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  Preço de venda total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lucro Potencial</CardTitle>
                <PieChart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalProfit)}</div>
                <p className="text-xs text-muted-foreground">
                  {profitMargin.toFixed(1)}% margem média
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{items.length}</div>
                <p className="text-xs text-muted-foreground">
                  {stockStatus.outOfStock} esgotados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status do Estoque */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Status do Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span>Disponível</span>
                    </div>
                    <Badge variant="success">{stockStatus.available} produtos</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span>Estoque Baixo</span>
                    </div>
                    <Badge variant="warning">{stockStatus.low} produtos</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span>Esgotado</span>
                    </div>
                    <Badge variant="destructive">{stockStatus.outOfStock} produtos</Badge>
                  </div>
                </div>

                {/* Barra de Progresso Visual */}
                <div className="mt-6">
                  <div className="flex h-4 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="bg-green-500"
                      style={{ width: `${items.length > 0 ? (stockStatus.available / items.length) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${items.length > 0 ? (stockStatus.low / items.length) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${items.length > 0 ? (stockStatus.outOfStock / items.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Valor por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryBreakdown)
                    .sort((a, b) => b[1].value - a[1].value)
                    .slice(0, 5)
                    .map(([category, data]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{category}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {data.count} itens
                          </span>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(data.value)}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas Resumidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Resumo de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="text-2xl font-bold text-red-600">
                    {items.filter(i => i.status === "out-of-stock").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Esgotados</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <div className="text-2xl font-bold text-orange-600">
                    {items.filter(i => i.status === "low").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Estoque Baixo</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="text-2xl font-bold text-blue-600">
                    {items.filter(i => i.thirdParty).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Terceiros</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="text-2xl font-bold text-green-600">
                    {items.filter(i => i.profitMargin >= 50).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Alta Margem</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Relatório de Giro */}
      {activeReport === "turnover" && (
        <TurnoverReport items={items} />
      )}

      {/* Relatório de Perdas */}
      {activeReport === "losses" && (
        <LossesReport movements={movements} />
      )}
    </div>
  )
}
