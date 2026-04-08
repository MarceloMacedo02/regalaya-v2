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
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  Package,
} from "lucide-react"
import type { StockMovement } from "@/types/inventory"
import { formatPrice } from "@/lib/utils"

interface LossesReportProps {
  movements: StockMovement[]
}

export function LossesReport({ movements }: LossesReportProps) {
  const [period, setPeriod] = useState<"30" | "60" | "90" | "all">("30")
  const [reasonFilter, setReasonFilter] = useState<string>("all")

  // Filtrar movimentações de perda e ajuste negativo
  const lossesMovements = movements.filter((m) => {
    const isLoss = m.type === "loss" || (m.type === "adjustment" && m.quantity < 0)
    const matchesReason = reasonFilter === "all" || m.reason === reasonFilter

    if (period !== "all") {
      const days = parseInt(period, 10)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const movementDate = new Date(m.createdAt)
      return isLoss && matchesReason && movementDate >= cutoffDate
    }

    return isLoss && matchesReason
  })

  // Agrupar por motivo
  const lossesByReason = lossesMovements.reduce((acc, movement) => {
    const reason = movement.reason
    if (!acc[reason]) {
      acc[reason] = {
        count: 0,
        quantity: 0,
        value: 0,
      }
    }
    acc[reason].count += 1
    acc[reason].quantity += Math.abs(movement.quantity)
    acc[reason].value += Math.abs(movement.totalValue)
    return acc
  }, {} as Record<string, { count: number; quantity: number; value: number }>)

  // Agrupar por produto
  const lossesByProduct = lossesMovements.reduce((acc, movement) => {
    if (!acc[movement.productId]) {
      acc[movement.productId] = {
        ...movement,
        totalQuantity: 0,
        totalValue: 0,
        occurrences: 0,
      }
    }
    acc[movement.productId].totalQuantity += Math.abs(movement.quantity)
    acc[movement.productId].totalValue += Math.abs(movement.totalValue)
    acc[movement.productId].occurrences += 1
    return acc
  }, {} as Record<string, StockMovement & { totalQuantity: number; totalValue: number; occurrences: number }>)

  const totalLosses = lossesMovements.reduce((acc, m) => acc + Math.abs(m.totalValue), 0)
  const totalQuantity = lossesMovements.reduce((acc, m) => acc + Math.abs(m.quantity), 0)

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      loss: "Perda",
      damage: "Dano",
      expiry: "Validade",
      adjustment: "Ajuste",
    }
    return labels[reason] || reason
  }

  const exportReport = () => {
    const headers = [
      "Data",
      "Produto",
      "SKU",
      "Tipo",
      "Motivo",
      "Quantidade",
      "Custo Unitário",
      "Valor Total",
      "Usuário",
      "Observações",
    ]

    const csvData = lossesMovements.map((m) => [
      new Date(m.createdAt).toLocaleDateString("pt-BR"),
      m.productName,
      m.sku,
      m.type,
      m.reason,
      Math.abs(m.quantity),
      m.unitCost,
      Math.abs(m.totalValue),
      m.userName,
      m.notes || "",
    ])

    const csv = [headers, ...csvData]
      .map((row) => row.join(";"))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-perdas-${period}dias.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatório de Perdas e Ajustes</h2>
          <p className="text-muted-foreground">
            Acompanhamento de perdas, danos e ajustes de estoque
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
          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="loss">Perda</SelectItem>
              <SelectItem value="damage">Dano</SelectItem>
              <SelectItem value="expiry">Validade</SelectItem>
              <SelectItem value="adjustment">Ajuste</SelectItem>
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
            <CardTitle className="text-sm font-medium">Valor Total Perdido</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatPrice(totalLosses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Período de {period} dias
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity}</div>
            <p className="text-xs text-muted-foreground">
              unidades perdidas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lossesMovements.length}</div>
            <p className="text-xs text-muted-foreground">
              registros de perda
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Ocorrência</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalLosses / (lossesMovements.length || 1))}
            </div>
            <p className="text-xs text-muted-foreground">
              valor médio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Perdas por Motivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Perdas por Motivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Ocorrências</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-right">% do Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(lossesByReason).map(([reason, data]) => (
                  <TableRow key={reason}>
                    <TableCell className="font-medium">
                      <Badge variant="secondary">{getReasonLabel(reason)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{data.count}</TableCell>
                    <TableCell className="text-right">{data.quantity} un.</TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {formatPrice(data.value)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {((data.value / totalLosses) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Produtos com Perdas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Produtos com Maiores Perdas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Ocorrências</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-right">Motivo Principal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(lossesByProduct)
                  .sort((a, b) => b.totalValue - a.totalValue)
                  .slice(0, 10)
                  .map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell className="text-right">{product.occurrences}</TableCell>
                      <TableCell className="text-right">{product.totalQuantity} un.</TableCell>
                      <TableCell className="text-right font-semibold text-red-600">
                        {formatPrice(product.totalValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {getReasonLabel(product.reason)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Últimas Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Últimas Movimentações de Perda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Qtd.</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lossesMovements.slice(0, 10).map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-sm">
                      {new Date(movement.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="font-medium">{movement.productName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getReasonLabel(movement.reason)}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      -{Math.abs(movement.quantity)} un.
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {formatPrice(Math.abs(movement.totalValue))}
                    </TableCell>
                    <TableCell>{movement.userName}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {movement.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
