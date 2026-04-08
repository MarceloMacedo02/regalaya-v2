"use client"

import { InventoryTable } from "@/components/admin/inventory/inventory-table"
import { useInventory } from "@/contexts/inventory-context"
import type { InventoryItem, MovementReason } from "@/types/inventory"

export default function InventoryProductsPage() {
  const { items, updateItem, adjustStock } = useInventory()

  const handleEditItem = (item: InventoryItem) => {
    updateItem(item)
  }

  const handleAdjustStock = (item: InventoryItem, adjustment: number, reason: MovementReason, notes?: string) => {
    adjustStock(item.id, adjustment, reason, notes)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos em Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie todos os produtos, quantidades e informações de estoque
          </p>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <InventoryTable
        items={items}
        onEditItem={handleEditItem}
        onAdjustStock={handleAdjustStock}
      />
    </div>
  )
}

