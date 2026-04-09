import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  MapPin,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

// Mock data
const recentOrders = [
  {
    id: "PED-001",
    date: "2026-03-25",
    status: "delivered",
    total: 289.90,
    items: 3,
  },
  {
    id: "PED-002",
    date: "2026-03-20",
    status: "shipped",
    total: 159.90,
    items: 2,
  },
  {
    id: "PED-003",
    date: "2026-03-15",
    status: "processing",
    total: 449.90,
    items: 5,
  },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
  shipped: { label: "Enviado", color: "bg-blue-100 text-blue-800", icon: Truck },
  processing: { label: "Processando", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  pending: { label: "Pendente", color: "bg-gray-100 text-gray-800", icon: Clock },
}

export default function AccountDashboard() {
  const stats = [
    { label: "Pedidos Realizados", value: "12", icon: Package },
    { label: "Endereços Salvos", value: "3", icon: MapPin },
    { label: "Itens na Wishlist", value: "8", icon: Heart },
    { label: "Sugestões para Você", value: "IA", icon: Sparkles },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">
          Gerencie seus pedidos, endereços e informações pessoais
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>
                Acompanhe o status dos seus últimos pedidos
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/orders">
                Ver todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status]
              const StatusIcon = status.icon
              
              return (
                <div
                  key={order.id}
                  className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* First row: Icon + Order info left, Button right */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("pt-BR")} • {order.items} {order.items === 1 ? "item" : "itens"}
                        </p>
                      </div>
                    </div>
                    <Button variant="link" size="sm" asChild className="p-0 h-auto">
                      <Link href={`/track/${order.id}`}>
                        Ver detalhes
                      </Link>
                    </Button>
                  </div>

                  {/* Second row: Status left, Price right */}
                  <div className="flex items-center justify-between">
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    <p className="font-semibold whitespace-nowrap">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
               )
             })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/account/orders">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Meus Pedidos</p>
                  <p className="text-sm text-muted-foreground">
                    Histórico e detalhes
                  </p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/account/addresses">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Endereços</p>
                  <p className="text-sm text-muted-foreground">
                    Gerencie seus endereços
                  </p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/account/wishlist">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold">Lista de Desejos</p>
                  <p className="text-sm text-muted-foreground">
                    {8} itens salvos
                  </p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer bg-primary/5 border-primary/20">
          <Link href="/recommendations">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Recomendações IA</p>
                  <p className="text-sm text-muted-foreground">
                    Encontre o presente perfeito
                  </p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
