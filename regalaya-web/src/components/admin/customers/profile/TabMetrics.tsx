"use client"

import { useEffect, useState } from "react"
import { customersService, type CustomerChartData } from "@/services"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, TrendingUp, BarChart3, PieChart, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LTVEvolutionChart from "@/components/admin/customers/charts/LTVEvolutionChart"
import PurchaseFrequencyChart from "@/components/admin/customers/charts/PurchaseFrequencyChart"
import TopCategoriesChart from "@/components/admin/customers/charts/TopCategoriesChart"

interface TabMetricsProps {
  customerId: string
}

export default function TabMetrics({ customerId }: TabMetricsProps) {
  const { toast } = useToast()
  const [chartData, setChartData] = useState<CustomerChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })

  // Período padrão: últimos 12 meses
  const getDefaultPeriod = () => {
    const end = new Date()
    const start = new Date()
    start.setMonth(end.getMonth() - 11)

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    }
  }

  useEffect(() => {
    if (customerId) {
      const defaultPeriod = getDefaultPeriod()
      setPeriod(defaultPeriod)
      fetchChartData(defaultPeriod.start, defaultPeriod.end)
    }
  }, [customerId])

  const fetchChartData = async (startDate: string, endDate: string) => {
    try {
      setIsLoading(true)
      const data = await customersService.getCustomerAnalytics(customerId, startDate, endDate)
      setChartData(data)
      setPeriod({ start: startDate, end: endDate })
    } catch (error) {
      toast({
        title: "Erro ao carregar gráficos",
        description: "Não foi possível obter os dados analíticos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPeriod(prev => ({ ...prev, [name]: value }))
  }

  const applyPeriod = () => {
    if (period.start && period.end) {
      fetchChartData(period.start, period.end)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum dado disponível para gráficos</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles de período */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-500">Data Início</label>
              <input
                type="date"
                name="start"
                value={period.start}
                onChange={handlePeriodChange}
                className="h-10 px-3 py-2 border border-gray-200 rounded-md text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-500">Data Fim</label>
              <input
                type="date"
                name="end"
                value={period.end}
                onChange={handlePeriodChange}
                className="h-10 px-3 py-2 border border-gray-200 rounded-md text-sm"
              />
            </div>
            <Button onClick={applyPeriod} className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LTV Evolution */}
        <LTVEvolutionChart data={chartData.ltvEvolution} />

        {/* Purchase Frequency */}
        <PurchaseFrequencyChart data={chartData.purchaseFrequency} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Categories */}
        <TopCategoriesChart data={chartData.topCategories} />

        {/* Placeholder para AOV Distribution (futuro) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Distribuição de Valor Médio por Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Em desenvolvimento</p>
              <p className="text-sm">Distribuição por faixa de valor</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do período */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Período de Análise</p>
              <p className="text-sm text-blue-700">
                {new Date(chartData.startPeriod).toLocaleDateString('pt-BR')} -{' '}
                {new Date(chartData.endPeriod).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-900">Total de Categorias</p>
              <p className="text-2xl font-bold text-blue-600">{chartData.topCategories.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}