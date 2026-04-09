"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { notificationPreferencesService, NotificationPreferences } from "@/services/notification-preferences.service"

export function NotificationPreferencesCard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    whatsappEnabled: true,
    marketingEnabled: true,
    transactionalEnabled: true,
  })

  useEffect(() => {
    notificationPreferencesService.getPreferences()
      .then(data => {
        setPreferences(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Failed to load preferences:", error);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const updatedPrefs = { ...preferences, [key]: value };
      setPreferences(updatedPrefs)
      await notificationPreferencesService.updatePreferences({ [key]: value });
      toast({
        title: "Preferências atualizadas",
        description: "Suas configurações de notificação foram salvas."
      })
    } catch (e) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar as configurações de notificação.",
        variant: "destructive"
      })
      // revert
      setPreferences({ ...preferences, [key]: !value })
    }
  }

  if (loading) {
    return <Card className="animate-pulse h-64 bg-muted/20"></Card>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Comunicações e Lembretes
        </CardTitle>
        <CardDescription>
          Gerencie como você deseja ser notificado sobre seus eventos, compras e promoções
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Canais */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            Canais de Entrega
          </h4>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-card gap-4">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground"/> 
                Email
              </Label>
              <p className="text-sm text-muted-foreground">Receber notificações por email</p>
            </div>
            <Switch 
              checked={preferences.emailEnabled}
              onCheckedChange={(c) => handleToggle('emailEnabled', c)}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-card gap-4">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground"/> 
                WhatsApp
              </Label>
              <p className="text-sm text-muted-foreground">Receber lembretes através do WhatsApp</p>
            </div>
            <Switch 
              checked={preferences.whatsappEnabled}
              onCheckedChange={(c) => handleToggle('whatsappEnabled', c)}
            />
          </div>
        </div>

        {/* Tipos de Notificação */}
        <div className="space-y-4">
          <h4 className="font-medium">Tipos de Notificação</h4>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-card gap-4">
            <div className="space-y-0.5">
              <Label className="text-base">Transacionais e Lembretes Importantes</Label>
              <p className="text-sm text-muted-foreground">Obrigatório. Atualizações de pedidos e lembretes imediatos.</p>
            </div>
            {/* Disabled or always ON based on UX, but we have transactionalEnabled toggle. In many cases, transactional is immutable, but we provide it here or show it disabled */}
            <Switch 
              checked={preferences.transactionalEnabled}
              disabled={true} 
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-card gap-4">
            <div className="space-y-0.5">
              <Label className="text-base">Marketing e Ofertas (Newsletter)</Label>
              <p className="text-sm text-muted-foreground">Opcional. Descontos exclusivos, sugestões de presentes semanais.</p>
            </div>
            <Switch 
              checked={preferences.marketingEnabled}
              onCheckedChange={(c) => handleToggle('marketingEnabled', c)}
            />
          </div>
        </div>

      </CardContent>
    </Card>
  )
}