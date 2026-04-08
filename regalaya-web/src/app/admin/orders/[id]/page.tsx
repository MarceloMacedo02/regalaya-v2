"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  Copy,
  Download,
  Send,
  Loader2,
} from "lucide-react"
import { ordersService, OrderDetailResponse, OrderItemResponse, UpdateOrderStatusRequest } from "@/services/orders.service"
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"



const STATUS_BADGE_VARIANT: Record<string, string> = {
  PENDING: "warning",
  PROCESSING: "secondary",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "secondary",
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: "PIX",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  boleto: "Boleto",
}

export default function OrderDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [statusNote, setStatusNote] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        const data = await ordersService.getById(orderId)
        setOrder(data)
      } catch (error) {
        console.error("Erro ao buscar pedido:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do pedido.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId, toast])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    })
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) return
    setUpdating(true)
    try {
      const request: UpdateOrderStatusRequest = {
        status: newStatus as UpdateOrderStatusRequest["status"],
        notes: statusNote || undefined,
      }
      const updated = await ordersService.updateStatus(orderId, request)
      setOrder(updated)
      setIsStatusDialogOpen(false)
      setNewStatus("")
      setStatusNote("")
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const printOrder = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#003566] border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
        <p className="text-muted-foreground mb-4">
          O pedido solicitado não existe ou foi removido.
        </p>
        <Button asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para pedidos
          </Link>
        </Button>
      </div>
    )
  }

  const statusBadge = STATUS_BADGE_VARIANT[order.status] || "secondary"
  const statusLabel = STATUS_LABELS[order.status] || order.status
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[order.paymentMethod?.toLowerCase()] || order.paymentMethod || "N/A"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
              <Badge variant={statusBadge as any}>{statusLabel}</Badge>
            </div>
            <p className="text-muted-foreground">
              Criado em {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={printOrder}>
            <Download className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={() => setIsStatusDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Atualizar Status
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <div className="h-12 w-12 rounded-md bg-muted overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.productSku}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span>
                    {order.shipping === 0 ? (
                      <span className="text-green-600 font-medium">Grátis</span>
                    ) : (
                      formatPrice(order.shipping)
                    )}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-green-600">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {order.shippingAddress}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Método</span>
                <span className="text-sm font-medium">{paymentMethodLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={
                    order.paymentStatus === "paid"
                      ? "success"
                      : order.paymentStatus === "pending"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {order.paymentStatus === "paid"
                    ? "Pago"
                    : order.paymentStatus === "pending"
                      ? "Pendente"
                      : order.paymentStatus === "refunded"
                        ? "Reembolsado"
                        : order.paymentStatus || "N/A"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {order.trackingCode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Rastreamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {order.trackingCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      copyToClipboard(order.trackingCode, "Código de rastreamento")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status do Pedido</DialogTitle>
            <DialogDescription>
              Selecione o novo status e adicione uma observação opcional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Novo Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="PROCESSING">Processando</SelectItem>
                  <SelectItem value="SHIPPED">Enviado</SelectItem>
                  <SelectItem value="DELIVERED">Entregue</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Observação (opcional)</label>
              <Textarea
                placeholder="Adicione uma observação sobre esta atualização..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStatus} disabled={!newStatus || updating}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
