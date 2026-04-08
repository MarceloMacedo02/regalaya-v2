// Tipos para Gerenciamento de Estoque - Regalaya

export interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  categoryId: string
  categoryName: string
  currentStock: number
  minStock: number
  maxStock: number
  unitCost: number
  salePrice: number
  profitMargin: number
  status: StockStatus
  location: string
  lastUpdated: string
  thirdParty?: boolean
  supplierId?: string
  supplierName?: string
  batch?: string
  expiryDate?: string
}

export type StockStatus = 'available' | 'low' | 'out-of-stock' | 'reserved'

export interface StockMovement {
  id: string
  productId: string
  productName: string
  sku: string
  type: MovementType
  quantity: number
  previousStock: number
  newStock: number
  unitCost: number
  totalValue: number
  reason: MovementReason
  notes?: string
  userId: string
  userName: string
  createdAt: string
  referenceId?: string // Pedido, NF, etc.
}

export type MovementType = 'in' | 'out' | 'adjustment' | 'transfer' | 'return' | 'loss'

export type MovementReason = 
  | 'purchase'
  | 'sale'
  | 'return'
  | 'adjustment'
  | 'transfer-in'
  | 'transfer-out'
  | 'loss'
  | 'damage'
  | 'expiry'
  | 'inventory-count'

export interface Supplier {
  id: string
  name: string
  companyName: string
  cnpj: string
  email: string
  phone: string
  contact: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode: string
  }
  products: string[] // IDs dos produtos
  averageDeliveryDays: number
  rating: number // 1-5
  status: 'active' | 'inactive' | 'blocked'
  paymentTerms: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface StockAlert {
  id: string
  productId: string
  productName: string
  sku: string
  type: AlertType
  priority: AlertPriority
  message: string
  currentStock: number
  threshold: number
  status: AlertStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
  action?: string
}

export type AlertType = 'low-stock' | 'out-of-stock' | 'expiry' | 'restock' | 'overstock'

export type AlertPriority = 'low' | 'medium' | 'high' | 'critical'

export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'ignored'

export interface Warehouse {
  id: string
  name: string
  code: string
  address: {
    street: string
    number: string
    city: string
    state: string
    zipCode: string
  }
  manager: string
  phone: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface InventoryReport {
  id: string
  type: ReportType
  period: {
    start: string
    end: string
  }
  generatedAt: string
  generatedBy: string
  data: ReportData
}

export type ReportType = 'turnover' | 'value' | 'losses' | 'abc-curve' | 'aging'

export interface ReportData {
  summary: Record<string, number>
  items: ReportItem[]
  trends?: TrendData[]
}

export interface ReportItem {
  productId: string
  productName: string
  sku: string
  category: string
  value?: number
  quantity?: number
  turnover?: number
  margin?: number
  [key: string]: string | number | boolean | undefined
}

export interface TrendData {
  date: string
  value: number
  label?: string
}

export interface InventorySettings {
  id: string
  lowStockThreshold: number
  enableAutoRestock: boolean
  autoRestockThreshold: number
  enableExpiryAlerts: boolean
  expiryAlertDays: number
  enableNegativeStock: boolean
  defaultWarehouse: string
  currency: string
  dateFormat: string
}

export interface BatchControl {
  id: string
  productId: string
  batchNumber: string
  quantity: number
  manufacturingDate: string
  expiryDate: string
  supplierId: string
  receivedAt: string
  status: 'active' | 'expired' | 'consumed'
}
