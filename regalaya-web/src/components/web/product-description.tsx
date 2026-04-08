"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronUp,
  Package,
  Shield,
  Gift,
  Truck,
  Star,
} from "lucide-react"

interface ProductDescriptionProps {
  name: string
  description: string
  shortDescription?: string
  category: string
  tags?: string[]
  features?: string[]
}

export function ProductDescription({
  name,
  description,
  shortDescription,
  category,
  tags = [],
  features = [],
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongDescription = description.length > 300

  // Generate features based on category if not provided
  const displayFeatures =
    features.length > 0
      ? features
      : getCategoryFeatures(category, name)

  return (
    <div className="space-y-6">
      {/* Short Description / Highlight */}
      {shortDescription && (
        <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 border border-amber-200 dark:border-amber-800">
          <p className="text-amber-900 dark:text-amber-100 font-medium">
            {shortDescription}
          </p>
        </div>
      )}

      {/* Main Description */}
      <div>
        <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          <Package className="h-5 w-5 text-amber-600" />
          Sobre este produto
        </h2>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p
            className={cn(
              "text-muted-foreground leading-relaxed",
              isLongDescription && !isExpanded && "line-clamp-4"
            )}
          >
            {description}
          </p>

          {isLongDescription && (
            <Button
              variant="link"
              className="p-0 h-auto text-amber-600 hover:text-amber-700"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Mostrar menos <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Ler mais <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Features / Highlights */}
      {displayFeatures.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            <Star className="h-4 w-4 text-amber-500" />
            Destaques
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {displayFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t">
        <div className="flex flex-col items-center text-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
          <Shield className="h-6 w-6 text-green-600 mb-2" />
          <span className="text-xs font-medium">Garantia</span>
          <span className="text-xs text-muted-foreground">Qualidade</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
          <Gift className="h-6 w-6 text-amber-600 mb-2" />
          <span className="text-xs font-medium">Embalagem</span>
          <span className="text-xs text-muted-foreground">Especial</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
          <Truck className="h-6 w-6 text-blue-600 mb-2" />
          <span className="text-xs font-medium">Entrega</span>
          <span className="text-xs text-muted-foreground">Segura</span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">
            Categorias relacionadas:
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to generate features based on category
function getCategoryFeatures(category: string, productName: string): string[] {
  const categoryFeatures: Record<string, string[]> = {
    Chocolates: [
      "Chocolate belga premium",
      "Feito à mão",
      "Diversos sabores",
      "Embalagem elegante",
      "Ideal para presentes",
    ],
    Flores: [
      "Flores frescas",
      "Arranjo artesanal",
      "Folhagem inclusa",
      "Entrega cuidadosa",
      "Cuidados inclusos",
    ],
    Bebidas: [
      "Safra selecionada",
      "Notas especiais",
      "Ideal para celebrações",
      "Harmoniza com diversas comidas",
      "Temperatura ideal de serviço",
    ],
    "Bem-estar": [
      "Ingredientes naturais",
      "Aromaterapia relaxante",
      "Kit completo",
      "Uso diário",
      "Benefícios terapêuticos",
    ],
    Acessórios: [
      "Design exclusivo",
      "Material premium",
      "Durabilidade",
      "Estilo sofisticado",
      "Presente ideal",
    ],
    "Presentes Personalizados": [
      "Personalização única",
      "Feito sob encomenda",
      "Mensagem especial",
      "Embalagem premium",
      "Lembrança inesquecível",
    ],
  }

  return categoryFeatures[category] || [
    "Produto de qualidade",
    "Ideal para presente",
    "Embalagem especial",
    "Satisfação garantida",
  ]
}
