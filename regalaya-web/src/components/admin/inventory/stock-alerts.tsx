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
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Package,
  Calendar,
} from "lucide-react"
import type { StockAlert, AlertPriority, AlertStatus } from "@/types/inventory"

interface StockAlertsProps {
  alerts: StockAlert[]
  onResolveAlert?: (alertId: string, action: string) => void
  onIgnoreAlert?: (alertId: string) => void
}

export function StockAlerts({ alerts, onResolveAlert, onIgnoreAlert }: StockAlertsProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesPriority =
      priorityFilter === "all" || alert.priority === priorityFilter
    const matchesStatus =
      statusFilter === "all" || alert.status === statusFilter
    const matchesType =
      typeFilter === "all" || alert.type === typeFilter
    return matchesPriority && matchesStatus && matchesType
  })

  const getPriorityIcon = (priority: AlertPriority) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "high":
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case "medium":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
    }
  }

  const getPriorityBadge = (priority: AlertPriority) => {
    const variants = {
      critical: "destructive",
      high: "warning",
      medium: "secondary",
      low: "outline",
    } as const

    const labels = {
      critical: "Crítica",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    } as const

    return <Badge variant={variants[priority]}>{labels[priority]}</Badge>
  }

  const getStatusBadge = (status: AlertStatus) => {
    const variants = {
      active: "warning",
      acknowledged: "secondary",
      resolved: "success",
      ignored: "outline",
    } as const

    const labels = {
      active: "Ativo",
      acknowledged: "Reconhecido",
      resolved: "Resolvido",
      ignored: "Ignorado",
    } as const

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getTypeIcon = (type: StockAlert["type"]) => {
    switch (type) {
      case "low-stock":
        return <TrendingUp className="h-4 w-4" />
      case "out-of-stock":
        return <Package className="h-4 w-4" />
      case "expiry":
        return <Calendar className="h-4 w-4" />
      case "restock":
        return <CheckCircle className="h-4 w-4" />
      case "overstock":
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertStyles = (type: StockAlert["type"]) => {
    const baseStyles = "flex items-start gap-3 rounded-lg border p-4"
    const typeStyles = {
      "low-stock": "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20",
      "out-of-stock": "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20",
      expiry: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20",
      restock: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
      overstock: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20",
    }
    return `${baseStyles} ${typeStyles[type]}`
  }

  const handleResolve = (alert: StockAlert) => {
    if (onResolveAlert) {
      onResolveAlert(alert.id, "resolved")
    }
  }

  const handleIgnore = (alert: StockAlert) => {
    if (onIgnoreAlert) {
      onIgnoreAlert(alert.id)
    }
  }

  const alertCounts = {
    total: alerts.length,
    active: alerts.filter((a) => a.status === "active").length,
    critical: alerts.filter((a) => a.priority === "critical" && a.status === "active").length,
    high: alerts.filter((a) => a.priority === "high" && a.status === "active").length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Estoque
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive">{alertCounts.critical} Críticos</Badge>
            <Badge variant="warning">{alertCounts.high} Altos</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="acknowledged">Reconhecidos</SelectItem>
              <SelectItem value="resolved">Resolvidos</SelectItem>
              <SelectItem value="ignored">Ignorados</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="low-stock">Estoque Baixo</SelectItem>
              <SelectItem value="out-of-stock">Esgotado</SelectItem>
              <SelectItem value="expiry">Validade</SelectItem>
              <SelectItem value="restock">Reposição</SelectItem>
              <SelectItem value="overstock">Excesso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Alertas */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>Nenhum alerta encontrado</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={getAlertStyles(alert.type)}>
                <div className="flex-shrink-0">
                  {getPriorityIcon(alert.priority)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{alert.productName}</span>
                    {getPriorityBadge(alert.priority)}
                    {getStatusBadge(alert.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Atual: {alert.currentStock} un.
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Limiar: {alert.threshold} un.
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                {alert.status === "active" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(alert)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolver
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleIgnore(alert)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Ignorar
                    </Button>
                  </div>
                )}
                {alert.status === "acknowledged" && (
                  <Badge variant="secondary">Em análise</Badge>
                )}
                {alert.status === "resolved" && (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Resolvido
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
