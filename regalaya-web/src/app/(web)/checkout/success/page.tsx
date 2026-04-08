"use client"

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ordersService, OrderDetailResponse } from "@/services/orders.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Package, 
  Mail, 
  ArrowRight,
  Truck,
  CreditCard,
  QrCode,
  MapPin,
  Copy,
  Check,
  Loader2
} from "lucide-react"

interface CheckoutSuccessContentProps {
  searchParams: { [key: string]: string | null }
}

function CheckoutSuccessContent({ searchParams }: CheckoutSuccessContentProps) {
  const orderId = searchParams?.order || null
  const paymentMethod = searchParams?.method || "pix"
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false)
        return
      }

      try {
        const orderData = await ordersService.getMyOrderById(orderId)
        setOrder(orderData)
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError("Não foi possível carregar os dados do pedido")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleCopyOrderNumber = async () => {
    if (order?.orderNumber) {
      await navigator.clipboard.writeText(order.orderNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPaymentMethodLabel = (method: string | null) => {
    switch (method) {
      case "pix": return "PIX"
      case "card": return "Cartão de Crédito"
      case "boleto": return "Boleto Bancário"
      case "CREDIT_CARD": return "Cartão de Crédito"
      case "PIX": return "PIX"
      default: return method || "Não informado"
    }
  }

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case "pix": case "PIX": return <QrCode className="h-5 w-5" />
      case "card": case "CREDIT_CARD": return <CreditCard className="h-5 w-5" />
      default: return <CreditCard className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <p className="text-muted-foreground">Carregando dados do pedido...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Pedido não encontrado</h1>
          <p className="mb-8 text-muted-foreground">
            {error || "Não foi possível encontrar os dados do seu pedido."}
          </p>
          <Button asChild>
            <Link href="/products">Ver Produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Pedido Confirmado!
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Obrigado pela sua compra! 🎁
          </p>
        </div>

        {/* Order Number Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-sm text-muted-foreground">Número do pedido</p>
                <p className="text-2xl font-bold text-amber-600">{order.orderNumber}</p>
              </div>
              <Button variant="outline" onClick={handleCopyOrderNumber}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {getPaymentMethodIcon(paymentMethod)}
              Informações de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Método de pagamento</span>
              <span className="font-medium">{getPaymentMethodLabel(paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status do pagamento</span>
              <span className="flex items-center gap-1 font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Confirmado
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor total</span>
              <span className="font-bold">R$ {order.total.toFixed(2).replace(".", ",")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        {order.shippingAddress && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5" />
                Informações de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{order.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Resumo do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-zinc-100">
                    <Package className="h-6 w-6 text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    R$ {item.total.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {order.subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              {order.shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span>R$ {order.shipping.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>R$ {order.total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Confirmation */}
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Mail className="h-5 w-5 flex-shrink-0" />
          <span>
            Um email de confirmação foi enviado para você com todos os detalhes do pedido.
          </span>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">O que acontece agora?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Estamos preparando seu pedido</p>
                <p className="text-sm text-muted-foreground">
                  Em até 24 horas você receberá um email confirmando a preparação.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Envio do pedido</p>
                <p className="text-sm text-muted-foreground">
                  Assim que o pedido for enviado, você receberá o código de rastreamento por email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href="/products">
              Continuar Comprando
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/orders`}>
              Ver Meus Pedidos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

interface CheckoutSuccessPageProps {
  searchParams: { [key: string]: string | null }
}

export default function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent searchParams={searchParams} />
    </Suspense>
  )
}
