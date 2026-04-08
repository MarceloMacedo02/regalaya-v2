"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Edit,
  Package,
  TrendingUp,
  Filter,
  X,
  Plus,
} from "lucide-react"
import type { InventoryItem, StockStatus, MovementReason } from "@/types/inventory"
import { formatPrice } from "@/lib/utils"

interface InventoryTableProps {
  items: InventoryItem[]
  onEditItem?: (item: InventoryItem) => void
  onAdjustStock?: (item: InventoryItem, adjustment: number, reason: MovementReason, notes?: string) => void
  initialStatusFilter?: string
}

export function InventoryTable({ items, onEditItem, onAdjustStock, initialStatusFilter = "all" }: InventoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustmentValue, setAdjustmentValue] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const [adjustmentNotes, setAdjustmentNotes] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Sincronizar filtro quando inicialStatusFilter mudar (via dashboard)
  useEffect(() => {
    if (initialStatusFilter && initialStatusFilter !== statusFilter) {
      setStatusFilter(initialStatusFilter)
    }
  }, [initialStatusFilter, statusFilter])

  const categories = Array.from(new Set(items.map((item) => item.categoryName)))

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter
    const matchesCategory =
      categoryFilter === "all" || item.categoryName === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: StockStatus) => {
    const variants = {
      available: "success",
      low: "warning",
      "out-of-stock": "destructive",
      reserved: "secondary",
    } as const

    const labels = {
      available: "Disponível",
      low: "Baixo",
      "out-of-stock": "Esgotado",
      reserved: "Reservado",
    } as const

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getStockLevelBadge = (item: InventoryItem) => {
    const percentage = item.maxStock > 0 
      ? (item.currentStock / item.maxStock) * 100 
      : 0

    const getColor = (p: number) => {
      if (p >= 80) return "bg-green-500"
      if (p >= 50) return "bg-yellow-500"
      if (p > 0) return "bg-orange-500"
      return "bg-red-500"
    }

    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div 
            className={`h-full ${getColor(percentage)} transition-all`} 
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{Math.round(percentage)}%</span>
      </div>
    )
  }

  const handleAdjustClick = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustmentReason("adjustment")
    setAdjustmentDialogOpen(true)
  }

  const handleQuickAdjust = (item: InventoryItem, amount: number) => {
    if (onAdjustStock) {
      onAdjustStock(item, amount, "adjustment", "Ajuste rápido via tabela")
    }
  }

  const handleConfirmAdjustment = () => {
    if (selectedItem && adjustmentValue && adjustmentReason && onAdjustStock) {
      const adjustment = parseInt(adjustmentValue, 10)
      const validReasons: MovementReason[] = [
        'purchase', 'sale', 'return', 'adjustment', 'transfer-in', 'transfer-out', 'loss', 'damage', 'expiry', 'inventory-count'
      ]
      if (validReasons.includes(adjustmentReason as MovementReason)) {
        onAdjustStock(selectedItem, adjustment, adjustmentReason as MovementReason, adjustmentNotes)
        setAdjustmentDialogOpen(false)
        setAdjustmentValue("")
        setAdjustmentReason("")
        setAdjustmentNotes("")
        setSelectedItem(null)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos em Estoque
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link href="/admin/inventory/reports">
                <TrendingUp className="h-4 w-4 mr-2" />
                Relatórios
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showFilters ? "secondary" : "outline"} 
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                title="Mais filtros"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button asChild variant="default" className="hidden sm:flex">
                <Link href="/admin/inventory/products">
                  Novo Produto
                </Link>
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-dashed animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="low">Baixo</SelectItem>
                    <SelectItem value="out-of-stock">Esgotado</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end pb-0.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => {
                    setStatusFilter("all")
                    setCategoryFilter("all")
                    setSearchQuery("")
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tabela */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="w-[250px]">Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Preços</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-12 w-12 opacity-20" />
                      <p>Nenhum produto encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div className="font-medium text-sm">{item.productName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] h-4 py-0 font-normal">
                          {item.categoryName}
                        </Badge>
                        {item.thirdParty && (
                          <span className="text-[10px] text-muted-foreground italic">
                            via {item.supplierName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-muted-foreground">
                      {item.sku}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">
                            {item.currentStock}
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            mín {item.minStock}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-5 w-5 rounded-sm"
                            onClick={() => handleQuickAdjust(item, 1)}
                            title="Adicionar 1"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-5 w-5 rounded-sm"
                            onClick={() => handleQuickAdjust(item, -1)}
                            disabled={item.currentStock <= 0}
                            title="Remover 1"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        {getStatusBadge(item.status)}
                        {getStockLevelBadge(item)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-muted-foreground">C: {formatPrice(item.unitCost)}</span>
                        <span className="font-semibold text-primary">V: {formatPrice(item.salePrice)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`text-[10px] ${item.profitMargin >= 50 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}`}
                      >
                        {item.profitMargin}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEditItem?.(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary"
                          onClick={() => handleAdjustClick(item)}
                          title="Ajuste manual"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialog de Ajuste de Estoque */}
        <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajustar Estoque</DialogTitle>
              <DialogDescription>
                {selectedItem?.productName} - {selectedItem?.sku}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estoque Atual</Label>
                  <div className="text-2xl font-bold">{selectedItem?.currentStock} un.</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjustment">Ajuste (+/-)</Label>
                  <Input
                    id="adjustment"
                    type="number"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                    placeholder="ex: 10 ou -5"
                    className="font-mono"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo do Ajuste</Label>
                <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Entrada de Compra</SelectItem>
                    <SelectItem value="sale">Saída por Venda</SelectItem>
                    <SelectItem value="return">Devolução de Cliente</SelectItem>
                    <SelectItem value="adjustment">Ajuste de Inventário</SelectItem>
                    <SelectItem value="loss">Perda/Dano/Extravio</SelectItem>
                    <SelectItem value="expiry">Validade Vencida</SelectItem>
                    <SelectItem value="transfer-in">Transferência (Entrada)</SelectItem>
                    <SelectItem value="transfer-out">Transferência (Saída)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações / Notas</Label>
                <textarea
                  id="notes"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={3}
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  placeholder="Informações adicionais sobre esta movimentação..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAdjustmentDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmAdjustment}
                disabled={!adjustmentValue || !adjustmentReason}
              >
                Confirmar Ajuste
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
