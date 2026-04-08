"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Check,
  Copy,
  Loader2,
  Zap,
  List,
  Heart,
  Flame,
  Clock,
  MapPin,
  Book,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AIDescriptionGeneratorProps {
  productName: string
  category: string
  price: number
  tags?: string[]
  currentDescription?: string
  onGenerate: (description: string) => void
}

export function AIDescriptionGenerator({
  productName,
  category,
  price,
  tags = [],
  currentDescription,
  onGenerate,
}: AIDescriptionGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDesc, setGeneratedDesc] = useState("")
  const [generatedShortDesc, setGeneratedShortDesc] = useState("")
  const [formData, setFormData] = useState({
    targetAudience: "",
    keyFeatures: "",
    usageOccasion: "",
    materials: "",
    dimensions: "",
    brandStory: "",
    tone: "elegante",
    includePrice: true,
    length: "media",
  })

  const handleGenerate = async () => {
    if (!productName) {
      toast({
        title: "Nome obrigatório",
        description: "Preencha o nome do produto antes de gerar a descrição.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Enhanced description generation based on form inputs
    const description = generateEnhancedDescription(
      productName,
      category,
      price,
      formData,
      tags
    )
    
    const shortDesc = generateShortDescription(
      productName,
      category,
      price,
      formData,
      tags
    )

    setGeneratedDesc(description)
    setGeneratedShortDesc(shortDesc)
    setIsGenerating(false)
  }

  const generateEnhancedDescription = (
    name: string,
    cat: string,
    price: number,
    data: any,
    productTags: string[]
  ): string => {
    const priceFormatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
    
    // Base description components
    const audience = data.targetAudience ? `Para ${data.targetAudience.toLowerCase()}, ` : ""
    const features = data.keyFeatures 
      ? `Com ${data.keyFeatures.toLowerCase()}, ` 
      : ""
    const occasion = data.usageOccasion 
      ? `ideal para ${data.usageOccasion.toLowerCase()}. ` 
      : ""
    const materials = data.materials 
      ? `Feito com ${data.materials.toLowerCase()}. ` 
      : ""
    const dimensionsInfo = data.dimensions 
      ? `Dimensões: ${data.dimensions}. ` 
      : ""
    const brand = data.brandStory 
      ? `${data.brandStory} ` 
      : ""
    
    // Category-specific enhancements
    const categoryDetails = getCategoryDetails(cat, name)
    
    // Tone adjustments
    const tonePrefix = getTonePrefix(data.tone)
    
    // Price mention
    const priceMention = data.includePrice 
      ? `Disponível por apenas ${priceFormatted}. ` 
      : ""
    
    // Build description
    let description = `${tonePrefix}${brand}${audience}${name} é ${categoryDetails}. `
    
    if (materials) description += materials
    if (dimensionsInfo) description += dimensionsInfo
    if (features) description += features
    if (occasion) description += occasion
    
    description += priceMention
    
    // Add closing based on length preference
    if (data.length === "longa") {
      description += "Adquira agora e transforme momentos comuns em experiências memoráveis. Surpreenda quem você ama ou presenteie-se com este produto único que combina qualidade, design e funcionalidade em perfeita harmonia."
    } else if (data.length === "curta") {
      description += "Qualidade garantida para sua satisfação."
    } else {
      description += "A escolha perfeita para quem valoriza excelência e estilo."
    }
    
    return description.trim()
  }

  const generateShortDescription = (
    name: string,
    cat: string,
    price: number,
    data: any,
    productTags: string[]
  ): string => {
    const priceFormatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)

    // Get category-specific short templates
    const shortTemplates = getShortDescriptionTemplates(cat)

    // Select random template
    const template = shortTemplates[Math.floor(Math.random() * shortTemplates.length)]

    // Replace placeholders
    let desc = template
      .replace(/{name}/g, name)
      .replace(/{price}/g, data.includePrice ? priceFormatted : "")
      .replace(/{features}/g, data.keyFeatures || "qualidade premium")
      .replace(/{audience}/g, data.targetAudience || "todos")

    // Clean up any empty replacements
    desc = desc.replace(/\s+/g, " ").trim()

    return desc
  }

  const getCategoryDetails = (category: string, productName: string): string => {
    const details: Record<string, string> = {
      Chocolates: "uma seleção refinada de chocolates belgas artesanais",
      Flores: "um arranjo exclusivo de flores frescas e selecionadas",
      Bebidas: "uma bebida premium cuidadosamente selecionada",
      "Bem-estar": "um kit completo para relaxamento e autocuidado",
      Acessórios: "um acessório sofisticado de design exclusivo",
      "Presentes Personalizados": "um presente único feito sob encomenda com carinho",
    }
    
    return details[category] || "um produto de qualidade excepcional"
  }

  const getTonePrefix = (tone: string): string => {
    const tones: Record<string, string> = {
      elegante: "Descubra a elegância de ",
      amigavel: "Apresentamos com carinho ",
      profissional: "Especificações técnicas do ",
      emocional: "Deixe-se envolver pela emoção de ",
      vendas: "Não perca esta oportunidade de adquirir ",
      luxo: "Mergulhe no mundo do luxo com ",
      sustentavel: "Escolha consciente: ",
      artesanal: "Feito com maestria artesanal: ",
    }
    
    return tones[tone] || tones["elegante"]
  }

  const getShortDescriptionTemplates = (category: string): string[] => {
    const templates: Record<string, string[]> = {
      Chocolates: [
        "Chocolate belga artesanal - {name}",
        "{name}: Luxo em cada pedaço",
        "Premium chocolate - {features}",
        "Para {audience} que apreciam o melhor",
      ],
      Flores: [
        "Arranjo floral exclusivo - {name}",
        "{name}: Flores frescas para momentos especiais",
        "Buquê artesanal - {features}",
        "Perfeito para {audience}",
      ],
      Bebidas: [
        "{name}: Sofisticação em cada gole",
        "Bebida premium - {features}",
        "Seleção especial - {name}",
        "Ideal para {audience}",
      ],
      "Bem-estar": [
        "{name}: Seu momento de relaxamento",
        "Kit bem-estar - {features}",
        "Autocuidado premium - {name}",
        "Perfeito para {audience}",
      ],
      Acessórios: [
        "{name}: Elegância que dura",
        "Acessório premium - {features}",
        "Estilo exclusivo - {name}",
        "Para {audience} exigentes",
      ],
      "Presentes Personalizados": [
        "{name}: Seu presente único",
        "Personalizado com carinho - {features}",
        "Lembrança especial - {name}",
        "Feito sob medida para {audience}",
      ],
    }
    
    return templates[category] || templates["Chocolates"]
  }

  const handleApply = () => {
    onGenerate(generatedDesc)
    toast({
      title: "Descrição aplicada!",
      description: "A descrição gerada foi adicionada ao campo.",
    })
    setIsOpen(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDesc)
    toast({
      title: "Copiado!",
      description: "Descrição copiada para a área de transferência.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Gerar com IA Avançada
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-amber-500" />
            Gerador de Descrição com IA - Informações Detalhadas
          </DialogTitle>
          <DialogDescription>
            Forneça informações específicas sobre o produto para gerar uma
            descrição mais precisa e persuasiva.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Product Preview */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Produto:</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {productName || "Não informado"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Categoria:</p>
                <Badge variant="secondary" className="text-sm">
                  {category || "Não informada"}
                </Badge>
              </div>
              {price > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Preço:</p>
                  <p className="font-medium text-amber-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(price)}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Information Sections */}
          <div className="space-y-4">
            <h3 className="text-base font-medium mb-2 text-muted-foreground">
              Informações do Produto
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Target Audience */}
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Público-Alvo</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAudience: e.target.value })
                  }
                  placeholder="Ex: Noivos, Formados, Aniversariantes"
                />
                <p className="text-xs text-muted-foreground">
                  Para quem é este produto?
                </p>
              </div>
              
              {/* Key Features */}
              <div className="space-y-2">
                <Label htmlFor="keyFeatures">Principais Características</Label>
                <Input
                  id="keyFeatures"
                  value={formData.keyFeatures}
                  onChange={(e) =>
                    setFormData({ ...formData, keyFeatures: e.target.value })
                  }
                  placeholder="Ex: Feito à mão, Ingredientes naturais, Embalagem sustentável"
                />
                <p className="text-xs text-muted-foreground">
                  O que torna este produto especial?
                </p>
              </div>
              
              {/* Usage Occasion */}
              <div className="space-y-2">
                <Label htmlFor="usageOccasion">Ocasião de Uso</Label>
                <Input
                  id="usageOccasion"
                  value={formData.usageOccasion}
                  onChange={(e) =>
                    setFormData({ ...formData, usageOccasion: e.target.value })
                  }
                  placeholder="Ex: Casamentos, Formaturas, Dia dos Namorados"
                />
                <p className="text-xs text-muted-foreground">
                  Em quais momentos este produto é usado?
                </p>
              </div>
              
              {/* Materials / Ingredients */}
              <div className="space-y-2">
                <Label htmlFor="materials">Materiais / Ingredientes</Label>
                <Input
                  id="materials"
                  value={formData.materials}
                  onChange={(e) =>
                    setFormData({ ...formData, materials: e.target.value })
                  }
                  placeholder="Ex: Chocolate belga 70% cacau, Flores orgânicas, Aço inoxidável"
                />
                <p className="text-xs text-muted-foreground">
                  De qué é feito este produto?
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-base font-medium mb-2 text-muted-foreground">
              Detalhes Adicionais
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Dimensions */}
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensões / Tamanho</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensions: e.target.value })
                  }
                  placeholder="Ex: 20x20x5cm, 500ml, Único"
                />
              </div>
              
              {/* Brand Story */}
              <div className="space-y-2">
                <Label htmlFor="brandStory">História da Marca</Label>
                <Input
                  id="brandStory"
                  value={formData.brandStory}
                  onChange={(e) =>
                    setFormData({ ...formData, brandStory: e.target.value })
                  }
                  placeholder="Ex: Há 10 anos produzimos chocolates artesanais..."
                />
              </div>
            </div>
          </div>

          {/* Generation Options */}
          <div className="space-y-4">
            <h3 className="text-base font-medium mb-2 text-muted-foreground">
              Opções de Geração
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Tone */}
              <div className="space-y-2">
                <Label htmlFor="tone">Tom da Descrição</Label>
                <Select value={formData.tone} onValueChange={(value) =>
                  setFormData({ ...formData, tone: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elegante">Elegante e Sofisticado</SelectItem>
                    <SelectItem value="amigavel">Amigável e Acolhedor</SelectItem>
                    <SelectItem value="profissional">Profissional e Técnico</SelectItem>
                    <SelectItem value="emocional">Emocional e Afetivo</SelectItem>
                    <SelectItem value="vendas">Focado em Conversão</SelectItem>
                    <SelectItem value="luxo">Luxo e Exclusividade</SelectItem>
                    <SelectItem value="sustentavel">Sustentável e Consciente</SelectItem>
                    <SelectItem value="artesanal">Artesanal e Tradicional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Length */}
              <div className="space-y-2">
                <Label htmlFor="length">Comprimento da Descrição</Label>
                <Select value={formData.length} onValueChange={(value) =>
                  setFormData({ ...formData, length: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curta">Curta (1-2 frases)</SelectItem>
                    <SelectItem value="media">Média (3-5 frases)</SelectItem>
                    <SelectItem value="longa">Longa (descrição completa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Include Price */}
              <div className="col-span-2 flex items-center space-x-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="includePrice"
                    checked={formData.includePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, includePrice: e.target.checked })
                    }
                    className="rounded border-input"
                  />
                  <span className="text-sm">Incluir preço na descrição gerada</span>
                </label>
              </div>
            </div>
          </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !productName}
            className="w-56 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando descrição detalhada...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar Descrição Completa
              </>
            )}
          </Button>
        </div>

        {/* Generated Output */}
        {generatedDesc && (
          <div className="mt-8 space-y-4 pt-6 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Descrição Gerada
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerar
                  </Button>
                </div>
              </div>
              <Textarea
                value={generatedDesc}
                onChange={(e) => setGeneratedDesc(e.target.value)}
                className="min-h-[96px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição Curta (sugestão)</Label>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  {generatedShortDesc}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>

        <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleApply}
          disabled={!generatedDesc}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          Aplicar Descrição
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
