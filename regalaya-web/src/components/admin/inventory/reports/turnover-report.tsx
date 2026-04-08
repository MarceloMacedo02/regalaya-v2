"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Download,
  Calendar,
} from "lucide-react"
import type { InventoryItem } from "@/types/inventory"
import { formatPrice } from "@/lib/utils"

interface TurnoverReportProps {
  items: InventoryItem[]
}

export function TurnoverReport({ items }: TurnoverReportProps) {
  const [period, setPeriod] = useState<"30" | "60" | "90">("30")

  // Simulação de dados de giro baseados no estoque atual
  const turnoverData = items.map((item) => {
    // Simula vendas baseadas no status do estoque
    let simulatedSales = 0
    if (item.status === "out-of-stock") {
      simulatedSales = item.maxStock // Vendeu tudo
    } else if (item.status === "low") {
      simulatedSales = item.maxStock - item.currentStock
    } else {
      simulatedSales = Math.floor((item.maxStock - item.currentStock) * 0.5)
    }

    const turnoverRate = item.maxStock > 0 
      ? (simulatedSales / item.maxStock) * 100 
      : 0

    const revenue = simulatedSales * item.salePrice
    const profit = simulatedSales * (item.salePrice - item.unitCost)

    return {
      ...item,
      simulatedSales,
      turnoverRate,
      revenue,
      profit,
    }
  }).sort((a, b) => b.simulatedSales - a.simulatedSales)

  const topProducts = turnoverData.slice(0, 10)
  const slowProducts = turnoverData.filter((item) => item.turnoverRate < 20).slice(0, 10)

  const totalRevenue = turnoverData.reduce((acc, item) => acc + item.revenue, 0)
  const totalProfit = turnoverData.reduce((acc, item) => acc + item.profit, 0)
  const averageTurnover = turnoverData.reduce((acc, item) => acc + item.turnoverRate, 0) / turnoverData.length

  const exportReport = () => {
    const headers = [
      "Produto",
      "SKU",
      "Categoria",
      "Vendas Simuladas",
      "Giro (%)",
      "Receita",
      "Lucro",
      "Margem",
    ]

    const csvData = turnoverData.map((item) => [
      item.productName,
      item.sku,
      item.categoryName,
      item.simulatedSales,
      `${item.turnoverRate.toFixed(2)}%`,
      item.revenue,
      item.profit,
      `${item.profitMargin}%`,
    ])

    const csv = [headers, ...csvData]
      .map((row) => row.join(";"))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-giro-${period}dias.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatório de Giro de Estoque</h2>
          <p className="text-muted-foreground">
            Análise de produtos mais vendidos e giro de estoque
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(v) => setPeriod(v as "30" | "60" | "90")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="60">Últimos 60 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Período de {period} dias
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalProfit / totalRevenue) * 100).toFixed(1)}% margem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giro Médio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTurnover.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              dos produtos em estoque
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{turnoverData.length}</div>
            <p className="text-xs text-muted-foreground">
              produtos analisados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Top 10 Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Vendas</TableHead>
                  <TableHead className="text-right">Giro (%)</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                  <TableHead className="text-right">Lucro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        index < 3 
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.categoryName}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.simulatedSales} un.
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.turnoverRate > 50 ? "success" : "default"}>
                        {item.turnoverRate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(item.revenue)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatPrice(item.profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Produtos com Baixo Giro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-amber-600" />
            Produtos com Baixo Giro (Parados)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slowProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <p>Todos os produtos estão com giro adequado</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead className="text-right">Vendas</TableHead>
                    <TableHead className="text-right">Giro (%)</TableHead>
                    <TableHead className="text-right">Valor Estocado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slowProducts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.categoryName}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.status === "out-of-stock" ? "destructive" : "warning"}>
                          {item.currentStock} un.
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.simulatedSales} un.
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="warning">{item.turnoverRate.toFixed(1)}%</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(item.currentStock * item.unitCost)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
