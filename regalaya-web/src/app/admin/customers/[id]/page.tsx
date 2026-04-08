"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, User, ShoppingBag, DollarSign, TrendingUp, Award } from "lucide-react"
import { customersService, type CustomerProfile } from "@/services"
import { useToast } from "@/hooks/use-toast"
import CustomerSidebar from "@/components/admin/customers/profile/CustomerSidebar"
import CustomerTabs from "@/components/admin/customers/profile/CustomerTabs"
import TabSummary from "@/components/admin/customers/profile/TabSummary"
import TabOrders from "@/components/admin/customers/profile/TabOrders"
import TabMetrics from "@/components/admin/customers/profile/TabMetrics"

type TabType = "summary" | "orders" | "metrics"

export default function CustomerProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("summary")

  const fetchCustomerProfile = useCallback(async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const profile = await customersService.getCustomerProfile(id as string)
      setCustomer(profile)
    } catch (error) {
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível obter os dados do cliente.",
        variant: "destructive",
      })
      router.push("/admin/customers")
    } finally {
      setIsLoading(false)
    }
  }, [id, toast, router])

  useEffect(() => {
    fetchCustomerProfile()
  }, [fetchCustomerProfile])

  const handleBack = () => {
    router.push("/admin/customers")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Cliente não encontrado</p>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <Button onClick={handleBack} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Perfil do Cliente</h1>
          <p className="text-sm text-gray-500">{customer.name}</p>
        </div>
      </div>

      {/* Layout com sidebar + conteúdo */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - informações básicas */}
        <div className="lg:col-span-1">
          <CustomerSidebar customer={customer} />
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sistema de abas */}
          <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Conteúdo das abas */}
          {activeTab === "summary" && <TabSummary customerId={customer.id} metrics={customer.metrics} />}
          {activeTab === "orders" && <TabOrders customerId={customer.id} customerName={customer.name} />}
          {activeTab === "metrics" && <TabMetrics customerId={customer.id} />}
        </div>
      </div>
    </div>
  )
}