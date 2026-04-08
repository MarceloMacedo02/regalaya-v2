import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Heart, Star, Sparkles } from "lucide-react"

const occasions = [
  {
    id: "love",
    title: "Dia dos Namorados",
    description: "Surpreenda quem você ama",
    icon: Heart,
    color: "bg-pink-500",
    link: "/products?occasion=love",
  },
  {
    id: "birthday",
    title: "Aniversário",
    description: "Celebre momentos especiais",
    icon: Gift,
    color: "bg-blue-500",
    link: "/products?occasion=birthday",
  },
  {
    id: "wedding",
    title: "Casamento",
    description: "Presentes inesquecíveis",
    icon: Star,
    color: "bg-amber-500",
    link: "/products?occasion=wedding",
  },
  {
    id: "corporate",
    title: "Presentes Corporativos",
    description: "Para empresas e colaboradores",
    icon: Sparkles,
    color: "bg-purple-500",
    link: "/products?occasion=corporate",
  },
]

export function OccasionSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Presentes por Ocasião</h2>
          <p className="mt-2 text-muted-foreground">
            Encontre o presente perfeito para cada momento especial
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <Link key={occasion.id} href={occasion.link}>
              <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex rounded-full p-3 ${occasion.color} text-white`}>
                    <occasion.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{occasion.title}</h3>
                  <p className="text-sm text-muted-foreground">{occasion.description}</p>
                  <Button variant="link" className="mt-4 p-0 text-amber-600">
                    Ver presentes →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}