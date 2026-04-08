"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from "react"
import { 
  inventoryItems as initialItems, 
  stockMovements as initialMovements, 
  stockAlerts as initialAlerts,
} from "@/lib/mock-inventory-data"
import type {
  InventoryItem,
  StockMovement,
  StockAlert,
  StockStatus,
  MovementReason
} from "@/types/inventory"

interface InventoryMetrics {
  totalProducts: number
  totalValue: number
  lowStockProducts: number
  outOfStockProducts: number
  thirdPartyProducts: number
  activeAlerts: number
  criticalAlerts: number
  totalMovements: number
}

interface InventoryContextType {
  items: InventoryItem[]
  movements: StockMovement[]
  alerts: StockAlert[]
  metrics: InventoryMetrics
  adjustStock: (itemId: string, adjustment: number, reason: MovementReason, notes?: string) => void
  resolveAlert: (alertId: string) => void
  ignoreAlert: (alertId: string) => void
  updateItem: (item: InventoryItem) => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems)
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements)
  const [alerts, setAlerts] = useState<StockAlert[]>(initialAlerts)

  const metrics = useMemo(() => {
    const totalProducts = items.length
    const totalValue = items.reduce((acc, item) => acc + (item.currentStock * item.unitCost), 0)
    const lowStockProducts = items.filter((item) => item.status === 'low').length
    const outOfStockProducts = items.filter((item) => item.status === 'out-of-stock').length
    const thirdPartyProducts = items.filter((item) => item.thirdParty).length
    const activeAlerts = alerts.filter((a) => a.status === 'active').length
    const criticalAlerts = alerts.filter((a) => a.priority === 'critical' && a.status === 'active').length
    const totalMovements = movements.length

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
      thirdPartyProducts,
      activeAlerts,
      criticalAlerts,
      totalMovements
    }
  }, [items, alerts, movements])

  const getStockStatus = (current: number, min: number): StockStatus => {
    if (current <= 0) return 'out-of-stock'
    if (current <= min) return 'low'
    return 'available'
  }

  const adjustStock = useCallback((itemId: string, adjustment: number, reason: MovementReason, notes?: string) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.currentStock + adjustment)
          const previousStock = item.currentStock
          
          // Criar movimentação
          const newMovement: StockMovement = {
            id: `mov-${Date.now()}`,
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            type: adjustment > 0 ? 'in' : 'out',
            quantity: Math.abs(adjustment),
            previousStock,
            newStock,
            unitCost: item.unitCost,
            totalValue: Math.abs(adjustment) * item.unitCost,
            reason,
            notes,
            userId: 'user-admin',
            userName: 'Administrador',
            createdAt: new Date().toISOString()
          }
          
          setMovements(prev => [newMovement, ...prev])
          
          return {
            ...item,
            currentStock: newStock,
            status: getStockStatus(newStock, item.minStock),
            lastUpdated: new Date().toISOString()
          }
        }
        return item
      })
    })
  }, [])

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as const, updatedAt: new Date().toISOString() } : alert
    ))
  }, [])

  const ignoreAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'ignored' as const, updatedAt: new Date().toISOString() } : alert
    ))
  }, [])

  const updateItem = useCallback((updatedItem: InventoryItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
  }, [])

  return (
    <InventoryContext.Provider value={{ items, movements, alerts, metrics, adjustStock, resolveAlert, ignoreAlert, updateItem }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
