import { dashboardStats, orders, customers } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

/**
 * ADMIN DASHBOARD DEMO - Dados Mockados
 * 
 * Esta página é para demonstração visual.
 * O admin real estará em /admin/dashboard com proteção de rota.
 */

export default function AdminDemoPage() {
  const recentOrders = orders.slice(0, 5)

  const statusColors = {
    pending: "warning",
    processing: "secondary",
    shipped: "secondary",
    delivered: "success",
    cancelled: "destructive",
    refunded: "secondary",
  } as const

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua loja
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <span className="text-green-500 text-sm">+{dashboardStats.revenueChange}%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(dashboardStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">vs. último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <span className="text-green-500 text-sm">+{dashboardStats.ordersChange}%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">vs. último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <span className="text-green-500 text-sm">+{dashboardStats.customersChange}%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">vs. último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(dashboardStats.averageTicket)}</div>
            <p className="text-xs text-muted-foreground">por pedido</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recentes</CardTitle>
            <Button variant="ghost" size="sm">Ver todos →</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <Badge variant={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Novos Clientes</CardTitle>
            <Button variant="ghost" size="sm">Ver todos →</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 5).map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{customer.totalOrders} pedidos</p>
                    <Badge variant={customer.status === "active" ? "success" : "secondary"}>
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
