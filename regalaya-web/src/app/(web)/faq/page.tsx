"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, HelpCircle, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const faqCategories = [
  {
    category: "Pedidos",
    icon: "🛒",
    questions: [
      {
        question: "Como faço para fazer um pedido?",
        answer: "É simples! Navegue por nossos produtos, clique em 'Adicionar ao Carrinho', revise seu pedido no carrinho e prossiga para o checkout. Lá você informará seu endereço e escolherá a forma de pagamento.",
      },
      {
        question: "Posso alterar ou cancelar meu pedido após a confirmação?",
        answer: "Você pode solicitar alterações ou cancelamento em até 1 hora após a confirmação do pagamento. Após esse período, o pedido já estará em processo de separação e não poderá ser alterado. Entre em contato conosco pelo WhatsApp ou e-mail.",
      },
      {
        question: "Como recebo a confirmação do meu pedido?",
        answer: "Após a confirmação do pagamento, você receberá um e-mail com todos os detalhes do pedido, incluindo número do pedido, resumo dos itens e prazo de entrega. Também enviamos atualizações sobre o status da entrega.",
      },
      {
        question: "Posso fazer um pedido por telefone ou WhatsApp?",
        answer: "Sim! Nossa equipe de atendimento pode ajudar você a fazer pedidos através do WhatsApp (11) 99999-9999 ou telefone (11) 3333-4444, de segunda a sexta das 9h às 18h.",
      },
    ],
  },
  {
    category: "Entrega",
    icon: "📦",
    questions: [
      {
        question: "Qual o prazo de entrega?",
        answer: "O prazo varia conforme sua localização e o produto escolhido. Para São Paulo capital, o prazo é de 1-3 dias úteis. Para outras regiões, pode levar de 3-7 dias úteis. O prazo exato é informado no checkout antes da finalização da compra.",
      },
      {
        question: "Vocês entregam em todo o Brasil?",
        answer: "Sim! Entregamos em todo o território nacional. Trabalhamos com transportadoras parceiras para garantir que seu presente chegue com segurança em qualquer lugar do Brasil.",
      },
      {
        question: "Como rastrear meu pedido?",
        answer: "Após o envio, você receberá um código de rastreamento por e-mail. Você pode acompanhar seu pedido na página 'Meus Pedidos' (para usuários cadastrados) ou na página de Rastreamento usando o código do pedido.",
      },
      {
        question: "O que acontece se eu não estiver em casa na entrega?",
        answer: "O entregador deixará um aviso de tentativa de entrega. Você poderá retirar o pacote na agência dos Correios ou transportadora mais próxima, ou agendar uma nova entrega. Para produtos que exigem assinatura, é necessário que alguém esteja presente.",
      },
      {
        question: "Vocês oferecem frete grátis?",
        answer: "Sim! Oferecemos frete grátis para pedidos acima de R$ 299,90. O cálculo é automático no checkout.",
      },
    ],
  },
  {
    category: "Pagamento",
    icon: "💳",
    questions: [
      {
        question: "Quais formas de pagamento vocês aceitam?",
        answer: "Aceitamos PIX (com 5% de desconto), cartão de crédito (em até 12x), cartão de débito e boleto bancário. Todas as transações são processadas de forma segura.",
      },
      {
        question: "O pagamento por PIX é confirmado na hora?",
        answer: "Sim! O PIX é confirmado instantaneamente e seu pedido já começa a ser processado imediatamente. Além disso, você ganha 5% de desconto pagando com PIX.",
      },
      {
        question: "Posso parcelar no cartão de crédito?",
        answer: "Sim! Aceitamos parcelamento em até 12x no cartão de crédito. Parcelas acima de 6x podem ter acréscimo de juros, que será informado no checkout.",
      },
      {
        question: "Meu cartão foi recusado. O que fazer?",
        answer: "Verifique se os dados do cartão estão corretos, se há limite disponível e se a senha está correta. Se o problema persistir, entre em contato com seu banco ou tente outra forma de pagamento.",
      },
      {
        question: "O boleto demora para compensar?",
        answer: "Sim, o boleto pode levar de 1 a 3 dias úteis para compensar. O prazo de entrega começa a contar após a confirmação do pagamento.",
      },
    ],
  },
  {
    category: "Trocas e Devoluções",
    icon: "🔄",
    questions: [
      {
        question: "Qual a política de trocas e devoluções?",
        answer: "Aceitamos trocas e devoluções conforme o Código de Defesa do Consumidor. Você tem até 7 dias corridos após o recebimento para desistência por arrependimento, e até 30 dias para produtos com defeito.",
      },
      {
        question: "Como solicitar uma troca ou devolução?",
        answer: "Entre em contato conosco pelo e-mail sac@regalaya.com.br ou WhatsApp informando o número do pedido e o motivo da solicitação. Enviaremos as instruções para devolução gratuita.",
      },
      {
        question: "Quem paga o frete da devolução?",
        answer: "Para devoluções por arrependimento ou defeito do produto, o frete é por nossa conta. Fornecemos um código de postagem para envio gratuito.",
      },
      {
        question: "Quanto tempo leva para receber o reembolso?",
        answer: "Após recebermos e analisarmos o produto devolvido, o reembolso é processado em até 5 dias úteis. Para cartão de crédito, o valor aparece na fatura seguinte.",
      },
    ],
  },
  {
    category: "Produtos",
    icon: "🎁",
    questions: [
      {
        question: "Os produtos têm garantia?",
        answer: "Sim! Todos os produtos têm garantia contra defeitos de fabricação. O prazo de garantia varia conforme o tipo de produto e é informado na descrição de cada item.",
      },
      {
        question: "Posso incluir uma mensagem personalizada?",
        answer: "Sim! Durante o checkout, você pode adicionar uma mensagem personalizada que será impressa em um cartão e enviada junto com o presente.",
      },
      {
        question: "Os produtos são embalados para presente?",
        answer: "Sim! Todos os pedidos são enviados em embalagens próprias para presente, sem informações de preço. A embalagem é cuidadosamente preparada para presentear.",
      },
      {
        question: "Como saber se um produto está em estoque?",
        answer: "A disponibilidade é mostrada na página do produto. Se estiver esgotado, você pode se cadastrar para ser avisado quando voltar ao estoque.",
      },
    ],
  },
  {
    category: "Conta e Cadastro",
    icon: "👤",
    questions: [
      {
        question: "Preciso ter uma conta para comprar?",
        answer: "Não é obrigatório, mas recomendamos criar uma conta. Assim, você pode acompanhar seus pedidos, salvar endereços e ter uma experiência mais rápida nas próximas compras.",
      },
      {
        question: "Como criar uma conta?",
        answer: "Clique em 'Entrar' no topo do site e selecione 'Criar conta'. Você pode se cadastrar usando seu e-mail ou telefone. É rápido e seguro!",
      },
      {
        question: "Esqueci minha senha. Como recuperar?",
        answer: "Na página de login, clique em 'Esqueci minha senha'. Enviaremos um link de redefinição para seu e-mail cadastrado.",
      },
      {
        question: "Meus dados estão seguros?",
        answer: "Sim! Utilizamos criptografia de ponta a ponta e seguimos a LGPD para proteger seus dados pessoais. Não compartilhamos suas informações com terceiros.",
      },
    ],
  },
]

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque por dúvidas (ex: entrega, pagamento, troca...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Help */}
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Não encontrou sua dúvida?</h3>
                    <p className="text-sm text-muted-foreground">
                      Nossa equipe está pronta para ajudar
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/contact" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Fale Conosco
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {filteredCategories.map((category) => (
              <Card key={category.category} className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={category.category} className="border-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-semibold">{category.category}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4 mt-2">
                          {category.questions.map((faq, index) => (
                            <div key={index} className="border-t pt-4 first:border-0 first:pt-0">
                              <h3 className="font-medium mb-2">{faq.question}</h3>
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </Accordion>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente buscar com outros termos ou entre em contato conosco
              </p>
              <Button asChild>
                <Link href="/contact">Fale Conosco</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
