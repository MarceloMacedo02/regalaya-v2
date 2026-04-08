"use client"

import { useState } from "react"
import Link from "next/link"
import { products } from "@/lib/mock-data"
import { ProductCard } from "@/components/web/product-card"
import { AIMessageGenerator } from "@/components/web/ai-message-generator"
import { RecommendationFeedback } from "@/components/web/recommendation-feedback"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  Gift, 
  Heart, 
  Cake, 
  Users, 
  Briefcase, 
  Baby, 
  GraduationCap,
  Loader2,
  CheckCircle2,
  Info,
  MessageSquare,
  Star,
  ShoppingCart
} from "lucide-react"

// Occasion options
const OCCASIONS = [
  { id: "birthday", label: "Aniversário", icon: Cake },
  { id: "love", label: "Dia dos Namorados", icon: Heart },
  { id: "wedding", label: "Casamento", icon: Users },
  { id: "corporate", label: "Corporativo", icon: Briefcase },
  { id: "baby", label: "Chá de Bebê", icon: Baby },
  { id: "graduation", label: "Formatura", icon: GraduationCap },
  { id: "generic", label: "Presente em Geral", icon: Gift },
]

// Age ranges
const AGE_RANGES = [
  "0-12 anos (Criança)",
  "13-17 anos (Adolescente)",
  "18-25 anos (Jovem Adulto)",
  "26-40 anos (Adulto)",
  "41-60 anos (Meia-idade)",
  "60+ anos (Sênior)",
]

// Interest options
const INTERESTS = [
  "Tecnologia", "Moda", "Beleza", "Esportes", "Culinária", 
  "Artesanato", "Música", "Leitura", "Viagens", "Games",
  "Decoração", "Jardinagem", "Fotografia", "Cinema", "Arte"
]

interface Recommendation {
  product: typeof products[0]
  reason: string
  matchScore: number
}

export default function RecommendationsPage() {
  const [step, setStep] = useState<"form" | "loading" | "results">("form")
  const [selectedOccasion, setSelectedOccasion] = useState<string>("")
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [budget, setBudget] = useState<string>("")
  const [recipientName, setRecipientName] = useState<string>("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep("loading")

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock recommendations based on form data
    const mockRecommendations: Recommendation[] = products
      .slice(0, 5)
      .map((product, index) => ({
        product,
        reason: getRecommendationReason(selectedOccasion, selectedAgeRange, product),
        matchScore: 95 - index * 10,
      }))

    setRecommendations(mockRecommendations)
    setStep("results")
  }

  const getRecommendationReason = (occasion: string, ageRange: string, product: typeof products[0]) => {
    const reasons = [
      `Perfeito para ${occasion === "birthday" ? "aniversários" : occasion === "love" ? "momentos românticos" : "presentear"}!`,
      `Ideal para a faixa etária ${ageRange}`,
      `Combina com os interesses selecionados`,
      `Alta avaliação entre os clientes`,
      `Excelente custo-benefício`,
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  if (step === "loading") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Analisando suas preferências...
          </h2>
          <p className="max-w-md text-muted-foreground">
            Nossa IA está selecionando os presentes perfeitos para você com base nas informações fornecidas.
          </p>
        </div>
      </div>
    )
  }

  if (step === "results") {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Recomendações Personalizadas
              </h1>
              <p className="text-muted-foreground">
                Baseado no seu perfil: {recipientName || "para alguém especial"}
              </p>
            </div>
          </div>

          {/* Summary badges */}
          <div className="flex flex-wrap gap-2">
            {selectedOccasion && (
              <Badge variant="secondary">
                {OCCASIONS.find(o => o.id === selectedOccasion)?.label}
              </Badge>
            )}
            {selectedAgeRange && <Badge variant="secondary">{selectedAgeRange}</Badge>}
            {selectedInterests.slice(0, 3).map(interest => (
              <Badge key={interest} variant="outline">{interest}</Badge>
            ))}
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mensagem
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliar
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Recommendations */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec) => (
                <Card key={rec.product.id} className="overflow-hidden">
                  <div className="relative">
                    <ProductCard product={rec.product} showFavoriteButton={false} />
                    {/* Match Score */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white">
                      <Sparkles className="h-3 w-3" />
                      {rec.matchScore}% match
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Adicionar ao Carrinho
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setStep("form")}>
                Refazer Pesquisa
              </Button>
              <Link href="/products">
                <Button>
                  Ver Todos os Produtos
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Message Generation Tab */}
          <TabsContent value="message">
            <AIMessageGenerator 
              recipientName={recipientName}
              occasion={OCCASIONS.find(o => o.id === selectedOccasion)?.label}
              onMessageGenerated={(msg) => console.log("Message generated:", msg)}
              onCopy={(msg) => console.log("Message copied:", msg)}
            />
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <RecommendationFeedback
              recommendations={recommendations.map(rec => ({
                productId: rec.product.id,
                product: {
                  id: rec.product.id,
                  name: rec.product.name,
                  price: rec.product.price,
                  images: rec.product.images,
                  slug: rec.product.slug
                },
                reason: rec.reason,
                matchScore: rec.matchScore
              }))}
              onFeedbackSubmit={(feedback) => console.log("Feedback submitted:", feedback)}
            />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Form Step
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Sparkles className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Encontre o Presente Perfeito
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
          Nossa IA analisa suas preferências e sugere os melhores presentes para cada ocasião.
          É rápido, personalizado e gratuito!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
        {/* Recipient Name */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">1</span>
              Quem é o destinatário?
            </CardTitle>
            <CardDescription>
              Nomeie a pessoa que você quer presentear (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Ex: Minha mãe, Meu namorado, Colega de trabalho..."
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Occasion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">2</span>
              Qual é a ocasião?
            </CardTitle>
            <CardDescription>
              Selecione o tipo de evento ou celebração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {OCCASIONS.map((occasion) => (
                <button
                  key={occasion.id}
                  type="button"
                  onClick={() => setSelectedOccasion(occasion.id)}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    selectedOccasion === occasion.id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                  }`}
                >
                  <occasion.icon className={`h-6 w-6 ${
                    selectedOccasion === occasion.id ? "text-amber-600" : "text-zinc-500"
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedOccasion === occasion.id ? "text-amber-700 dark:text-amber-300" : "text-zinc-600 dark:text-zinc-400"
                  }`}>
                    {occasion.label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">3</span>
              Faixa etária
            </CardTitle>
            <CardDescription>
              Qual é a idade aproximada do destinatário?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {AGE_RANGES.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAgeRange(age)}
                  className={`rounded-lg border-2 p-3 text-sm transition-all ${
                    selectedAgeRange === age
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">4</span>
              Interesses
            </CardTitle>
            <CardDescription>
              Selecione os interesses do destinatário (quanto mais, melhor!)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <Button
                  key={interest}
                  type="button"
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">5</span>
              Orçamento (opcional)
            </CardTitle>
            <CardDescription>
              Defina um limite de preço para os presentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">R$</span>
              <Input
                type="number"
                placeholder="Ex: 200"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="max-w-xs"
              />
              <span className="text-muted-foreground text-sm">
                (Deixe vazio para ver todas as opções)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col items-center gap-4">
          <Button type="submit" size="lg" className="w-full max-w-md">
            <Sparkles className="mr-2 h-5 w-5" />
            Gerar Recomendações
          </Button>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Nossa IA nunca compartilhará suas informações com terceiros</span>
          </div>
        </div>
      </form>
    </div>
  )
}
