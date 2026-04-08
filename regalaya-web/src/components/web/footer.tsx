import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"
import {
  Mail,
  Phone,
  MapPin,
  Share2,
} from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {APP_NAME}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {APP_DESCRIPTION}
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                <Share2 className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/products" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Atendimento
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/faq" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Newsletter
            </h4>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Receba novidades e ofertas exclusivas!
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1"
              />
              <Button>Inscrever</Button>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail className="h-4 w-4" />
                <span>contato@regalaya.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            CNPJ: 00.000.000/0001-00 | Razão Social: Regalaya Ltda.
          </p>
        </div>
      </div>
    </footer>
  )
}
