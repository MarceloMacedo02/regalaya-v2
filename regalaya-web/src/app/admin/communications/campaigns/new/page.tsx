"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CampaignWizard } from "@/components/admin/communications/CampaignWizard"

export default function NewCampaignPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/communications/campaigns")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Campanha</h1>
          <p className="text-sm text-gray-500 mt-1">Use o wizard passo a passo para criar sua campanha</p>
        </div>
      </div>

      {/* Wizard */}
      <CampaignWizard onComplete={() => router.push("/admin/communications/campaigns")} />
    </div>
  )
}
