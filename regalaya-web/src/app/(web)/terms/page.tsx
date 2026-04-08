import type { Metadata } from "next"
import { SITE_URL } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Termos de Uso | Regalaya",
  description: "Leia nossos termos de uso para entender as regras e condições de utilização da plataforma Regalaya.",
  openGraph: {
    title: "Termos de Uso | Regalaya",
    description: "Regras e condições de utilização da plataforma.",
    type: "website",
    locale: "pt_BR",
    siteName: "Regalaya",
    url: `${SITE_URL}/terms`,
  },
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              Termos de Uso
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Termos e Condições de Uso</h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o site da Regalaya, você concorda em cumprir e estar 
                vinculado a estes Termos de Uso. Se você não concordar com qualquer parte 
                destes termos, não deve utilizar nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Definições</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>&quot;Plataforma&quot;</strong>: Refere-se ao site e aplicação da Regalaya
                </li>
                <li>
                  <strong>&quot;Usuário&quot;</strong>: Qualquer pessoa que acesse ou utilize a Plataforma
                </li>
                <li>
                  <strong>&quot;Produtos&quot;</strong>: Itens disponíveis para compra na Plataforma
                </li>
                <li>
                  <strong>&quot;Pedido&quot;</strong>: Compra realizada através da Plataforma
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta</h2>
              <p className="mb-4">
                Para realizar compras, você deverá criar uma conta fornecendo informações 
                verdadeiras, precisas e completas. Você é responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Todas as atividades realizadas em sua conta</li>
                <li>Notificar imediatamente qualquer uso não autorizado</li>
                <li>Atualizar seus dados sempre que necessário</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Produtos e Preços</h2>
              <p className="mb-4">
                Nos esforçamos para fornecer informações precisas sobre produtos e preços. 
                No entanto:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  As imagens são meramente ilustrativas e podem variar em relação ao produto real
                </li>
                <li>
                  Os preços estão sujeitos a alteração sem aviso prévio
                </li>
                <li>
                  Em caso de erro de preço, entraremos em contato antes do processamento
                </li>
                <li>
                  A disponibilidade dos produtos está sujeita ao estoque
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Pedidos e Pagamentos</h2>
              <p className="mb-4">
                Ao finalizar um pedido, você concorda com:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>O fornecimento de informações de pagamento válidas</li>
                <li>O pagamento do valor total indicado no checkout</li>
                <li>A entrega no endereço fornecido</li>
                <li>As políticas de frete e prazo de entrega</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Política de Entrega</h2>
              <p className="mb-4">
                As entregas são realizadas conforme os prazos indicados no checkout. Fatores 
                que podem afetar o prazo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Localização do destinatário</li>
                <li>Disponibilidade do produto em estoque</li>
                <li>Condições climáticas ou logísticas</li>
                <li>Feriados e finais de semana</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Trocas e Devoluções</h2>
              <p className="mb-4">
                Aceitamos trocas e devoluções conforme o Código de Defesa do Consumidor:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Arrependimento</strong>: Até 7 dias após o recebimento
                </li>
                <li>
                  <strong>Defeito do produto</strong>: Até 30 dias para produtos não duráveis
                </li>
                <li>
                  <strong>Produto errado</strong>: Entrar em contato imediatamente
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da Plataforma (textos, imagens, logotipos, códigos) é de 
                propriedade da Regalaya e protegido por leis de propriedade intelectual. 
                É proibida a reprodução sem autorização prévia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitação de Responsabilidade</h2>
              <p>
                A Regalaya não se responsabiliza por danos indiretos, incidentais ou 
                consequenciais decorrentes do uso da Plataforma. Nossa responsabilidade 
                total está limitada ao valor do pedido.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer 
                momento. As alterações entram em vigor imediatamente após publicação. 
                Recomendamos revisão periódica.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Lei Aplicável</h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. 
                Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer 
                dúvidas decorrentes destes termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
              <p>
                Em caso de dúvidas sobre estes Termos de Uso, entre em contato através do 
                e-mail <strong>juridico@regalaya.com.br</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
