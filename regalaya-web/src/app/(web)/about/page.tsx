import type { Metadata } from "next"
import { SITE_URL } from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Gift,
  Heart,
  Sparkles,
  Award,
  Users,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sobre Nós | Regalaya",
  description: "Conheça a história da Regalaya e nossa missão de ajudar você a encontrar o presente perfeito para cada ocasião especial.",
  openGraph: {
    title: "Sobre Nós | Regalaya",
    description: "Conheça a história da Regalaya e nossa missão.",
    type: "website",
    locale: "pt_BR",
    siteName: "Regalaya",
    url: `${SITE_URL}/about`,
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

const values = [
  {
    icon: Heart,
    title: "Paixão por Presentear",
    description: "Acreditamos que cada presente carrega uma emoção única e especial.",
  },
  {
    icon: Award,
    title: "Qualidade Premium",
    description: "Selecionamos cuidadosamente cada produto para garantir excelência.",
  },
  {
    icon: Users,
    title: "Atendimento Personalizado",
    description: "Cada cliente é único e merece uma experiência personalizada.",
  },
  {
    icon: Shield,
    title: "Confiança e Segurança",
    description: "Suas compras e dados estão protegidos conosco.",
  },
  {
    icon: Clock,
    title: "Pontualidade",
    description: "Entregamos no prazo certo para você não perder momentos especiais.",
  },
  {
    icon: CheckCircle,
    title: "Satisfação Garantida",
    description: "Não está satisfeito? Resolvemos para você.",
  },
]

const stats = [
  { number: "10.000+", label: "Clientes Felizes" },
  { number: "50.000+", label: "Presentes Entregues" },
  { number: "500+", label: "Produtos Únicos" },
  { number: "98%", label: "Satisfação" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Sobre a Regalaya
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transformando Momentos em Memórias Inesquecíveis
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Desde 2020, ajudamos pessoas a expressarem seus sentimentos através de presentes 
              cuidadosamente selecionados e experiências únicas.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Nossa História</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="mb-4">
                A Regalaya nasceu de um sonho simples, mas poderoso: ajudar pessoas a 
                encontrarem o presente perfeito para cada ocasião especial. Tudo começou 
                quando nossa fundadora teve dificuldade em encontrar um presente único 
                para o aniversário de sua mãe.
              </p>
              <p className="mb-4">
                Percebemos que muitas pessoas enfrentavam o mesmo desafio: a falta de tempo 
                e opções limitadas nas lojas tradicionais. Foi assim que decidimos criar 
                uma plataforma que unisse curadoria, personalização e tecnologia para 
                transformar a experiência de presentear.
              </p>
              <p>
                Hoje, somos uma equipe apaixonada por presentes, trabalhando diariamente 
                para oferecer não apenas produtos, mas experiências memoráveis que 
                fortalecem laços e criam momentos inesquecíveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
            <p className="text-muted-foreground">
              Os princípios que guiam tudo o que fazemos
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
            <blockquote className="text-xl text-muted-foreground italic mb-8">
              &ldquo;Conectar pessoas através de presentes significativos, tornando cada 
              ocasião especial verdadeiramente inesquecível.&rdquo;
            </blockquote>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/products">Ver Produtos</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Feito com ❤️</h2>
            <p className="text-muted-foreground mb-8">
              Somos uma equipe diversa e apaixonada, trabalhando remotamente de 
              diferentes partes do Brasil para levar alegria até você.
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {["🎁", "💝", "✨", "🌟", "💫", "🎉"].map((emoji) => (
                <span key={emoji} className="text-3xl">{emoji}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
