"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { communicationsService, type CommunicationCampaign } from "@/services/communications.service"
import { useToast } from "@/hooks/use-toast"

export default function CampaignDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [campaign, setCampaign] = useState<CommunicationCampaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setIsLoading(true)
        const data = await communicationsService.findCampaignById(String(id))
        setCampaign(data)
      } catch {
        toast({
          title: "Erro ao carregar campanha",
          description: "Não foi possível obter os detalhes da campanha.",
          variant: "destructive",
        })
        router.push("/admin/communications/campaigns")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadCampaign()
    }
  }, [id, router, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!campaign) {
    return null
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/communications/campaigns")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-sm text-gray-500">Template: {campaign.templateName}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <Badge>{campaign.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Canal</span>
              <span>{campaign.type}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Segmento</span>
              <span>{campaign.segmentCode}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Destinatários</span>
              <span>{campaign.recipientCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Rate limited</span>
              <span>{campaign.rateLimitedCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Abertura</span>
              <span>{campaign.openRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Cliques</span>
              <span>{campaign.clickRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-gray-50 p-4 whitespace-pre-wrap text-sm">
              {campaign.previewContent}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatório por mensagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaign.deliveries.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma mensagem registrada.</p>
          ) : (
            campaign.deliveries.map((delivery) => (
              <div key={delivery.id} className="flex flex-col gap-1 rounded-lg border p-3 text-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-gray-900">{delivery.recipientName}</div>
                  <div className="text-gray-500">{delivery.recipientEmail || delivery.recipientPhone || "Sem contato"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{delivery.status}</Badge>
                  <span className="text-gray-500">{delivery.errorMessage || "OK"}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
