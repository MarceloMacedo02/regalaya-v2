# Status de Implementação: /autoresearch:plan

**Projeto:** Regalaya Web  
**Épico:** EPIC-012: Web Frontend (Next.js 14) - Loja Virtual  
**Feature:** AutoResearch Plan Wizard  
**Data:** 29 de março de 2026  
**Status:** ✅ Implementado e Funcional

---

## Visão Geral

O comando `/autoresearch:plan` (acessado via `npm run autoresearch:plan`) implementa um wizard interativo que guia usuários na configuração do AutoResearch através de 5 passos.

---

## Histórias Implementadas (37-45)

| História | Título | Status | Descrição |
|----------|--------|--------|-----------|
| US-FE-037 | Passo 1: Capturar Objetivo | ✅ Completo | Captura objetivo em linguagem natural |
| US-FE-038 | Passo 2: Definir Escopo | ✅ Completo | Define arquivos modificáveis com glob patterns |
| US-FE-039 | Passo 3: Definir Métrica | ✅ Completo | Seleciona métrica e direção de melhoria |
| US-FE-040 | Passo 4: Definir Verify | ✅ Completo | Especifica comando de verificação |
| US-FE-041 | Passo 5: Validar Configuração | ✅ Completo | Executa dry-run para validar |
| US-FE-042 | Sugestão Inteligente de Métricas | ✅ Completo | Analisa objetivo e sugere métricas |
| US-FE-043 | Scan de Codebase | ✅ Completo | Escaneia codebase para sugerir escopos |
| US-FE-044 | Parser Automático de Valores | ✅ Completo | Extrai valores automaticamente do output |
| US-FE-045 | Salvamento de Configuração | ✅ Completo | Salva configuração em .autoresearchrc |

---

## Arquitetura Implementada

```
scripts/autoresearch/
├── plan-wizard.ts              # Controller principal ✅
├── steps/
│   ├── objective.ts            # Passo 1: Objetivo ✅
│   ├── scope.ts                # Passo 2: Escopo ✅
│   ├── metric.ts               # Passo 3: Métrica ✅
│   ├── verify.ts               # Passo 4: Verify ✅
│   └── validate.ts             # Passo 5: Validação ✅
├── utils/
│   ├── config.ts               # Salvamento de configuração ✅
│   └── runner.ts               # Execução de comandos ✅
└── metrics/                    # (vazio - métricas inline)
```

---

## Funcionalidades Implementadas

### ✅ Passo 1: Capturar Objetivo

- Input de texto livre em linguagem natural
- Validação de mínimo 10 caracteres
- Análise de palavras-chave para sugerir métrica
- Sugestões baseadas em padrões:
  - "mais rápido", "performance" → response time (lower is better)
  - "cobertura", "testes" → coverage % (higher is better)
  - "bundle", "tamanho" → bundle size (lower is better)
  - "build", "compilação" → build duration (lower is better)

### ✅ Passo 2: Definir Escopo

- Input de patterns glob
- Scan automático da codebase para sugestões
- Validação de patterns
- Contagem de arquivos encontrados
- Sugestões detectadas:
  - TypeScript (src/**/*.ts)
  - React Components (src/**/*.tsx)
  - Tests (**/*.test.ts)
  - API (src/api/**/*.ts)
  - Components (src/components/**/*.tsx)

### ✅ Passo 3: Definir Métrica

- Seleção de métricas pré-configuradas:
  - Test coverage (coverage %)
  - Performance (response time)
  - Bundle size
  - Build time
  - Throughput
  - Personalizado
- Confirmação de direção (higher/lower is better)
- Aceita sugestão do Passo 1 automaticamente

### ✅ Passo 4: Definir Comando Verify

- Input de comando shell
- Sugestão automática baseada na métrica
- Validação de comando não-vazio
- Suporte a pipes e redirecionamentos

### ✅ Passo 5: Validar (Dry-Run)

- Execução do comando de verificação
- Timeout de 60 segundos
- Extração automática de valor com heurística:
  - Porcentagem (72.5%)
  - Milissegundos (120ms)
  - Segundos (3.5s)
  - KB/MB (256 KB)
  - Tabelas (| 72.5 |)
- Retry em caso de falha
- Input manual de valor se extração falhar

### ✅ Salvamento de Configuração

- Gera arquivo `.autoresearchrc` com:
  - Goal descritivo com baseline e target
  - Scope patterns
  - Metric configuration (name, direction, baseline, target)
  - Verify command com timeout
  - Constraints (maxIterations, maxTimeMinutes, patterns)
  - Timestamps (createdAt, updatedAt)
- Target calculado automaticamente:
  - Coverage: 90% fixos
  - Higher is better: +20%
  - Lower is better: -20%
- Opção de iniciar AutoResearch imediatamente

---

## Comandos NPM

