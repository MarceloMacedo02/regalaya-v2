"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, ShoppingCart, DollarSign, Clock, User, ChevronLeft, ChevronRight } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { ordersService, OrderResponse } from "@/services/orders.service"
import { useRouter } from "next/navigation"
import Link from "next/link"

const STATUS_MAP: Record<string, string> = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const pageSize = 20

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ordersService.getAll(page, pageSize, "createdAt,desc")
      setOrders(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || STATUS_MAP[order.status] === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const mappedStatus = STATUS_MAP[status] || "pending"
    return {
      style: STATUS_STYLES[mappedStatus],
      label: STATUS_LABELS[mappedStatus] || status,
    }
  }

  const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.total, 0)
  const pendingCount = orders.filter((o) => STATUS_MAP[o.status] === "pending").length

  const exportToCSV = () => {
    const csv = ["Pedido,Cliente,Email,Valor,Status,Data"]
    filteredOrders.forEach((o) => {
      csv.push(`${o.orderNumber},${o.customerName},${o.customerEmail},${o.total},${o.status},${o.createdAt}`)
    })
    const blob = new Blob([csv.join("\n")], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `pedidos_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalElements} {totalElements === 1 ? "pedido encontrado" : "pedidos encontrados"}
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="btn-elegant-secondary gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total de Pedidos</span>
            <div className="h-9 w-9 rounded-lg bg-[#003566]/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-[#003566]" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalElements}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Receita Total</span>
            <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pendentes</span>
            <div className="h-9 w-9 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Média por Pedido</span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {orders.length > 0 ? formatPrice(totalRevenue / orders.length) : formatPrice(0)}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por número, cliente ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 px-4 pl-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] focus:ring-2 focus:ring-[#003566]/10 focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none"
              >
                <option value="all">Todos Status</option>
                <option value="pending">Pendente</option>
                <option value="processing">Processando</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:border-[#003566] outline-none"
              >
                <option value="all">Qualquer data</option>
                <option value="today">Hoje</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#003566] border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pedido</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                        <ShoppingCart className="h-10 w-10 mx-auto mb-2" />
                        <p>Nenhum pedido encontrado</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const status = getStatusBadge(order.status)
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">{order.orderNumber}</span>
                              <span className="text-sm text-gray-400">{order.itemCount} item(s)</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">{order.customerName}</span>
                              <span className="text-sm text-gray-400">{order.customerEmail}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-green-600">{formatPrice(order.total)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.style}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#003566]">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <p className="text-sm text-gray-500">
                  Página {page + 1} de {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
