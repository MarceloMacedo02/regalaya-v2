"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/useCart"
import { ordersService } from "@/services/orders.service"
import { addressService } from "@/services/address.service"
import { shippingService } from "@/services/shipping.service"
import { paymentService } from "@/services/payment.service"
import type { Address } from "@/types/user"
import type { ShippingOption } from "@/types/shipping"
import type { PaymentMethodType, PaymentStatus as PaymentStatusType } from "@/types/payment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Truck,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Check,
  Loader2,
  Package,
  Copy,
  CheckCircle2,
  Timer,
  QrCode,
  Lock,
  AlertCircle,
  Plus,
  RefreshCw
} from "lucide-react"
import { formatCurrency, formatCEP, calculateBusinessDays, formatTime, formatCardExpiry, formatCVV } from "@/lib/checkout-utils"
import { memo } from "react"

// --- Types ---
interface AddressForm {
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  saveAddress: boolean
}

interface CardForm {
  name: string
  expiry: string
  cvv: string
  installments: number
  saveCard: boolean
}

type PaymentMethod = "pix" | "card"
type PaymentStatus = "pending" | "processing" | "completed" | "expired" | "failed"

// --- Main Component ---
export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart, isLoading: cartLoading } = useCart()
  const { toast } = useToast()

  // Step state
  const [step, setStep] = useState<"address" | "shipping" | "payment">("address")

  // Address state
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState<AddressForm>({
    zipCode: "", street: "", number: "", complement: "",
    neighborhood: "", city: "", state: "", saveAddress: false,
  })
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  // Shipping state
  const [isLoadingShipping, setIsLoadingShipping] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null)

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  // PIX state
  const [pixQrCode, setPixQrCode] = useState<string>("")
  const [pixCopyCode, setPixCopyCode] = useState<string>("")
  const [pixTimeRemaining, setPixTimeRemaining] = useState(600) // 10 min
  const [pixCopied, setPixCopied] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  // Card state
  const [cardForm, setCardForm] = useState<CardForm>({
    name: "", expiry: "", cvv: "", installments: 1, saveCard: false,
  })
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof CardForm, string>>>({})
  const [isProcessingCard, setIsProcessingCard] = useState(false)

  // --- Effects ---

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoadingAddresses(true)
      try {
        const addresses = await addressService.getAll()
        setSavedAddresses(addresses)
        if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id)
        }
      } catch {
        // Silently fail - user can enter manually
      } finally {
        setIsLoadingAddresses(false)
      }
    }
    fetchAddresses()
  }, [])

  // Calculate shipping when address is selected
  useEffect(() => {
    if (!selectedAddressId || items.length === 0) return

    const calculateShipping = async () => {
      const address = savedAddresses.find(a => a.id === selectedAddressId)
      if (!address?.zipCode) return

      setIsLoadingShipping(true)
      try {
        const cleanZip = address.zipCode.replace(/\D/g, "")
        // Estimate weight: 0.5kg per item
        const totalWeight = items.reduce((sum, item) => sum + item.quantity * 0.5, 0)

        const response = await shippingService.calculateShipping({
          zipCode: cleanZip,
          weight: totalWeight,
          dimensions: { length: 20, width: 15, height: 10 },
        })

        setShippingOptions(response.options)

        // Auto-select cheapest or free option
        const freeOption = response.options.find(o => o.price === 0)
        const cheapest = response.options[0]
        setSelectedShippingOption(freeOption || cheapest)

      } catch (error) {
        console.error("Shipping calculation error:", error)
        toast({
          title: "Erro no cálculo de frete",
          description: "Usando valor estimado de R$ 29,90",
          variant: "destructive",
        })
      } finally {
        setIsLoadingShipping(false)
      }
    }

    calculateShipping()
  }, [selectedAddressId, items, savedAddresses])

  // PIX countdown timer
  useEffect(() => {
    if (step !== "payment" || paymentMethod !== "pix" || paymentStatus !== "pending") return

    const timer = setInterval(() => {
      setPixTimeRemaining((prev) => {
        if (prev <= 1) {
          setPaymentStatus("expired")
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step, paymentMethod, paymentStatus])

  // PIX polling
  useEffect(() => {
    if (step !== "payment" || paymentMethod !== "pix" || !createdOrderId) return

    pollingRef.current = setInterval(async () => {
      try {
        const status = await paymentService.getPaymentStatus(createdOrderId)
        if (status.status === "paid") {
          clearCart()
          router.push(`/checkout/success?order=${createdOrderId}&method=pix`)
        }
      } catch {
        // Polling error - ignore
      }
    }, 5000)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [step, paymentMethod, createdOrderId, router, clearCart])

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      toast({ title: "Carrinho vazio", description: "Adicione produtos antes de fazer checkout." })
      router.push("/products")
    }
  }, [cartLoading, items.length, router, toast])

  // --- Handlers ---

  const handleCepSearch = useCallback(async () => {
    const cleanZip = addressForm.zipCode.replace(/\D/g, "")
    if (cleanZip.length !== 8) return

    setIsLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setAddressForm(prev => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }))
      } else {
        toast({ title: "CEP não encontrado", description: "Verifique o CEP informado.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Erro ao buscar CEP", description: "Verifique sua conexão.", variant: "destructive" })
    } finally {
      setIsLoadingCep(false)
    }
  }, [addressForm.zipCode, toast])

  const handleAddressFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const required = ["zipCode", "street", "number", "neighborhood", "city", "state"] as const
    const missing = required.filter(field => !addressForm[field])

    if (missing.length > 0) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos do endereço.", variant: "destructive" })
      return
    }

    // If user wants to save address, create it first
    if (addressForm.saveAddress) {
      try {
        const newAddress = await addressService.create({
          label: `${addressForm.street}, ${addressForm.number}`,
          zipCode: addressForm.zipCode.replace(/\D/g, ""),
          street: addressForm.street,
          number: addressForm.number,
          complement: addressForm.complement || undefined,
          neighborhood: addressForm.neighborhood,
          city: addressForm.city,
          state: addressForm.state,
          isDefault: savedAddresses.length === 0,
        })
        setSelectedAddressId(newAddress.id)
        setSavedAddresses(prev => [...prev, newAddress])
      } catch {
        toast({ title: "Erro ao salvar endereço", description: "Tente novamente.", variant: "destructive" })
        return
      }
    }

    setStep("shipping")
  }

  const handleShippingContinue = () => {
    if (!selectedShippingOption) {
      toast({ title: "Selecione o frete", description: "Escolha uma opção de entrega.", variant: "destructive" })
      return
    }
    setStep("payment")
  }

  const shippingCost = selectedShippingOption?.price || 0
  const total = subtotal + shippingCost

  // --- Payment Handlers ---

  const createOrder = async (): Promise<string> => {
    const request = {
      addressId: selectedAddressId || undefined,
      paymentMethod: paymentMethod?.toUpperCase() === "PIX" ? "PIX" : "CREDIT_CARD",
    }

    const order = await ordersService.createOrderFromCart(request)
    return order.id
  }

  const handlePixPayment = async () => {
    setIsSubmitting(true)
    try {
      // 1. Create order
      const orderId = await createOrder()
      setCreatedOrderId(orderId)

      // 2. Create PIX payment intent
      const pixIntent = await paymentService.createIntent({
        orderId,
        paymentMethod: "PIX",
      })

      // 3. Show QR code
      setPixQrCode(pixIntent.qrCode || "")
      setPixCopyCode(pixIntent.copyPasteCode || "")
      setPixTimeRemaining(600) // 10 min
      setPaymentStatus("pending")

      toast({
        title: "PIX gerado",
        description: "Escaneie o QR Code ou copie o código para pagar.",
      })

    } catch (error: unknown) {
      console.error("PIX payment error:", error)
      const message = error instanceof Error ? error.message : "Erro ao gerar PIX"
      toast({ title: "Erro no PIX", description: message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePixCopy = async () => {
    await navigator.clipboard.writeText(pixCopyCode)
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 2000)
  }

  const handlePixConfirm = async () => {
    setPaymentStatus("processing")
    // Polling will handle redirect when payment is confirmed
  }

  const handleCardChange = (field: keyof CardForm, value: string | number | boolean) => {
    let formattedValue = value

    if (field === "expiry") {
      formattedValue = value.toString().replace(/\D/g, "").slice(0, 4)
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2)
      }
    }

    if (field === "cvv") {
      formattedValue = value.toString().replace(/\D/g, "").slice(0, 4)
    }

    setCardForm(prev => ({ ...prev, [field]: formattedValue }))
    setCardErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validateCardForm = (): boolean => {
    const errors: Partial<Record<keyof CardForm, string>> = {}

    if (!cardForm.name || cardForm.name.length < 3) {
      errors.name = "Nome completo é obrigatório"
    }

    if (!cardForm.expiry || cardForm.expiry.length < 5) {
      errors.expiry = "Data de validade inválida"
    }

    if (!cardForm.cvv || cardForm.cvv.length < 3) {
      errors.cvv = "CVV inválido"
    }

    setCardErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCardForm()) return

    setIsProcessingCard(true)
    try {
      // 1. Create order
      const orderId = await createOrder()

      // 2. Create card payment intent
      const cardIntent = await paymentService.createIntent({
        orderId,
        paymentMethod: "CREDIT_CARD",
        installments: cardForm.installments,
      })

      // 3. In production, call Stripe.confirmCardPayment(clientSecret) here
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 2000))

      clearCart()
      router.push(`/checkout/success?order=${orderId}&method=card`)

    } catch (error: unknown) {
      console.error("Card payment error:", error)
      const message = error instanceof Error ? error.message : "Erro ao processar pagamento"
      toast({ title: "Pagamento recusado", description: message, variant: "destructive" })
    } finally {
      setIsProcessingCard(false)
    }
  }

  const formatPixTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // --- Loading state ---
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  if (items.length === 0) {
    return null // Will redirect via effect
  }

  // --- Render ---
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-4">
        <StepIndicator label="Endereço" icon={MapPin} isActive={step === "address"} isCompleted={step !== "address"} />
        <div className="h-px w-12 bg-zinc-300" />
        <StepIndicator label="Frete" icon={Truck} isActive={step === "shipping"} isCompleted={step === "payment"} />
        <div className="h-px w-12 bg-zinc-300" />
        <StepIndicator label="Pagamento" icon={CreditCard} isActive={step === "payment"} isCompleted={false} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground">Selecione um endereço salvo</h3>
                    <RadioGroup
                      value={selectedAddressId || ""}
                      onValueChange={setSelectedAddressId}
                      className="space-y-3"
                    >
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                            selectedAddressId === addr.id
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                          }`}
                        >
                          <RadioGroupItem value={addr.id} className="mt-1" />
                          <div className="flex-1">
                            <p className="font-medium">{addr.street}, {addr.number}</p>
                            <p className="text-sm text-muted-foreground">
                              {addr.neighborhood}, {addr.city}/{addr.state}
                            </p>
                            {addr.zipCode && <p className="text-xs text-muted-foreground">CEP: {addr.zipCode}</p>}
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* New Address */}
                <button
                  type="button"
                  onClick={() => setSelectedAddressId(null)}
                  className={`flex w-full items-center gap-2 rounded-lg border-2 p-4 text-left transition-all ${
                    !selectedAddressId
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Novo endereço</span>
                </button>

                {!selectedAddressId && (
                  <form onSubmit={handleAddressFormSubmit} className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="zipCode">CEP</Label>
                        <div className="flex gap-2">
                          <Input
                            id="zipCode"
                            placeholder="00000-000"
                            value={addressForm.zipCode}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, zipCode: formatCEP(e.target.value) }))}
                            maxLength={9}
                          />
                          <Button type="button" variant="outline" onClick={handleCepSearch}
                            disabled={addressForm.zipCode.replace(/\D/g, "").length !== 8 || isLoadingCep}>
                            {isLoadingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street">Rua/Avenida</Label>
                      <Input id="street" value={addressForm.street}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" value={addressForm.number}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, number: e.target.value }))} />
                      </div>
                      <div>
                        <Label htmlFor="complement">Complemento (opcional)</Label>
                        <Input id="complement" value={addressForm.complement}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, complement: e.target.value }))} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input id="neighborhood" value={addressForm.neighborhood}
                        onChange={(e) => setAddressForm(prev => ({ ...prev, neighborhood: e.target.value }))} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" value={addressForm.city}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))} />
                      </div>
                      <div>
                        <Label htmlFor="state">UF</Label>
                        <Input id="state" maxLength={2} value={addressForm.state}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value.toUpperCase() }))} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id="saveAddress" checked={addressForm.saveAddress}
                        onCheckedChange={(checked) => setAddressForm(prev => ({ ...prev, saveAddress: checked as boolean }))} />
                      <Label htmlFor="saveAddress" className="text-sm">Salvar endereço para próximas compras</Label>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Continuar para Frete <Truck className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping */}
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Opções de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingShipping ? (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                    <p className="text-muted-foreground">Calculando frete...</p>
                  </div>
                ) : shippingOptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                    <p className="text-muted-foreground">Não foi possível calcular o frete.</p>
                    <Button variant="outline" onClick={() => setStep("address")}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Voltar e revisar endereço
                    </Button>
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={selectedShippingOption?.service || ""}
                      onValueChange={(value) => {
                        const option = shippingOptions.find(o => o.service === value)
                        if (option) setSelectedShippingOption(option)
                      }}
                      className="space-y-3"
                    >
                      {shippingOptions.map((option) => (
                        <label
                          key={option.service}
                          className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
                            selectedShippingOption?.service === option.service
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value={option.service} />
                            <div>
                              <p className="font-medium">{option.carrier} - {option.service}</p>
                              <p className="text-sm text-muted-foreground">
                                Entrega estimada: {calculateBusinessDays(option.estimatedDays)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${option.price === 0 ? "text-green-600" : ""}`}>
                              {option.price === 0 ? "Grátis" : `R$ ${formatCurrency(option.price)}`}
                            </p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>

                    <div className="mt-6 flex gap-4">
                      <Button variant="outline" onClick={() => setStep("address")}>Voltar</Button>
                      <Button className="flex-1" size="lg" onClick={handleShippingContinue}
                        disabled={!selectedShippingOption}>
                        Continuar para Pagamento <CreditCard className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!paymentMethod ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Escolha o método de pagamento:</p>
                    <div className="grid gap-3">
                      <button type="button" onClick={() => setPaymentMethod("pix")}
                        className="flex items-center justify-between rounded-lg border-2 p-4 text-left transition-all hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                            <QrCode className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">PIX</p>
                            <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                          </div>
                        </div>
                      </button>

                      <button type="button" onClick={() => setPaymentMethod("card")}
                        className="flex items-center justify-between rounded-lg border-2 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Cartão de Crédito</p>
                            <p className="text-sm text-muted-foreground">Parcele em até 12x</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <Button variant="ghost" onClick={() => setStep("shipping")}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Frete
                    </Button>
                  </div>
                ) : paymentMethod === "pix" ? (
                  <PixPaymentSection
                    status={paymentStatus}
                    qrCode={pixQrCode}
                    copyCode={pixCopyCode}
                    timeRemaining={pixTimeRemaining}
                    copied={pixCopied}
                    isSubmitting={isSubmitting}
                    onGenerate={handlePixPayment}
                    onCopy={handlePixCopy}
                    onConfirm={handlePixConfirm}
                    onChangeMethod={() => setPaymentMethod(null)}
                    formatTime={formatPixTime}
                  />
                ) : (
                  <CardPaymentSection
                    cardForm={cardForm}
                    cardErrors={cardErrors}
                    isProcessing={isProcessingCard}
                    total={total}
                    onChange={handleCardChange}
                    onSubmit={handleCardPayment}
                    onChangeMethod={() => setPaymentMethod(null)}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} />
      </div>
    </div>
  )
}

// --- Sub-components ---

function StepIndicator({ label, icon: Icon, isActive, isCompleted }: {
  label: string; icon: React.ElementType; isActive: boolean; isCompleted: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${isActive ? "text-amber-600" : isCompleted ? "text-green-600" : "text-zinc-400"}`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
        isActive ? "bg-amber-100" : isCompleted ? "bg-green-100" : "bg-zinc-100"
      }`}>
        {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

function OrderSummary({ items, subtotal, shippingCost }: {
  items: { productId: string; productName: string; productImage: string; unitPrice: number; quantity: number }[]
  subtotal: number; shippingCost: number
}) {
  const total = subtotal + shippingCost

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24">
        <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-zinc-100">
                  {item.productImage ? (
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-zinc-300" />
                    </div>
                  )}
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-600 text-xs text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span>{shippingCost === 0 ? <span className="text-green-600">Grátis</span> : `R$ ${formatCurrency(shippingCost)}`}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span>R$ {formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PixPaymentSection({ status, qrCode, copyCode, timeRemaining, copied, isSubmitting, onGenerate, onCopy, onConfirm, onChangeMethod, formatTime }: {
  status: PaymentStatus; qrCode: string; copyCode: string; timeRemaining: number;
  copied: boolean; isSubmitting: boolean; onGenerate: () => void; onCopy: () => void;
  onConfirm: () => void; onChangeMethod: () => void; formatTime: (s: number) => string
}) {
  if (status === "pending" && !qrCode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Pagar com PIX</h3>
          <Button variant="ghost" size="sm" onClick={onChangeMethod}>Alterar</Button>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <p className="font-medium mb-2">Vantagens do PIX:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Confirmação instantânea</li>
            <li>Sem necessidade de cartão</li>
          </ul>
        </div>
        <Button className="w-full" size="lg" onClick={onGenerate} disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</> : <>Gerar QR Code PIX <QrCode className="ml-2 h-4 w-4" /></>}
        </Button>
      </div>
    )
  }

  if (status === "pending" && qrCode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Pague com PIX</h3>
          <Button variant="ghost" size="sm" onClick={onChangeMethod}>Alterar</Button>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-950">
          <Timer className="h-5 w-5" />
          <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-6">
          <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-white">
            <QrCode className="h-32 w-32 text-zinc-800" />
          </div>
          <p className="text-sm text-muted-foreground">Escaneie o QR Code com seu banco</p>
        </div>

        <div className="space-y-2">
          <Label>Ou copie o código PIX:</Label>
          <div className="flex gap-2">
            <Input value={copyCode} readOnly className="font-mono text-xs" />
            <Button variant="outline" onClick={onCopy} className="shrink-0">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <p className="font-medium mb-2">Como pagar:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Abra o app do seu banco</li>
            <li>Escolha pagar com PIX</li>
            <li>Escaneie o QR Code ou cole o código</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>

        <Button className="w-full" size="lg" onClick={onConfirm}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Já realizei o pagamento
        </Button>
      </div>
    )
  }

  if (status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
        <p className="text-lg font-medium">Confirmando pagamento...</p>
        <p className="text-sm text-muted-foreground">Aguarde enquanto verificamos</p>
      </div>
    )
  }

  if (status === "expired") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Código expirado</p>
        <p className="text-sm text-muted-foreground">O tempo para pagamento expirou.</p>
        <Button onClick={onGenerate}>Gerar novo código PIX</Button>
      </div>
    )
  }

  return null
}

function CardPaymentSection({ cardForm, cardErrors, isProcessing, total, onChange, onSubmit, onChangeMethod }: {
  cardForm: CardForm; cardErrors: Partial<Record<keyof CardForm, string>>;
  isProcessing: boolean; total: number; onChange: (field: keyof CardForm, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent) => void; onChangeMethod: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Cartão de Crédito</h3>
        <Button variant="ghost" size="sm" onClick={onChangeMethod}>Alterar</Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cardName">Nome no Cartão</Label>
          <Input id="cardName" placeholder="Nome completo" value={cardForm.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={cardErrors.name ? "border-red-500" : ""} />
          {cardErrors.name && <p className="mt-1 text-sm text-red-500">{cardErrors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Validade</Label>
            <Input id="expiry" placeholder="MM/AA" value={cardForm.expiry}
              onChange={(e) => onChange("expiry", e.target.value)}
              className={cardErrors.expiry ? "border-red-500" : ""} />
            {cardErrors.expiry && <p className="mt-1 text-sm text-red-500">{cardErrors.expiry}</p>}
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" type="password" value={cardForm.cvv}
              onChange={(e) => onChange("cvv", e.target.value)}
              className={cardErrors.cvv ? "border-red-500" : ""} />
            {cardErrors.cvv && <p className="mt-1 text-sm text-red-500">{cardErrors.cvv}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="installments">Parcelas</Label>
          <select id="installments" value={cardForm.installments}
            onChange={(e) => onChange("installments", parseInt(e.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <option key={num} value={num}>
                {num}x de R$ {formatCurrency(total / num)} {num <= 2 ? "sem juros" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="saveCard" checked={cardForm.saveCard}
            onCheckedChange={(checked) => onChange("saveCard", checked as boolean)} />
          <Label htmlFor="saveCard" className="text-sm">Salvar cartão para próximas compras</Label>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-lg bg-zinc-50 p-3 text-sm text-muted-foreground dark:bg-zinc-900">
          <Lock className="h-4 w-4" />
          <span>Seus dados estão protegidos com criptografia SSL</span>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
          {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</> : <>Pagar R$ {formatCurrency(total)}</>}
        </Button>
      </form>
    </div>
  )
}
