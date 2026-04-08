"use client"

import { useEffect, useState } from "react"
import { ordersService, type OrderDetailResponse } from "@/services"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Package, MapPin, CreditCard, User, Clock, ChevronRight } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface OrderDetailsModalProps {
  open: boolean
  onClose: () => void
  orderId: string
  customerName: string
}

export default function OrderDetailsModal({
  open,
  onClose,
  orderId,
  customerName,
}: OrderDetailsModalProps) {
  const { toast } = useToast()
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails()
    }
  }, [open, orderId])

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true)
      const data = await ordersService.getById(orderId)
      setOrder(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do pedido.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "DELIVERED":
        return "bg-green-100 text-green-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      case "PROCESSING":
        return "bg-blue-100 text-blue-700"
      case "SHIPPED":
        return "bg-purple-100 text-purple-700"
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#003566]" />
            Pedido {order?.orderNumber}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Status e Data */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Criado em: {formatDate(order.createdAt)}
                </span>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Cliente */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold">{customerName}</p>
                  <p className="text-sm text-gray-600">{order.customerEmail}</p>
                  {order.customerPhone && (
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{order.shippingAddress || "Não informado"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Itens do pedido */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Itens do Pedido ({order.orderItems?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
                      {/* Imagem do produto (placeholder) */}
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>

                      {/* Informações */}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                      </div>

                      {/* Preço unitário e total */}
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatPrice(item.unitPrice)}</p>
                        <p className="text-xs text-gray-500">
                          Total: {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Desconto</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  {order.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete</span>
                      <span>{formatPrice(order.shipping)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pagamento */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Método</span>
                  <span className="font-medium">{order.paymentMethod || "Não informado"}</span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm">{order.transactionId}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tracking */}
            {order.trackingCode && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    Rastreamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm">{order.trackingCode}</p>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Acompanhar entrega
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notas */}
            {order.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Pedido não encontrado</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
