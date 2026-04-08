"use client"

import { useState, useCallback, useEffect } from "react"
import type { CommunicationType, Template } from "@/services/templates.service"

export type CustomerSegment = "ALL" | "VIP" | "NEW" | "INACTIVE" | "CUSTOM"

export interface CampaignFormData {
  // Step 1: Customer Selection
  customerSegment: CustomerSegment
  customFilters: Record<string, string>
  selectedCustomers: string[]

  // Step 2: Communication Type
  communicationType: CommunicationType

  // Step 3: Template
  selectedTemplateId: string | null
  templateCustomization: Record<string, string>

  // Step 4: Scheduling
  sendNow: boolean
  scheduledDate: string | null
  scheduledTime: string | null

  // General
  campaignName: string
  status: "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED"
}

const STORAGE_KEY = "regalaya_campaign_wizard"

const defaultState: CampaignFormData = {
  customerSegment: "ALL",
  customFilters: {},
  selectedCustomers: [],
  communicationType: "EMAIL",
  selectedTemplateId: null,
  templateCustomization: {},
  sendNow: true,
  scheduledDate: null,
  scheduledTime: null,
  campaignName: "",
  status: "DRAFT",
}

export function useCampaignWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<CampaignFormData>(defaultState)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setFormData(parsed)
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData])

  const updateField = useCallback(<K extends keyof CampaignFormData>(field: K, value: CampaignFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    setErrors(prev => {
      const { [field]: _, ...rest } = prev
      return rest
    })
  }, [])

  const updateStepData = useCallback((step: number, data: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }, [])

  const nextStep = useCallback(() => {
    if (!validateStep(currentStep)) return
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }, [currentStep])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Customer Selection
        if (!formData.customerSegment) {
          newErrors.customerSegment = "Selecione um segmento de clientes"
        }
        break
      case 1: // Communication Type
        if (!formData.communicationType) {
          newErrors.communicationType = "Selecione o tipo de comunicação"
        }
        break
      case 2: // Template
        if (!formData.selectedTemplateId) {
          newErrors.selectedTemplateId = "Selecione um template"
        }
        break
      case 3: // Scheduling
        if (!formData.sendNow && !formData.scheduledDate) {
          newErrors.scheduledDate = "Selecione uma data para agendamento"
        }
        if (!formData.campaignName || formData.campaignName.trim().length < 3) {
          newErrors.campaignName = "Nome da campanha deve ter pelo menos 3 caracteres"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const reset = useCallback(() => {
    setFormData(defaultState)
    setCurrentStep(0)
    setErrors({})
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const saveDraft = useCallback(() => {
    setFormData(prev => ({ ...prev, status: "DRAFT" }))
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, status: "DRAFT" }))
    }
  }, [formData])

  return {
    currentStep,
    formData,
    errors,
    updateField,
    updateStepData,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    reset,
    saveDraft,
    totalSteps: 4,
  }
}
