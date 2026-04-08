"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  RotateCcw,
  AlertTriangle,
  Package,
  Search,
  Filter,
  Download,
} from "lucide-react"
import type { StockMovement, MovementType } from "@/types/inventory"
import { formatPrice } from "@/lib/utils"

interface StockMovementsProps {
  movements: StockMovement[]
}

export function StockMovementsList({ movements }: StockMovementsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [reasonFilter, setReasonFilter] = useState<string>("all")
  const [periodFilter, setPeriodFilter] = useState<string>("7")

  const getTypeIcon = (type: MovementType) => {
    switch (type) {
      case "in":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "out":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      case "adjustment":
        return <Plus className="h-4 w-4 text-blue-600" />
      case "transfer":
        return <RotateCcw className="h-4 w-4 text-purple-600" />
      case "return":
        return <RotateCcw className="h-4 w-4 text-orange-600" />
      case "loss":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
    }
  }

  const getTypeBadge = (type: MovementType) => {
    const variants = {
      in: "success",
      out: "destructive",
      adjustment: "secondary",
      transfer: "outline",
      return: "outline",
      loss: "warning",
    } as const

    const labels = {
      in: "Entrada",
      out: "Saída",
      adjustment: "Ajuste",
      transfer: "Transferência",
      return: "Devolução",
      loss: "Perda",
    } as const

    return (
      <Badge variant={variants[type]} className="gap-1">
        {getTypeIcon(type)}
        {labels[type]}
      </Badge>
    )
  }

  const getReasonLabel = (reason: StockMovement["reason"]) => {
    const labels = {
      purchase: "Compra",
      sale: "Venda",
      return: "Devolução",
      adjustment: "Ajuste",
      "transfer-in": "Transferência (entrada)",
      "transfer-out": "Transferência (saída)",
      loss: "Perda",
      damage: "Dano",
      expiry: "Validade",
      "inventory-count": "Inventário",
    }
    return labels[reason]
  }

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.userName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || movement.type === typeFilter
    const matchesReason = reasonFilter === "all" || movement.reason === reasonFilter

    if (periodFilter !== "all") {
      const days = parseInt(periodFilter, 10)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const movementDate = new Date(movement.createdAt)
      return matchesSearch && matchesType && matchesReason && movementDate >= cutoffDate
    }

    return matchesSearch && matchesType && matchesReason
  })

  const exportToCSV = () => {
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
      "Observações",
    ]

    const csvData = filteredMovements.map((m) => [
      new Date(m.createdAt).toLocaleDateString("pt-BR"),
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
      m.notes || "",
    ])

    const csv = [headers, ...csvData]
      .map((row) => row.join(";"))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `movimentacoes-estoque-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Movimentações de Estoque
          </div>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por produto, SKU ou usuário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="in">Entrada</SelectItem>
                <SelectItem value="out">Saída</SelectItem>
                <SelectItem value="adjustment">Ajuste</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
                <SelectItem value="return">Devolução</SelectItem>
                <SelectItem value="loss">Perda</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="purchase">Compra</SelectItem>
                <SelectItem value="sale">Venda</SelectItem>
                <SelectItem value="return">Devolução</SelectItem>
                <SelectItem value="adjustment">Ajuste</SelectItem>
                <SelectItem value="loss">Perda</SelectItem>
                <SelectItem value="damage">Dano</SelectItem>
                <SelectItem value="expiry">Validade</SelectItem>
              </SelectContent>
            </Select>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd.</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Referência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-12 w-12" />
                      <p>Nenhuma movimentação encontrada</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-sm">
                      <div>{new Date(movement.createdAt).toLocaleDateString("pt-BR")}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(movement.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(movement.type)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{movement.productName}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {movement.sku}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 font-semibold ${
                        movement.quantity > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {movement.quantity > 0 ? (
                          <Plus className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {Math.abs(movement.quantity)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-muted-foreground">{movement.previousStock}</span>
                        <span className="mx-1">→</span>
                        <span className="font-semibold">{movement.newStock}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(Math.abs(movement.totalValue))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getReasonLabel(movement.reason)}</Badge>
                    </TableCell>
                    <TableCell>{movement.userName}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {movement.referenceId || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumo */}
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Total Movimentações</div>
              <div className="text-2xl font-bold">{filteredMovements.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Entradas</div>
              <div className="text-2xl font-bold text-green-600">
                {filteredMovements.filter((m) => m.type === "in").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Saídas</div>
              <div className="text-2xl font-bold text-red-600">
                {filteredMovements.filter((m) => m.type === "out").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-2xl font-bold">
                {formatPrice(
                  filteredMovements.reduce((acc, m) => acc + Math.abs(m.totalValue), 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
