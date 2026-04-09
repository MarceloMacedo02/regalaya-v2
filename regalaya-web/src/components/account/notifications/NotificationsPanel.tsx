"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, CheckCheck, Clock3, Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notificationService } from "@/services/notification.service"
import { useToast } from "@/hooks/use-toast"
import type { NotificationItem } from "@/types/notification"

const TYPE_LABELS: Record<string, string> = {
  DATE_REMINDER_7D: "Lembrete D-7",
  DATE_REMINDER_1D: "Lembrete D-1",
  ORDER_CONFIRMATION: "Pedido confirmado",
  ORDER_SHIPPED: "Pedido enviado",
  ORDER_DELIVERED: "Pedido entregue",
  AI_RECOMMENDATION: "Sugestão IA",
  MARKETING: "Marketing",
}

function formatDate(value?: string | null) {
  if (!value) return "Sem data"
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

export function NotificationsPanel() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = async (isManualRetry = false) => {
    try {
      if (isManualRetry) {
        setIsRetrying(true)
      } else {
        setIsLoading(true)
      }
      setError(null)
      const response = await notificationService.getAll({ page: 0, size: 20 })
      setNotifications(response.content)
    } catch (err) {
      setError("Não foi possível carregar suas notificações no momento.")
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await notificationService.markAsRead(notificationId)
      setNotifications((current) =>
        current.map((item) =>
          item.id === notificationId ? { ...item, read: true, readAt: response.readAt } : item
        )
      )
      toast({
        title: "Notificação atualizada",
        description: "A notificação foi marcada como lida.",
      })
    } catch (err) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <Bell className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Falha ao carregar notificações</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => loadNotifications(true)} disabled={isRetrying} className="gap-2">
            {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <Bell className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Nenhuma notificação por aqui</p>
            <p className="text-sm text-muted-foreground">
              Assim que o sistema gerar lembretes ou atualizações relevantes, eles aparecerão nesta área.
            </p>
          </div>
          <Button variant="outline" onClick={() => loadNotifications(true)} disabled={isRetrying}>
            Atualizar lista
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={notification.read ? "border-border" : "border-primary/40 shadow-sm shadow-primary/10"}
        >
          <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={notification.read ? "secondary" : "default"}>
                  {notification.read ? "Lida" : "Nova"}
                </Badge>
                <Badge variant="outline">{TYPE_LABELS[notification.type] ?? notification.type}</Badge>
              </div>
              <div>
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <CardDescription>{notification.contactName ?? "Sistema Regalaya"}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              {formatDate(notification.sentAt ?? notification.scheduledAt)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-foreground">{notification.message}</p>
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <p>Agendada em {formatDate(notification.scheduledAt)}</p>
              {notification.readAt && <p>Lida em {formatDate(notification.readAt)}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {notification.ctaUrl && (
                <Button asChild>
                  <Link href={notification.ctaUrl}>{notification.ctaLabel}</Link>
                </Button>
              )}
              {!notification.read && (
                <Button variant="outline" onClick={() => handleMarkAsRead(notification.id)} className="gap-2">
                  <CheckCheck className="h-4 w-4" />
                  Marcar como lida
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
