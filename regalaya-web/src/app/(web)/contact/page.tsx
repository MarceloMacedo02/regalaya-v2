"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react"

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "(11) 99999-9999",
    description: "Atendimento rápido e personalizado",
    color: "text-green-600",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: "contato@regalaya.com.br",
    description: "Respondemos em até 24 horas",
    color: "text-blue-600",
  },
  {
    icon: Phone,
    title: "Telefone",
    value: "(11) 3333-4444",
    description: "Seg-Sex, 9h às 18h",
    color: "text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Instagram",
    value: "@regalaya",
    description: "Acompanhe nossas novidades",
    color: "text-pink-600",
  },
]

const faqs = [
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo varia de 1 a 7 dias úteis, dependendo da sua localização e do produto escolhido.",
  },
  {
    question: "Aceitam quais formas de pagamento?",
    answer: "Aceitamos PIX, cartão de crédito (em até 12x), cartão de débito e boleto bancário.",
  },
  {
    question: "Como rastrear meu pedido?",
    answer: "Após a confirmação do pagamento, você recebe um código de rastreamento por e-mail.",
  },
]

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    })

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Fale Conosco
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground">
            Estamos aqui para ajudar você a encontrar o presente perfeito. 
            Escolha a forma de contato que preferir.
          </p>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method) => (
              <Card key={method.title} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 ${method.color}`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm font-medium mb-1">{method.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Envie uma Mensagem
              </CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleChange("subject", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Dúvidas Gerais</SelectItem>
                      <SelectItem value="order">Pedido</SelectItem>
                      <SelectItem value="product">Produto</SelectItem>
                      <SelectItem value="partnership">Parceria</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info & FAQ */}
          <div className="space-y-6">
            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Segunda a Sexta</span>
                  <span className="font-medium">9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sábado</span>
                  <span className="font-medium">9h às 13h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domingo e Feriados</span>
                  <span className="font-medium">Fechado</span>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rua dos Presentes, 123<br />
                  São Paulo - SP<br />
                  CEP: 01234-567
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