```bash
# Iniciar wizard
npm run autoresearch:plan

# Executar AutoResearch com configuração salva
npm run autoresearch

# Comandos adicionais
npm run autoresearch:security   # Audit de segurança
npm run autoresearch:debug      # Caçador de bugs
npm run autoresearch:fix        # Corretor de erros
npm run autoresearch:learn      # Geração de documentação
```

---

## Exemplo de Sessão

```bash
$ npm run autoresearch:plan

🔬 AutoResearch Plan Wizard

Este wizard vai te ajudar a configurar o AutoResearch.
São 5 passos rápidos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Passo 1/5: Objetivo

Qual é o seu objetivo? (descreva em linguagem natural)
Ex: "Quero que a API responda mais rápido"
Ex: "Preciso aumentar a cobertura de testes"

> Quero aumentar a cobertura de testes

✓ Objetivo capturado: "Quero aumentar a cobertura de testes"
  → Métrica sugerida: coverage % (higher is better)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Passo 2/5: Escopo

Quais arquivos podem ser modificados?
Use patterns glob (ex: src/**/*.ts)

Codebase detectada:
- TypeScript: 120 arquivos em src/
- Tests: 45 arquivos em **/*.test.ts

Sugestões:
[1] src/**/*.ts (todos arquivos TypeScript)
[2] src/components/**/*.tsx (apenas componentes)
[3] src/api/**/*.ts (apenas API)
[4] Personalizado

> 1

✓ Escopo capturado: src/**/*.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Passo 3/5: Métrica

Sugestão baseada no seu objetivo:
  → coverage % (higher is better)

Usar esta sugestão? › Yes

✓ Métrica capturada: coverage % (higher is better)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Passo 4/5: Comando Verify

Qual comando verifica a métrica?

> npm test -- --coverage

✓ Comando capturado: npm test -- --coverage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Passo 5/5: Validação

Executando comando de verificação para validar...

$ npm test -- --coverage

PASS src/utils/math.test.ts
...
All files           |   72.5  |    65.2  |   78.1  |   72.3  |

✓ Comando executou com sucesso
✓ Output capturado
✓ Valor extraído: 72.5%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Configuração Final

  Goal: Increase coverage % from 72.5% to 90%
  Scope: src/**/*.ts
  Metric: coverage % (higher is better)
  Verify: npm test -- --coverage

Deseja:
[1] Salvar configuração e iniciar AutoResearch agora
[2] Apenas salvar configuração
[3] Cancelar

> 2

✓ Configuração salva em .autoresearchrc

Execute: npm run autoresearch para iniciar.

✨ Wizard completo!
```

---

## Configuração Gerada

Exemplo de `.autoresearchrc` gerado:

```json
{
  "goal": "Increase coverage % from 72.5 to 90",
  "scope": ["src/**/*.ts"],
  "metric": {
    "name": "coverage %",
    "direction": "higher is better",
    "baseline": 72.5,
    "target": 90
  },
  "verify": {
    "command": "npm test -- --coverage",
    "timeout": 60000
  },
  "constraints": {
    "maxIterations": 10,
    "maxTimeMinutes": 30,
    "allowedPatterns": ["src/**/*.ts"],
    "forbiddenPatterns": ["**/node_modules/**", "**/*.test.ts"]
  },
  "createdAt": "2026-03-29T10:30:00.000Z",
  "updatedAt": "2026-03-29T10:30:00.000Z"
}
```

---

## Dependências Utilizadas

```json
{
  "devDependencies": {
    "ts-node": "^10.9.2",
    "typescript": "^5",
    "prompts": "^2.4.2",
    "chalk": "^5.3.0",
    "glob": "^10.3.0"
  }
}
```

---

## Critérios de Aceite

| Critério | Status |
|----------|--------|
| Wizard com 5 passos interativos | ✅ |
| Captura de objetivo em linguagem natural | ✅ |
| Análise de intenção para sugerir métrica | ✅ |
| Scan de codebase para sugestões de escopo | ✅ |
| Validação de patterns glob | ✅ |
| Métricas pré-configuradas | ✅ |
| Comando verify com sugestão automática | ✅ |
| Validação com dry-run | ✅ |
| Parser automático de valores | ✅ |
| Retry em caso de falha | ✅ |
| Salvamento em .autoresearchrc | ✅ |
| Target calculado automaticamente | ✅ |
| Opção de iniciar AutoResearch | ✅ |
| Tratamento de erros | ✅ |
| Mensagens de feedback claras | ✅ |

---

## Referências

- `SKILL.md` — Documentação principal do AutoResearch
- `references/plan-workflow.md` — Protocolo detalhado do wizard
- `scripts/autoresearch/README.md` — README de uso
- `.autoresearchrc.example` — Exemplo de configuração

---

## Próximos Passos

1. ✅ Wizard implementado e funcional
2. ⏳ Integração com engine do AutoResearch (run.ts)
3. ⏳ Execução de iterações de otimização
4. ⏳ Geração de relatórios finais

---

**Documento criado:** 29 de março de 2026  
**Última atualização:** 29 de março de 2026  
**Responsável:** AutoResearch Team
