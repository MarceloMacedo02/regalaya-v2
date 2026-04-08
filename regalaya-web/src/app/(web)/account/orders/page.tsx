"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Package,
  Search,
  Eye,
  Download,
  RotateCcw,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
} from "lucide-react"
import Link from "next/link"

// Mock data
const allOrders = [
  {
    id: "PED-001",
    orderNumber: "REG-2026-001",
    date: "2026-03-25",
    status: "delivered",
    total: 289.90,
    items: [
      { name: "Caixa de Bombons Belga", quantity: 2, price: 89.90 },
      { name: "Buquê de Flores Artesanais", quantity: 1, price: 110.10 },
    ],
    shippingAddress: "Rua das Flores, 123 - São Paulo, SP",
    deliveryDate: "2026-03-28",
  },
  {
    id: "PED-002",
    orderNumber: "REG-2026-002",
    date: "2026-03-20",
    status: "shipped",
    total: 159.90,
    items: [
      { name: "Vinho Tinto Premium", quantity: 1, price: 159.90 },
    ],
    shippingAddress: "Av. Paulista, 1000 - São Paulo, SP",
    trackingCode: "BR123456789SP",
    estimatedDelivery: "2026-03-30",
  },
  {
    id: "PED-003",
    orderNumber: "REG-2026-003",
    date: "2026-03-15",
    status: "processing",
    total: 449.90,
    items: [
      { name: "Caixa de Bombons Belga", quantity: 5, price: 89.90 },
    ],
    shippingAddress: "Rua dos Presentes, 456 - Rio de Janeiro, RJ",
  },
  {
    id: "PED-004",
    orderNumber: "REG-2026-004",
    date: "2026-03-10",
    status: "pending",
    total: 199.90,
    items: [
      { name: "Experiência Degustação", quantity: 1, price: 199.90 },
    ],
    shippingAddress: "Rua do Comércio, 789 - Belo Horizonte, MG",
  },
]

const statusConfig: Record<string, { label: string; color: string; icon: any; description: string }> = {
  delivered: { 
    label: "Entregue", 
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: CheckCircle,
    description: "Pedido entregue com sucesso"
  },
  shipped: { 
    label: "Enviado", 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: Truck,
    description: "Pedido em transporte"
  },
  processing: { 
    label: "Processando", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: Clock,
    description: "Preparando seu pedido"
  },
  pending: { 
    label: "Pendente", 
    color: "bg-gray-100 text-gray-800 border-gray-200", 
    icon: CreditCard,
    description: "Aguardando pagamento"
  },
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
        <p className="text-muted-foreground">
          Acompanhe o status e histórico de todos os seus pedidos
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número do pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="shipped">Enviados</SelectItem>
            <SelectItem value="delivered">Entregues</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não fez nenhum pedido ou nenhum pedido corresponde aos filtros selecionados.
              </p>
              <Button asChild>
                <Link href="/products">Ver produtos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const status = statusConfig[order.status]
            const StatusIcon = status.icon

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {order.orderNumber}
                      </CardTitle>
                      <CardDescription>
                        {new Date(order.date).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                      <p className="text-lg font-bold">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Itens do pedido</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name}
                          </span>
                          <span>
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div>
                      <span className="font-medium text-foreground">Entrega:</span>{" "}
                      {order.shippingAddress}
                    </div>
                    {order.trackingCode && (
                      <div>
                        <span className="font-medium text-foreground">Rastreio:</span>{" "}
                        {order.trackingCode}
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div>
                        <span className="font-medium text-foreground">Previsão:</span>{" "}
                        {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                    {order.deliveryDate && (
                      <div>
                        <span className="font-medium text-foreground">Entregue em:</span>{" "}
                        {new Date(order.deliveryDate).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/track/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Rastrear Pedido
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Nota Fiscal
                    </Button>
                    {(order.status === "delivered" || order.status === "shipped") && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Solicitar Troca
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
