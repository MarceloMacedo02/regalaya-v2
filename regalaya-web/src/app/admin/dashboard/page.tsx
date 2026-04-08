"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { SalesChart } from "@/components/admin/charts/sales-chart"
import { TopProducts } from "@/components/admin/charts/top-products"
import { PeriodFilter } from "@/components/admin/filters/period-filter"
import { ArrowUpRight, ArrowDownRight, Loader2, AlertCircle } from "lucide-react"
import { dashboardApi } from "@/services/dashboard.service"
import type { DashboardStats, SalesData, TopProduct, OrderSummary, CustomerSummary } from "@/services/dashboard.service"

const EMPTY_STATS: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  averageTicket: 0,
  revenueChange: 0,
  ordersChange: 0,
  customersChange: 0,
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<string>("month")
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([])
  const [recentCustomers, setRecentCustomers] = useState<CustomerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiPeriod = useMemo(() => {
    if (period.startsWith("custom:")) return "month"
    return period
  }, [period])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function fetchData() {
      try {
        const [statsRes, salesRes, topRes, ordersRes] = await Promise.allSettled([
          dashboardApi.getStats(apiPeriod),
          dashboardApi.getSalesData(apiPeriod),
          dashboardApi.getTopProducts(apiPeriod, 5),
          dashboardApi.getRecentOrders(5),
        ])

        if (cancelled) return

        if (statsRes.status === "fulfilled") setStats(statsRes.value)
        else if (statsRes.status === "rejected") console.error("Failed to fetch stats:", statsRes.reason)

        if (salesRes.status === "fulfilled") setSalesData(salesRes.value)
        else if (salesRes.status === "rejected") console.error("Failed to fetch sales:", salesRes.reason)

        if (topRes.status === "fulfilled") setTopProducts(topRes.value)
        else if (topRes.status === "rejected") console.error("Failed to fetch top products:", topRes.reason)

        if (ordersRes.status === "fulfilled") setRecentOrders(ordersRes.value.content || [])
        else if (ordersRes.status === "rejected") console.error("Failed to fetch orders:", ordersRes.reason)

        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao carregar dados do dashboard")
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [apiPeriod])

  const statusColors: Record<string, "warning" | "secondary" | "success" | "destructive"> = {
    pending: "warning",
    processing: "secondary",
    shipped: "secondary",
    delivered: "success",
    cancelled: "destructive",
    refunded: "secondary",
  }

  const revenueChange = stats.revenueChange?.toFixed(1) ?? "0.0"
  const ordersChange = stats.ordersChange?.toFixed(1) ?? "0.0"
  const customersChange = stats.customersChange?.toFixed(1) ?? "0.0"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#003566] mx-auto" />
          <p className="text-slate-500 mt-3 text-sm">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-red-600 mt-3 text-sm">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Visão geral da sua loja</p>
        </div>
        <div className="w-full sm:w-auto">
          <PeriodFilter onPeriodChange={setPeriod} currentPeriod={period} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[#003566]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vendas</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="h-11 w-11 rounded bg-slate-100 flex items-center justify-center">
                <span className="text-[#003566] font-bold">R$</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {parseFloat(revenueChange) >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={parseFloat(revenueChange) >= 0 ? "text-emerald-600 text-sm font-semibold" : "text-red-600 text-sm font-semibold"}>
                {revenueChange}%
              </span>
              <span className="text-slate-400 text-xs">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00A8E8]">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pedidos</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="h-11 w-11 rounded bg-slate-100 flex items-center justify-center">
                <span className="text-[#00A8E8] font-bold">#</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {parseFloat(ordersChange) >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={parseFloat(ordersChange) >= 0 ? "text-emerald-600 text-sm font-semibold" : "text-red-600 text-sm font-semibold"}>
                {ordersChange}%
              </span>
              <span className="text-slate-400 text-xs">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Clientes</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalCustomers}</p>
              </div>
              <div className="h-11 w-11 rounded bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-600 font-bold">👥</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {parseFloat(customersChange) >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={parseFloat(customersChange) >= 0 ? "text-emerald-600 text-sm font-semibold" : "text-red-600 text-sm font-semibold"}>
                {customersChange}%
              </span>
              <span className="text-slate-400 text-xs">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ticket Médio</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatPrice(stats.averageTicket)}</p>
              </div>
              <div className="h-11 w-11 rounded bg-amber-50 flex items-center justify-center">
                <span className="text-amber-600 font-bold">Ø</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-3">por pedido</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">Receita</CardTitle>
              <span className="text-slate-400 text-xs">Últimos 30 dias</span>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">Top Produtos</CardTitle>
              <span className="text-slate-400 text-xs">Mais vendidos</span>
            </div>
          </CardHeader>
          <CardContent>
            <TopProducts products={topProducts} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">Pedidos Recentes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/admin/orders" className="text-[#003566] text-sm hover:underline">Ver todos →</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">Nenhum pedido encontrado</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 text-sm">{order.orderNumber}</p>
                      <p className="text-slate-500 text-sm">{order.customerName}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-slate-800 text-sm">{formatPrice(order.total)}</p>
                      <Badge variant={statusColors[order.status] || "secondary"} className="text-xs mt-1">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">Novos Clientes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/admin/customers" className="text-[#003566] text-sm hover:underline">Ver todos →</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentCustomers.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">Nenhum cliente encontrado</p>
            ) : (
              <div className="space-y-2">
                {recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 text-sm">{customer.name}</p>
                      <p className="text-slate-500 text-sm">{customer.email}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-slate-600 text-sm">{customer.totalOrders} pedidos</p>
                      <Badge variant={customer.status === "active" ? "success" : "secondary"} className="text-xs mt-1">{customer.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}