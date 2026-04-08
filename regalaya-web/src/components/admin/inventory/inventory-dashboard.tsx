"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, DollarSign, Warehouse, Truck } from "lucide-react"

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

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: "up" | "down" | "neutral"
  variant?: "default" | "success" | "warning" | "danger"
  onClick?: () => void
}

function MetricCard({ title, value, icon: Icon, description, trend, variant = "default", onClick }: MetricCardProps) {
  const variantStyles = {
    default: "bg-white dark:bg-zinc-950",
    success: "bg-green-50 dark:bg-green-950/20",
    warning: "bg-amber-50 dark:bg-amber-950/20",
    danger: "bg-red-50 dark:bg-red-950/20",
  }

  const iconVariantStyles = {
    default: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    success: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    warning: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400",
    danger: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
  }

  return (
    <Card 
      className={`${variantStyles[variant]} ${onClick ? "cursor-pointer transition-colors hover:border-primary/50" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {title}
        </CardTitle>
        <div className={`rounded-full p-2 ${iconVariantStyles[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface InventoryDashboardProps {
  metrics: InventoryMetrics
  onMetricClick?: (filter: string) => void
}

export function InventoryDashboard({ metrics, onMetricClick }: InventoryDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total em Estoque"
        value={metrics.totalProducts}
        icon={Package}
        description="Produtos cadastrados"
        variant="default"
        onClick={() => onMetricClick?.("all")}
      />
      
      <MetricCard
        title="Valor em Estoque"
        value={formatCurrency(metrics.totalValue)}
        icon={DollarSign}
        description="Baseado no custo unitário"
        variant="success"
      />
      
      <MetricCard
        title="Estoque Baixo"
        value={metrics.lowStockProducts}
        icon={AlertTriangle}
        description="Abaixo do mínimo"
        variant="warning"
        onClick={() => onMetricClick?.("low")}
      />
      
      <MetricCard
        title="Esgotados"
        value={metrics.outOfStockProducts}
        icon={AlertTriangle}
        description="Estoque zerado"
        variant="danger"
        onClick={() => onMetricClick?.("out-of-stock")}
      />
      
      <MetricCard
        title="Produtos de Terceiros"
        value={metrics.thirdPartyProducts}
        icon={Truck}
        description="Fornecedores externos"
        variant="default"
      />
      
      <MetricCard
        title="Alertas Ativos"
        value={metrics.activeAlerts}
        icon={AlertTriangle}
        description={`${metrics.criticalAlerts} críticos`}
        variant={metrics.criticalAlerts > 0 ? "danger" : "warning"}
      />
    </div>
  )
}

