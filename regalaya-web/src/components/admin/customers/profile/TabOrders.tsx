"use client"

import { useState, useEffect, useCallback } from "react"
import { customersService, type CustomerOrderSummary, type OrderFilterRequest } from "@/services"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2, Download, Eye, ChevronUp, ChevronDown, FileDown } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import OrderDetailsModal from "@/components/admin/customers/orders/OrderDetailsModal"

interface TabOrdersProps {
  customerId: string
  customerName: string
}

const ORDER_STATUS = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendente" },
  { value: "PAID", label: "Pago" },
  { value: "PROCESSING", label: "Processando" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
]

const SORT_OPTIONS = [
  { value: "createdAt", label: "Data" },
  { value: "total", label: "Valor" },
  { value: "status", label: "Status" },
]

export default function TabOrders({ customerId, customerName }: TabOrdersProps) {
  const { toast } = useToast()

  // Estados
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Filtros
  const [status, setStatus] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [productName, setProductName] = useState<string>("")
  const [page, setPage] = useState(0)
  const [size] = useState(20)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Modal de detalhes
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const filter: OrderFilterRequest = {
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        productName: productName || undefined,
        page,
        size,
        sortBy,
        sortDirection,
      }

      const response = await customersService.getCustomerOrders(customerId, filter)
      setOrders(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível obter o histórico de pedidos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [customerId, status, startDate, endDate, productName, page, size, sortBy, sortDirection, toast])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [status, startDate, endDate, productName, sortBy, sortDirection])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  const handleExportCsv = async () => {
    try {
      const filter: OrderFilterRequest = {
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        productName: productName || undefined,
      }

      const csv = await customersService.exportCustomerOrdersToCsv(customerId, filter)

      // Criar blob e download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `cliente_${customerId}_pedidos_${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Sucesso",
        description: "Arquivo CSV exportado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o CSV.",
        variant: "destructive",
      })
    }
  }

  const openOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsModalOpen(true)
  }

  const getStatusBadgeColor = (orderStatus: string) => {
    switch (orderStatus) {
      case "PAID":
      case "DELIVERED":
        return "bg-green-100 text-green-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      case "PROCESSING":
        return "bg-blue-100 text-blue-700"
      case "SHIPPED":
        return "bg-purple-100 text-purple-700"
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Data Início</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Data Fim</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Buscar Produto</label>
              <Input
                placeholder="Nome do produto..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                onClick={handleExportCsv}
                className="flex-1 gap-2"
              >
                <FileDown className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de pedidos */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nº Pedido</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center gap-1">
                          Data
                          {sortBy === "createdAt" && (
                            sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("total")}
                      >
                        <div className="flex items-center gap-1">
                          Valor
                          {sortBy === "total" && (
                            sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortBy === "status" && (
                            sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatPrice(order.total)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{order.itemCount}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openOrderDetails(order.id)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="border-t p-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(0, p - 1))}
                          className={page === 0 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPage(i)}
                            isActive={page === i}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                          className={page >= totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Mostrando {orders.length} de {totalElements} pedidos
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes do pedido */}
      {selectedOrderId && (
        <OrderDetailsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderId={selectedOrderId}
          customerName={customerName}
        />
      )}
    </div>
  )
}