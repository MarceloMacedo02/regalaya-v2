"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Truck,
  Plus,
  Edit,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Package,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react"
import type { Supplier } from "@/types/inventory"

interface ThirdPartyListProps {
  suppliers: Supplier[]
  onAddSupplier?: () => void
  onEditSupplier?: (supplier: Supplier) => void
}

export function ThirdPartyList({ suppliers, onAddSupplier, onEditSupplier }: ThirdPartyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || supplier.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Supplier["status"]) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      blocked: "destructive",
    } as const

    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      blocked: "Bloqueado",
    } as const

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsDetailOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Fornecedores e Parceiros
            </div>
            <Button onClick={() => onAddSupplier?.()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, empresa ou contato..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Prazo Entrega</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Truck className="h-12 w-12" />
                        <p>Nenhum fornecedor encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div className="font-semibold">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {supplier.companyName}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {supplier.cnpj}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {supplier.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {supplier.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <Package className="h-3 w-3 mr-1" />
                          {supplier.products.length} produtos
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {supplier.averageDeliveryDays} dias
                        </div>
                      </TableCell>
                      <TableCell>{getRatingStars(supplier.rating)}</TableCell>
                      <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(supplier)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditSupplier?.(supplier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Fornecedor */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedSupplier && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {selectedSupplier.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedSupplier.companyName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status e Avaliação */}
                <div className="flex items-center justify-between">
                  <div>{getStatusBadge(selectedSupplier.status)}</div>
                  {getRatingStars(selectedSupplier.rating)}
                </div>

                {/* Informações de Contato */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Informações de Contato</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>CNPJ</Label>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSupplier.cnpj}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSupplier.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSupplier.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Pessoa de Contato</Label>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSupplier.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Endereço</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p>{selectedSupplier.address.street}, {selectedSupplier.address.number}</p>
                      {selectedSupplier.address.complement && (
                        <p className="text-sm text-muted-foreground">
                          {selectedSupplier.address.complement}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {selectedSupplier.address.city} - {selectedSupplier.address.state}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CEP: {selectedSupplier.address.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informações Comerciais */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Informações Comerciais</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Prazo Médio de Entrega</Label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{selectedSupplier.averageDeliveryDays} dias</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Condições de Pagamento</Label>
                      <p className="text-sm">{selectedSupplier.paymentTerms}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Produtos Vinculados</Label>
                      <Badge variant="secondary">
                        {selectedSupplier.products.length} produtos
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Produtos */}
                {selectedSupplier.products.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Produtos</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID do Produto</TableHead>
                            <TableHead>Nome</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedSupplier.products.map((productId) => (
                            <TableRow key={productId}>
                              <TableCell className="font-mono text-xs">
                                {productId}
                              </TableCell>
                              <TableCell>
                                {/* Aqui poderia buscar o nome do produto */}
                                Produto {productId}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Observações */}
                {selectedSupplier.notes && (
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={selectedSupplier.notes}
                      readOnly
                      className="bg-muted"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  onEditSupplier?.(selectedSupplier)
                  setIsDetailOpen(false)
                }}>
                  Editar Fornecedor
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
