import { NotificationsPanel } from "@/components/account/notifications/NotificationsPanel"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notificações</h1>
        <p className="text-muted-foreground">
          Acompanhe lembretes de datas especiais e atualizações importantes da sua conta.
        </p>
      </div>

      <NotificationsPanel />
    </div>
  )
}
