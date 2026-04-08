"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings as SettingsIcon,
  Store,
  Mail,
  CreditCard,
  Truck,
  Save,
  HelpCircle,
  Shield,
} from "lucide-react"
import { storeSettings, StoreSettings as StoreSettingsType } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettingsType>(storeSettings)
  const { toast } = useToast()

  const handleSaveGeneral = () => {
    toast({
      title: "Sucesso",
      description: "Configurações gerais salvas com sucesso.",
    })
  }

  const handleSaveEmail = () => {
    toast({
      title: "Sucesso",
      description: "Configurações de e-mail salvas com sucesso.",
    })
  }

  const handleSavePayment = () => {
    toast({
      title: "Sucesso",
      description: "Configurações de pagamento salvas com sucesso.",
    })
  }

  const handleSaveShipping = () => {
    toast({
      title: "Sucesso",
      description: "Configurações de frete salvas com sucesso.",
    })
  }

  const updateGeneral = (field: keyof typeof settings.general, value: string) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [field]: value,
      },
    })
  }

  const updateEmail = (field: keyof typeof settings.email, value: string | number | boolean) => {
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        [field]: value,
      },
    })
  }

  const updatePayment = (field: keyof typeof settings.payment, value: string | number | boolean) => {
    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        [field]: value,
      },
    })
  }

  const updateShipping = (field: keyof typeof settings.shipping, value: string | number | boolean) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        [field]: value,
      },
    })
  }

  const updateShippingMethod = (index: number, field: keyof typeof settings.shipping.shippingMethods[0], value: string | number | boolean) => {
    const updatedMethods = settings.shipping.shippingMethods.map((method, i) =>
      i === index ? { ...method, [field]: value } : method
    )
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        shippingMethods: updatedMethods,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da loja
          </p>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <a href="/admin/settings/permissions">
            <Shield className="h-4 w-4" />
            Gerenciar Permissões
          </a>
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">E-mail</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pagamento</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Frete</span>
          </TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informações da Loja
              </CardTitle>
              <CardDescription>
                Configure as informações básicas da sua loja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Nome da Loja</Label>
                  <Input
                    id="store-name"
                    value={settings.general.storeName}
                    onChange={(e) => updateGeneral("storeName", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-email">E-mail de Contato</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={settings.general.storeEmail}
                    onChange={(e) => updateGeneral("storeEmail", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="store-phone">Telefone</Label>
                  <Input
                    id="store-phone"
                    value={settings.general.storePhone}
                    onChange={(e) => updateGeneral("storePhone", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-cnpj">CNPJ</Label>
                  <Input
                    id="store-cnpj"
                    value={settings.general.storeCnpj}
                    onChange={(e) => updateGeneral("storeCnpj", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="store-address">Endereço</Label>
                <Textarea
                  id="store-address"
                  value={settings.general.storeAddress}
                  onChange={(e) => updateGeneral("storeAddress", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="working-hours">Horário de Funcionamento</Label>
                  <Input
                    id="working-hours"
                    value={settings.general.workingHours}
                    onChange={(e) => updateGeneral("workingHours", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateGeneral("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">Brasília (UTC-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                      <SelectItem value="America/Noronha">Fernando de Noronha (UTC-2)</SelectItem>
                      <SelectItem value="America/Rio_Branco">Acre (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) => updateGeneral("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveGeneral} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de E-mail */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configurações de SMTP
              </CardTitle>
              <CardDescription>
                Configure o servidor de e-mail para envio de notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input
                    id="smtp-host"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateEmail("smtpHost", e.target.value)}
                    placeholder="smtp.exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateEmail("smtpPort", parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-user">Usuário</Label>
                  <Input
                    id="smtp-user"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateEmail("smtpUser", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtp-password">Senha</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="smtp-secure"
                  checked={settings.email.smtpSecure}
                  onCheckedChange={(checked) => updateEmail("smtpSecure", checked)}
                />
                <Label htmlFor="smtp-secure">Usar conexão segura (SSL/TLS)</Label>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">E-mail de Remetente</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="from-email">E-mail</Label>
                    <Input
                      id="from-email"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateEmail("fromEmail", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="from-name">Nome</Label>
                    <Input
                      id="from-name"
                      value={settings.email.fromName}
                      onChange={(e) => updateEmail("fromName", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveEmail} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Pagamento */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pagamento
              </CardTitle>
              <CardDescription>
                Configure as formas de pagamento aceitas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PIX */}
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">PIX</h4>
                    <p className="text-sm text-muted-foreground">
                      Pagamento instantâneo com QR Code
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment.pixEnabled}
                    onCheckedChange={(checked) => updatePayment("pixEnabled", checked)}
                  />
                </div>
                {settings.payment.pixEnabled && (
                  <div className="grid gap-2">
                    <Label htmlFor="pix-key">Chave PIX</Label>
                    <Input
                      id="pix-key"
                      value={settings.payment.pixKey}
                      onChange={(e) => updatePayment("pixKey", e.target.value)}
                      placeholder="CNPJ, e-mail, telefone ou CPF"
                    />
                  </div>
                )}
                {settings.payment.pixEnabled && (
                  <div className="grid gap-2">
                    <Label htmlFor="pix-discount">Desconto para PIX (%)</Label>
                    <Input
                      id="pix-discount"
                      type="number"
                      value={settings.payment.pixDiscount || 0}
                      onChange={(e) => updatePayment("pixDiscount", parseFloat(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Os clientes terão este desconto ao pagar com PIX
                    </p>
                  </div>
                )}
              </div>

              {/* Cartão de Crédito */}
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Cartão de Crédito</h4>
                    <p className="text-sm text-muted-foreground">
                      Pagamento parcelado em até 12x
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment.creditCardEnabled}
                    onCheckedChange={(checked) => updatePayment("creditCardEnabled", checked)}
                  />
                </div>
                {settings.payment.creditCardEnabled && (
                  <div className="grid gap-2">
                    <Label htmlFor="max-installments">Número Máximo de Parcelas</Label>
                    <Select
                      value={String(settings.payment.maxInstallments)}
                      onValueChange={(value) => updatePayment("maxInstallments", parseInt(value))}
                    >
                      <SelectTrigger id="max-installments">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="3">3x</SelectItem>
                        <SelectItem value="6">6x</SelectItem>
                        <SelectItem value="10">10x</SelectItem>
                        <SelectItem value="12">12x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Cartão de Débito */}
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Cartão de Débito</h4>
                    <p className="text-sm text-muted-foreground">
                      Pagamento à vista
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment.debitCardEnabled}
                    onCheckedChange={(checked) => updatePayment("debitCardEnabled", checked)}
                  />
                </div>
              </div>

              {/* Boleto */}
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Boleto Bancário</h4>
                    <p className="text-sm text-muted-foreground">
                      Pagamento via boleto (1-3 dias úteis para compensação)
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment.boletoEnabled}
                    onCheckedChange={(checked) => updatePayment("boletoEnabled", checked)}
                  />
                </div>
              </div>

              <Button onClick={handleSavePayment} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Frete */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Configurações de Frete
              </CardTitle>
              <CardDescription>
                Configure as opções de entrega e retirada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Frete Grátis */}
              <div className="grid gap-2">
                <Label htmlFor="free-shipping">Valor Mínimo para Frete Grátis</Label>
                <div className="flex gap-2">
                  <Input
                    id="free-shipping"
                    type="number"
                    value={settings.shipping.freeShippingMinValue}
                    onChange={(e) => updateShipping("freeShippingMinValue", parseFloat(e.target.value))}
                  />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Pedidos acima deste valor terão frete grátis
                  </div>
                </div>
              </div>

              {/* Retirada na Loja */}
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Retirada na Loja</h4>
                    <p className="text-sm text-muted-foreground">
                      Permitir que clientes retirem pedidos na loja física
                    </p>
                  </div>
                  <Switch
                    checked={settings.shipping.localPickupEnabled}
                    onCheckedChange={(checked) => updateShipping("localPickupEnabled", checked)}
                  />
                </div>
                {settings.shipping.localPickupEnabled && (
                  <div className="grid gap-2">
                    <Label htmlFor="pickup-address">Endereço para Retirada</Label>
                    <Textarea
                      id="pickup-address"
                      value={settings.shipping.localPickupAddress}
                      onChange={(e) => updateShipping("localPickupAddress", e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Métodos de Entrega */}
              <div className="space-y-4">
                <h4 className="font-semibold">Métodos de Entrega</h4>
                {settings.shipping.shippingMethods.map((method, index) => (
                  <div key={method.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                          {index + 1}
                        </div>
                        <Input
                          value={method.name}
                          onChange={(e) => updateShippingMethod(index, "name", e.target.value)}
                          className="w-32 font-semibold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`method-enabled-${index}`} className="text-sm">
                          Ativo
                        </Label>
                        <Switch
                          id={`method-enabled-${index}`}
                          checked={method.enabled}
                          onCheckedChange={(checked) => updateShippingMethod(index, "enabled", checked)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor={`method-desc-${index}`}>Descrição</Label>
                        <Input
                          id={`method-desc-${index}`}
                          value={method.description}
                          onChange={(e) => updateShippingMethod(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`method-price-${index}`}>Preço (R$)</Label>
                        <Input
                          id={`method-price-${index}`}
                          type="number"
                          step="0.01"
                          value={method.price}
                          onChange={(e) => updateShippingMethod(index, "price", parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`method-days-${index}`}>Prazo (dias)</Label>
                        <Input
                          id={`method-days-${index}`}
                          type="number"
                          value={method.deliveryDays}
                          onChange={(e) => updateShippingMethod(index, "deliveryDays", parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveShipping} className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
