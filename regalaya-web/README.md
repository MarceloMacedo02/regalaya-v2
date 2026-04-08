# Regalaya Web

Frontend e-commerce da plataforma Regalaya - Sistema de presentes e recomendações com IA.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript 5+
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Estado:** Zustand
- **Formulários:** React Hook Form + Zod

## Pré-requisitos

- Node.js 18+
- npm 9+

## Instalação

```bash
# Clone o repositório
cd regalaya-web

# Instale as dependências
npm install
```

## Configuração

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# App
NEXT_PUBLIC_API_URL=https://api.regalaya.com
NEXT_PUBLIC_SITE_URL=https://regalaya.com

# WhatsApp Webhook
WHATSAPP_WEBHOOK_SECRET=your-secret

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor em http://localhost:3000
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint

# Formatação
npm run format       # Executa Prettier
npm run format:check # Verifica formatação

# Testes
npm run test         # Executa testes
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Executa testes com coverage

# AutoResearch (Otimização com IA)
npm run autoresearch:plan  # Wizard de configuração
npm run autoresearch       # Executa otimização automática
```

## AutoResearch (Otimização com IA)

O projeto inclui o **AutoResearch**, um sistema que usa IA para otimizar automaticamente métricas do seu código.

### Usando o Wizard

Se você não sabe qual métrica usar ou como configurar:

```bash
npm run autoresearch:plan
```

O wizard guia você por 5 passos:
1. **Objetivo** - Descreva o que quer melhorar (ex: "aumentar cobertura de testes")
2. **Escopo** - Quais arquivos podem ser modificados (ex: `src/**/*.ts`)
3. **Métrica** - O que medir (coverage, performance, bundle size, etc.)
4. **Verify** - Comando para verificar a métrica
5. **Validação** - Teste do comando para validar

### Executando a Otimização

Após configurar:

```bash
npm run autoresearch
```

O AutoResearch vai:
1. Medir a baseline atual
2. Gerar mudanças de código com IA
3. Verificar se a métrica melhorou
4. Manter ou reverter mudanças
5. Repetir até atingir o target

### Métricas Suportadas

| Métrica | Direção | Comando Exemplo |
|---------|---------|-----------------|
| Test Coverage | higher is better | `npm test -- --coverage` |
| Response Time | lower is better | `npm run bench:api` |
| Bundle Size | lower is better | `npm run build && npm run analyze` |
| Build Time | lower is better | `npm run build` |

### Configuração

A configuração é salva em `.autoresearchrc`:

```json
{
  "goal": "Increase test coverage from 72% to 90%",
  "scope": ["src/**/*.ts"],
  "metric": {
    "name": "coverage %",
    "direction": "higher is better",
    "baseline": 72,
    "target": 90
  },
  "verify": {
    "command": "npm test -- --coverage 2>&1",
    "timeout": 60000
  }
}
```

Para mais detalhes, veja `scripts/autoresearch/README.md`.

---

## Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── (web)/             # Domínio E-commerce (SEO)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (admin)/           # Domínio Admin (Dashboard)
│   │   ├── layout.tsx
│   │   └── dashboard/
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globais
│
├── components/             # Componentes React
│   ├── ui/                # shadcn/ui components
│   ├── web/               # Componentes E-commerce
│   ├── admin/             # Componentes Dashboard
│   └── shared/            # Componentes compartilhados
│
├── lib/                   # Utilitários e configurações
│   ├── api.ts             # Cliente HTTP (Axios)
│   ├── utils.ts           # Funções utilitárias
│   └── constants.ts       # Constantes da aplicação
│
├── hooks/                 # Custom Hooks
│   ├── useAuth.ts
│   └── useCart.ts
│
└── types/                 # Definições de tipos TypeScript
    ├── index.ts
    ├── product.ts
    └── user.ts
```

## Convenções de Código

### Commits

Este projeto segue o padrão [Conventional Commits](https://conventionalcommits.org):

```bash
# Exemplo de commits
git commit -m "feat: add product catalog page"
git commit -m "fix: resolve cart item quantity bug"
git commit -m "docs: update API documentation"
```

### Formatação

O projeto usa Prettier para formatação automática. Configure seu editor para:

- Formatar ao salvar (format on save)
- Usar config do projeto (.prettierrc)

### Linting

O ESLint verifica:

- Regras do Next.js
- TypeScript
- Boas práticas React

Execute `npm run lint` antes de fazer commit.

## Variáveis de Ambiente

| Variável                  | Descrição                  | Obrigatória    |
| ------------------------- | -------------------------- | -------------- |
| `NEXT_PUBLIC_API_URL`     | URL da API backend         | Sim            |
| `NEXT_PUBLIC_SITE_URL`    | URL do site                | Sim            |
| `WHATSAPP_WEBHOOK_SECRET` | Secret do webhook WhatsApp | Sim (produção) |
| `NEXTAUTH_SECRET`         | Secret para autenticação   | Sim            |
| `NEXT_PUBLIC_GA_ID`       | Google Analytics ID        | Não            |

## Deploy

### Vercel (Recomendado)

```bash
# Via Vercel CLI
vercel deploy

# Ou conecte o repositório no Vercel
# https://vercel.com/new
```

### Docker

```bash
# Build da imagem
docker build -t regalaya-web .

# Executar container
docker run -p 3000:3000 regalaya-web
```

## Dokumentation

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)

## Licença

MIT
