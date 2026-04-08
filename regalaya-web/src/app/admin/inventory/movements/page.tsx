"use client"

import { StockMovementsList } from "@/components/admin/inventory/stock-movements"
import { useInventory } from "@/contexts/inventory-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  AlertTriangle,
  Plus,
  Package,
  Download,
  Filter,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function InventoryMovementsPage() {
  const { movements } = useInventory()

  // Calcular estatísticas
  const movementStats = {
    total: movements.length,
    in: movements.filter(m => m.type === "in").length,
    out: movements.filter(m => m.type === "out").length,
    adjustment: movements.filter(m => m.type === "adjustment").length,
    transfer: movements.filter(m => m.type === "transfer").length,
    return: movements.filter(m => m.type === "return").length,
    loss: movements.filter(m => m.type === "loss").length,
  }

  const totalValueIn = movements
    .filter(m => m.type === "in")
    .reduce((acc, m) => acc + m.totalValue, 0)

  const totalValueOut = movements
    .filter(m => m.type === "out")
    .reduce((acc, m) => acc + Math.abs(m.totalValue), 0)

  const handleExportMovements = () => {
    const headers = [
      "Data",
      "Tipo",
      "Produto",
      "SKU",
      "Quantidade",
      "Estoque Anterior",
      "Estoque Atual",
      "Custo Unitário",
      "Valor Total",
      "Motivo",
      "Usuário",
      "Referência",
      "Observações",
    ]

    const csvData = movements.map((m) => [
      new Date(m.createdAt).toLocaleString("pt-BR"),
      m.type,
      m.productName,
      m.sku,
      m.quantity,
      m.previousStock,
      m.newStock,
      m.unitCost,
      m.totalValue,
      m.reason,
      m.userName,
      m.referenceId || "",
      m.notes || "",
    ])

    const csv = [headers, ...csvData]
      .map((row) => row.join(";"))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `movimentacoes-estoque-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Movimentações de Estoque</h1>
          <p className="text-muted-foreground">
            Histórico completo de todas as entradas, saídas e ajustes de estoque
          </p>
        </div>
        <Button onClick={handleExportMovements} disabled={movements.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Completo
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movimentações</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movementStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Histórico da sessão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{movementStats.in}</div>
            <p className="text-xs text-muted-foreground">
              {formatPrice(totalValueIn)} em valor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{movementStats.out}</div>
            <p className="text-xs text-muted-foreground">
              {formatPrice(totalValueOut)} em valor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ajustes e Perdas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {movementStats.adjustment + movementStats.loss}
            </div>
            <p className="text-xs text-muted-foreground">
              {movementStats.adjustment} ajustes, {movementStats.loss} perdas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tipos de Movimentação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Tipos de Movimentação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card">
              <ArrowUpRight className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-2xl font-bold">{movementStats.in}</span>
              <span className="text-sm text-muted-foreground">Entradas</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card">
              <ArrowDownRight className="h-6 w-6 text-red-600 mb-2" />
              <span className="text-2xl font-bold">{movementStats.out}</span>
              <span className="text-sm text-muted-foreground">Saídas</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card">
              <Plus className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-2xl font-bold">{movementStats.adjustment}</span>
              <span className="text-sm text-muted-foreground">Ajustes</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card">
              <RotateCcw className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-2xl font-bold">{movementStats.transfer}</span>
              <span className="text-sm text-muted-foreground">Transferências</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card">
              <RotateCcw className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-2xl font-bold">{movementStats.return}</span>
              <span className="text-sm text-muted-foreground">Devoluções</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border bg-card">
              <AlertTriangle className="h-6 w-6 text-amber-600 mb-2" />
              <span className="text-2xl font-bold">{movementStats.loss}</span>
              <span className="text-sm text-muted-foreground">Perdas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Movimentações */}
      <StockMovementsList movements={movements} />
    </div>
  )
}
