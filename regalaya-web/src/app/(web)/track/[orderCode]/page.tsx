"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { fetchTrackingData, TrackingData } from "@/lib/track"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Copy,
  ExternalLink,
  AlertCircle,
  LucideIcon,
} from "lucide-react"

// Mock tracking data
const mockTrackingData: Record<string, {
  orderCode: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  estimatedDelivery: string
  shippingAddress: string
  items: { name: string; quantity: number }[]
  timeline: {
    status: string
    date: string
    description: string
    completed: boolean
    current?: boolean
  }[]
  carrier?: string
  trackingCode?: string | null
}> = {
  "PED-001": {
    orderCode: "PED-001",
    status: "delivered",
    estimatedDelivery: "2026-03-28",
    shippingAddress: "Rua das Flores, 123 - Jardins, São Paulo - SP, 01234-567",
    items: [
      { name: "Caixa de Bombons Belga", quantity: 2 },
      { name: "Buquê de Flores Artesanais", quantity: 1 },
    ],
    carrier: "Correios",
    trackingCode: "BR123456789SP",
    timeline: [
      {
        status: "Pedido realizado",
        date: "2026-03-25 10:30",
        description: "Seu pedido foi confirmado e está sendo processado.",
        completed: true,
      },
      {
        status: "Em separação",
        date: "2026-03-25 14:00",
        description: "Estamos separando os itens do seu pedido.",
        completed: true,
      },
      {
        status: "Saiu para entrega",
        date: "2026-03-27 08:00",
        description: "O pedido saiu para entrega e chegará em breve.",
        completed: true,
      },
      {
        status: "Entregue",
        date: "2026-03-28 15:30",
        description: "Pedido entregue com sucesso. Aproveite!",
        completed: true,
        current: true,
      },
    ],
  },
  "PED-002": {
    orderCode: "PED-002",
    status: "shipped",
    estimatedDelivery: "2026-03-30",
    shippingAddress: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
    items: [
      { name: "Vinho Tinto Premium", quantity: 1 },
    ],
    carrier: "Correios",
    trackingCode: "BR987654321SP",
    timeline: [
      {
        status: "Pedido realizado",
        date: "2026-03-20 09:15",
        description: "Seu pedido foi confirmado.",
        completed: true,
      },
      {
        status: "Em separação",
        date: "2026-03-20 16:00",
        description: "Estamos separando os itens.",
        completed: true,
      },
      {
        status: "Saiu para entrega",
        date: "2026-03-28 07:30",
        description: "O pedido está a caminho!",
        completed: true,
        current: true,
      },
      {
        status: "Entregue",
        date: "",
        description: "Previsão de entrega em 30/03/2026.",
        completed: false,
      },
    ],
  },
  "PED-003": {
    orderCode: "PED-003",
    status: "processing",
    estimatedDelivery: "2026-04-02",
    shippingAddress: "Rua dos Presentes, 456 - Centro, Rio de Janeiro - RJ, 20000-000",
    items: [
      { name: "Caixa de Bombons Belga", quantity: 5 },
    ],
    carrier: "Transportadora Express",
    trackingCode: null,
    timeline: [
      {
        status: "Pedido realizado",
        date: "2026-03-25 11:00",
        description: "Seu pedido foi confirmado.",
        completed: true,
        current: true,
      },
      {
        status: "Em separação",
        date: "",
        description: "Em breve iniciaremos a separação.",
        completed: false,
      },
      {
        status: "Saiu para entrega",
        date: "",
        description: "Aguardando envio.",
        completed: false,
      },
      {
        status: "Entregue",
        date: "",
        description: "Previsão de entrega em 02/04/2026.",
        completed: false,
      },
    ],
  },
}

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  pending: { label: "Pendente", color: "bg-gray-100 text-gray-800", icon: Clock },
  processing: { label: "Processando", color: "bg-yellow-100 text-yellow-800", icon: Package },
  shipped: { label: "Enviado", color: "bg-blue-100 text-blue-800", icon: Truck },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: AlertCircle },
}

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState("")

  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    try {
      const data = await fetchTrackingData(orderCode.toUpperCase(), controller.signal)
      clearTimeout(timeoutId)
      setTrackingData(data)
    } catch {
      // Fallback to mock data for demo purposes
      const mockData = mockTrackingData[orderCode.toUpperCase()]
      if (mockData) {
        setTrackingData(mockData)
      } else {
        setError("Pedido não encontrado. Verifique o código e tente novamente.")
        setTrackingData(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const params = useParams()
  const orderCodeFromUrl = params.orderCode as string | undefined

  useEffect(() => {
    if (orderCodeFromUrl) {
      setOrderCode(orderCodeFromUrl)
    }
  }, [orderCodeFromUrl])

  const handleCopyCode = () => {
    if (trackingData?.trackingCode) {
      navigator.clipboard.writeText(trackingData.trackingCode)
    }
  }

  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Rastrear Pedido</h1>
            <p className="text-lg text-muted-foreground">
              Acompanhe o status e a previsão de entrega do seu pedido
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Pedido
              </CardTitle>
              <CardDescription>
                Digite o código do seu pedido para rastrear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="orderCode">Código do Pedido</Label>
                  <div className="flex gap-2">
                    <Input
                      id="orderCode"
                      placeholder="Ex: PED-001"
                      value={orderCode}
                      onChange={(e) => setOrderCode(e.target.value)}
                      className="uppercase"
                    />
                    <Button type="submit" disabled={isLoading || !orderCode}>
                      {isLoading ? "Buscando..." : "Rastrear"}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Dica: Use PED-001, PED-002 ou PED-003 para testar
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <>
              {/* Order Summary */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Pedido {trackingData.orderCode}
                      </CardTitle>
                      <CardDescription>
                        Previsão de entrega: {new Date(trackingData.estimatedDelivery).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>
                    {(() => {
                      const status = statusConfig[trackingData.status]
                      const StatusIcon = status.icon
                      return (
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      )
                    })()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Itens do pedido</h4>
                    <div className="space-y-1">
                      {trackingData.items.map((item, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Endereço de entrega</p>
                        <p className="text-sm text-muted-foreground">
                          {trackingData.shippingAddress}
                        </p>
                      </div>
                    </div>
                    {trackingData.carrier && (
                      <div className="flex items-start gap-2">
                        <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Transportadora</p>
                          <p className="text-sm text-muted-foreground">
                            {trackingData.carrier}
                          </p>
                        </div>
                      </div>
                    )}
                    {trackingData.trackingCode && (
                      <div className="flex items-start gap-2 sm:col-span-2">
                        <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Código de rastreio</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground font-mono">
                              {trackingData.trackingCode}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopyCode}
                              className="h-6 px-2"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Linha do Tempo
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o progresso do seu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-0 bottom-4 w-0.5 bg-muted" />
                    
                    <div className="space-y-6">
                      {trackingData.timeline.map((event, index) => {
                        const isCompleted = event.completed
                        const isCurrent = event.current
                        const isPending = !event.completed && !event.current

                        return (
                          <div key={index} className="relative flex gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
                                  isCompleted
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : isCurrent
                                    ? "bg-primary border-primary text-primary-foreground animate-pulse"
                                    : "bg-background border-muted text-muted-foreground"
                                }`}
                              >
                                {isCompleted || isCurrent ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-semibold ${isPending ? "text-muted-foreground" : ""}`}>
                                  {event.status}
                                </h4>
                                {isCurrent && (
                                  <Badge variant="secondary" className="text-xs">
                                    Atual
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm mb-1 ${isPending ? "text-muted-foreground" : "text-muted-foreground"}`}>
                                {event.description}
                              </p>
                              {event.date && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(event.date).toLocaleString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="mt-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Precisa de ajuda?</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Em caso de dúvidas sobre seu pedido, entre em contato conosco.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="/contact">Fale Conosco</a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/faq">Ver FAQ</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {!trackingData && !error && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Busque seu pedido</h3>
                <p className="text-muted-foreground">
                  Digite o código do pedido acima para ver o status e previsão de entrega.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
