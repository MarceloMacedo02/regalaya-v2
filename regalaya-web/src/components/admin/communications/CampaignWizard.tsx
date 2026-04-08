"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react"
import { CustomerSelectionStep } from "./CustomerSelectionStep"
import { CommunicationTypeStep } from "./CommunicationTypeStep"
import { TemplateStep } from "./TemplateStep"
import { SchedulingStep } from "./SchedulingStep"
import { useCampaignWizard } from "@/hooks/useCampaignWizard"
import { useToast } from "@/hooks/use-toast"

interface CampaignWizardProps {
  onComplete?: () => void
}

const STEP_TITLES = [
  "Seleção de Clientes",
  "Tipo de Comunicação",
  "Seleção de Template",
  "Agendamento",
]

export function CampaignWizard({ onComplete }: CampaignWizardProps) {
  const { toast } = useToast()
  const {
    currentStep,
    formData,
    errors,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
    totalSteps,
  } = useCampaignWizard()

  const handleNext = () => {
    nextStep()
  }

  const handleSendCampaign = () => {
    toast({
      title: "Campanha enviada!",
      description: `A campanha "${formData.campaignName}" foi agendada com sucesso.`,
    })
    onComplete?.()
  }

  const handleSaveDraft = () => {
    saveDraft()
    toast({
      title: "Rascunho salvo",
      description: "O rascunho da campanha foi salvo com sucesso.",
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CustomerSelectionStep
            selectedSegment={formData.customerSegment}
            onSegmentChange={(segment) => updateField("customerSegment", segment)}
            error={errors.customerSegment}
            customerCount={formData.customerSegment === "ALL" ? 1250 : formData.customerSegment === "VIP" ? 180 : formData.customerSegment === "NEW" ? 95 : formData.customerSegment === "INACTIVE" ? 320 : undefined}
          />
        )
      case 1:
        return (
          <CommunicationTypeStep
            selectedType={formData.communicationType}
            onTypeChange={(type) => updateField("communicationType", type)}
            error={errors.communicationType}
          />
        )
      case 2:
        return (
          <TemplateStep
            communicationType={formData.communicationType}
            selectedTemplateId={formData.selectedTemplateId}
            onTemplateSelect={(id) => updateField("selectedTemplateId", id)}
            customization={formData.templateCustomization}
            onCustomizationChange={(customization) => updateField("templateCustomization", customization)}
            error={errors.selectedTemplateId}
          />
        )
      case 3:
        return (
          <SchedulingStep
            campaignName={formData.campaignName}
            onCampaignNameChange={(name) => updateField("campaignName", name)}
            sendNow={formData.sendNow}
            onSendNowChange={(sendNow) => updateField("sendNow", sendNow)}
            scheduledDate={formData.scheduledDate}
            onScheduledDateChange={(date) => updateField("scheduledDate", date)}
            scheduledTime={formData.scheduledTime}
            onScheduledTimeChange={(time) => updateField("scheduledTime", time)}
            customerSegment={formData.customerSegment}
            communicationType={formData.communicationType}
            templateName="Template selecionado"
            estimatedRecipients={formData.customerSegment === "ALL" ? 1250 : formData.customerSegment === "VIP" ? 180 : formData.customerSegment === "NEW" ? 95 : formData.customerSegment === "INACTIVE" ? 320 : undefined}
            error={errors.campaignName || errors.scheduledDate}
          />
        )
      default:
        return null
    }
  }

  return (
    <Card className="admin-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Criador de Campanhas</CardTitle>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            {STEP_TITLES.map((title, index) => (
              <button
                key={title}
                className={`flex-1 text-xs font-medium text-center transition-colors ${
                  index === currentStep ? "text-[#003566]" : index < currentStep ? "text-green-600" : "text-gray-400"
                }`}
                onClick={() => goToStep(index)}
              >
                <div className="flex items-center justify-center gap-1">
                  {index < currentStep ? (
                    <span className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">✓</span>
                  ) : (
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                      index === currentStep ? "bg-[#003566] text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {index + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{title}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#003566] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="min-h-[400px]">
        {renderStep()}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} className="gap-1">
            <Save className="h-4 w-4" />
            Salvar Rascunho
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button onClick={handleNext} className="gap-1">
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSendCampaign} className="gap-1 bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4" />
              Enviar Campanha
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
