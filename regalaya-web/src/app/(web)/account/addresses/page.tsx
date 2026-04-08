"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  Building,
  Star,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { addressService } from "@/services"
import type { Address, CreateAddressRequest } from "@/types/user"

const SPECIAL_DATE_LABELS: Record<string, string> = {
  BIRTHDAY: "Aniversário",
  ANNIVERSARY: "Aniversário de Casamento",
  CHRISTMAS: "Natal",
  WEDDING: "Casamento",
  CUSTOM: "Data Especial",
}

const STATE_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export default function AddressesPage() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<CreateAddressRequest>({
    label: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    isDefault: false,
  })

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await addressService.getAll()
      setAddresses(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar endereços",
        description: "Não foi possível carregar seus endereços. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const resetForm = () => {
    setFormData({
      label: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      isDefault: false,
    })
    setEditingAddress(null)
  }

  const handleOpenAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleOpenEditDialog = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      label: address.label,
      zipCode: address.zipCode,
      street: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      isDefault: address.isDefault,
    })
    setIsAddDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      if (editingAddress) {
        await addressService.update(editingAddress.id, {
          ...formData,
        })
        toast({
          title: "Endereço atualizado",
          description: "O endereço foi atualizado com sucesso.",
        })
      } else {
        await addressService.create(formData)
        toast({
          title: "Endereço adicionado",
          description: "O endereço foi cadastrado com sucesso.",
        })
      }
      
      setIsAddDialogOpen(false)
      resetForm()
      fetchAddresses()
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o endereço. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefault(id)
      toast({
        title: "Endereço padrão atualizado",
        description: "Este endereço será usado como padrão nas próximas compras.",
      })
      fetchAddresses()
    } catch (error) {
      toast({
        title: "Erro ao definir padrão",
        description: "Não foi possível definir o endereço como padrão.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return
    
    try {
      await addressService.delete(id)
      toast({
        title: "Endereço excluído",
        description: "O endereço foi removido com sucesso.",
      })
      fetchAddresses()
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o endereço.",
        variant: "destructive",
      })
    }
  }

  const formatZipCode = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 5) return digits
    if (digits.length <= 8) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Endereços</h1>
          <p className="text-muted-foreground">
            Gerencie seus endereços de entrega e cobrança
          </p>
        </div>
        <Button onClick={handleOpenAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Endereço
        </Button>
      </div>

      {/* Address Form Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Editar Endereço" : "Adicionar Novo Endereço"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para {editingAddress ? "atualizar" : "cadastrar"} um endereço.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">Identificação *</Label>
              <Input
                id="label"
                placeholder="Ex: Casa, Trabalho, etc."
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                placeholder="00000-000"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: formatZipCode(e.target.value) })}
                maxLength={9}
                required
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3 grid gap-2">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="complement">Complemento (opcional)</Label>
              <Input
                id="complement"
                placeholder="Apto, bloco, etc."
                value={formData.complement || ""}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">Estado *</Label>
                <select
                  id="state"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                >
                  <option value="">Selecione</option>
                  {STATE_OPTIONS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="default"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: !!checked })}
              />
              <Label htmlFor="default">Usar como endereço padrão</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.label || !formData.zipCode || !formData.street || !formData.number || !formData.neighborhood || !formData.city || !formData.state}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Endereço"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum endereço cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Cadastre seu primeiro endereço de entrega.
            </p>
            <Button onClick={handleOpenAddDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Endereço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {address.label.toLowerCase().includes("trabalho") ? (
                        <Building className="h-4 w-4 text-primary" />
                      ) : (
                        <Home className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">{address.label}</CardTitle>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          <Star className="h-3 w-3 mr-1" />
                          Padrão
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                  <p>{address.street}, {address.number}</p>
                  {address.complement && <p>{address.complement}</p>}
                  <p>{address.neighborhood}</p>
                  <p>{address.city} - {address.state}</p>
                  <p>CEP: {address.zipCode}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Star className="h-3 w-3 mr-2" />
                      Tornar padrão
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditDialog(address)}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    disabled={address.isDefault}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}