import type { Metadata } from "next"
import { SITE_URL } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Privacidade | Regalaya",
  description: "Saiba como protegemos seus dados pessoais e sua privacidade na Regalaya.",
  openGraph: {
    title: "Política de Privacidade | Regalaya",
    description: "Como protegemos seus dados pessoais.",
    type: "website",
    locale: "pt_BR",
    siteName: "Regalaya",
    url: `${SITE_URL}/privacy`,
  },
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
}

const principles = [
  {
    icon: Lock,
    title: "Segurança",
    description: "Seus dados são protegidos com criptografia de ponta a ponta",
  },
  {
    icon: Eye,
    title: "Transparência",
    description: "Informamos claramente como usamos suas informações",
  },
  {
    icon: UserCheck,
    title: "Controle",
    description: "Você tem controle sobre seus dados pessoais",
  },
  {
    icon: Database,
    title: "Minimização",
    description: "Coletamos apenas dados necessários para nossos serviços",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              Privacidade
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>

          {/* Intro Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Sua privacidade é nossa prioridade
                  </h3>
                  <p className="text-muted-foreground">
                    Esta política descreve como coletamos, usamos, armazenamos e 
                    protegemos suas informações pessoais, em conformidade com a 
                    Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Principles */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nossos Princípios</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {principles.map((principle) => (
                <Card key={principle.title} className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <principle.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{principle.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Dados que Coletamos</h2>
              <p className="mb-4">
                Coletamos diferentes tipos de informações para fornecer e melhorar 
                nossos serviços:
              </p>
              <h3 className="text-lg font-medium mb-2">Dados fornecidos por você:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Nome completo e CPF</li>
                <li>Endereço de e-mail e telefone</li>
                <li>Endereço de entrega e cobrança</li>
                <li>Informações de pagamento</li>
                <li>Preferências de produtos e presentes</li>
              </ul>
              <h3 className="text-lg font-medium mb-2">Dados coletados automaticamente:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Endereço IP e tipo de dispositivo</li>
                <li>Navegador e sistema operacional</li>
                <li>Páginas visitadas e tempo de navegação</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Como Usamos Seus Dados</h2>
              <p className="mb-4">
                Utilizamos suas informações para as seguintes finalidades:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processar e entregar seus pedidos</li>
                <li>Comunicar atualizações sobre pedidos</li>
                <li>Oferecer atendimento ao cliente</li>
                <li>Personalizar recomendações de produtos</li>
                <li>Enviar comunicações de marketing (com seu consentimento)</li>
                <li>Prevenir fraudes e garantir segurança</li>
                <li>Cumprir obrigações legais e fiscais</li>
                <li>Melhorar continuamente nossos serviços</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Dados</h2>
              <p className="mb-4">
                Não vendemos seus dados pessoais. Podemos compartilhar informações apenas com:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Parceiros de entrega</strong>: Para processar entregas de pedidos
                </li>
                <li>
                  <strong>Processadores de pagamento</strong>: Para processar transações
                </li>
                <li>
                  <strong>Prestadores de serviço</strong>: Hospedagem, e-mail marketing, analytics
                </li>
                <li>
                  <strong>Autoridades</strong>: Quando exigido por lei ou ordem judicial
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Armazenamento e Segurança</h2>
              <p className="mb-4">
                Adotamos medidas de segurança para proteger seus dados:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Armazenamento em servidores seguros</li>
                <li>Acesso restrito a dados pessoais</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e protegidos</li>
              </ul>
              <p className="mt-4">
                Mantemos seus dados apenas pelo tempo necessário para cumprir as 
                finalidades descritas ou conforme exigido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos (LGPD)</h2>
              <p className="mb-4">
                Como titular de dados, você tem direito a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
                <li>Portabilidade dos dados a outro fornecedor de serviço</li>
                <li>Eliminação dos dados tratados com consentimento</li>
                <li>Revogar o consentimento a qualquer momento</li>
                <li>Solicitar revisão de decisões automatizadas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
              <p className="mb-4">
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essenciais</strong>: Necessários para funcionamento do site
                </li>
                <li>
                  <strong>De desempenho</strong>: Para analisar uso e melhorar serviços
                </li>
                <li>
                  <strong>De funcionalidade</strong>: Para memorizar preferências
                </li>
                <li>
                  <strong>De marketing</strong>: Para exibir anúncios relevantes
                </li>
              </ul>
              <p className="mt-4">
                Você pode gerenciar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Menores de Idade</h2>
              <p>
                Nossos serviços são destinados a maiores de 18 anos. Não coletamos 
                intencionalmente dados de menores sem consentimento dos pais ou 
                responsáveis legais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. 
                Notificaremos sobre mudanças significativas através de e-mail ou 
                aviso em nosso site. O uso continuado dos serviços após alterações 
                constitui aceitação da nova política.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Encarregado de Dados (DPO)</h2>
              <p className="mb-4">
                Para exercer seus direitos ou tirar dúvidas sobre privacidade, 
                entre em contato com nosso Encarregado de Proteção de Dados:
              </p>
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="font-medium">DPO - Regalaya</p>
                  <p className="text-muted-foreground">
                    E-mail: <strong>dpo@regalaya.com.br</strong>
                  </p>
                  <p className="text-muted-foreground">
                    Endereço: Rua dos Presentes, 123 - São Paulo, SP
                  </p>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Autoridade Nacional</h2>
              <p>
                Você também pode entrar em contato com a Autoridade Nacional de 
                Proteção de Dados (ANPD) através do site 
                <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
                  gov.br/anpd
                </a>.
              </p>
            </section>

            {/* Alert */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mt-8">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Importante:</strong> Esta política está em conformidade com a 
                Lei Geral de Proteção de Dados (LGPD). Em caso de violação de dados, 
                notificaremos você e a ANPD conforme exigido por lei.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
