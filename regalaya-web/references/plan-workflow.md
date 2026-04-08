# Plan Workflow — Wizard de Configuração do AutoResearch

## Visão Geral

Este documento descreve o protocolo detalhado do wizard `/autoresearch:plan`, que guia usuários na configuração do AutoResearch através de 5 passos interativos.

## Arquitetura do Wizard

```
┌──────────────────────────────────────────────────────────┐
│                   Wizard Controller                       │
├──────────────────────────────────────────────────────────┤
│  Step 1: Objetivo  →  Step 2: Escopo  →  Step 3: Métrica │
│         ↓                    ↓                    ↓       │
│  Step 4: Verify   →  Step 5: Validação  →  Save Config   │
└──────────────────────────────────────────────────────────┘
                            ↓
              ┌─────────────────────────────┐
              │   Metric Suggestion Engine  │
              │   - Analisa codebase        │
              │   - Sugere métricas         │
              │   - Detecta comandos        │
              └─────────────────────────────┘
```

## Passo 1: Capturar Objetivo

### Prompt

```
Qual é o seu objetivo? (descreva em linguagem natural)
Ex: "Quero que a API responda mais rápido"
Ex: "Preciso aumentar a cobertura de testes"
Ex: "Diminuir o tamanho do bundle"
```

### Validação

- ✅ Deve ser uma string não vazia
- ✅ Deve conter pelo menos 10 caracteres
- ✅ Deve descrever uma melhoria mensurável

### Extração de Intenção

O wizard analisa o objetivo para sugerir métricas:

| Palavras-chave | Métrica Sugerida | Direção |
|----------------|------------------|---------|
| "mais rápido", "performance", "velocidade" | response time | lower is better |
| "cobertura", "testes", "tests" | coverage % | higher is better |
| "bundle", "tamanho", "size" | bundle size | lower is better |
| "build", "compilação" | build duration | lower is better |
| "throughput", "requisições" | throughput | higher is better |

### Exemplo de Saída

```json
{
  "goal": "Quero aumentar a cobertura de testes"
}
```

---

## Passo 2: Definir Escopo

### Prompt

```
Quais arquivos podem ser modificados?
Use patterns glob (ex: src/**/*.ts)
Ex: src/api/**/*.ts
Ex: src/**/*.ts, src/**/*.test.ts
```

### Validação

- ✅ Deve ser um pattern glob válido
- ✅ Deve apontar para arquivos existentes (validação posterior)
- ⚠️ Alertar se incluir arquivos de configuração ou node_modules

### Sugestões Baseadas na Codebase

O wizard escaneia a codebase e sugere:

```
Codebase detectada:
- TypeScript: 120 arquivos em src/
- Tests: 45 arquivos em **/*.test.ts
- Components: 30 arquivos em src/components/

Sugestões:
[1] src/**/*.ts (todos arquivos TypeScript)
[2] src/components/**/*.tsx (apenas componentes)
[3] src/api/**/*.ts (apenas API)
[4] Personalizado
```

### Exemplo de Saída

```json
{
  "scope": ["src/**/*.ts", "!src/**/*.test.ts"]
}
```

---

## Passo 3: Definir Métrica

### Prompt

```
O que você quer medir?

Sugestões baseadas na codebase:
[1] Test coverage: coverage %
[2] Performance: response time (ms)
[3] Bundle size: bundle size (KB/MB)
[4] Build time: build duration (s)
[5] Personalizado

Direção:
[1] higher is better (maior é melhor)
[2] lower is better (menor é melhor)
```

### Métricas Pré-configuradas

#### Test Coverage

```json
{
  "name": "coverage %",
  "direction": "higher is better",
  "verify": {
    "command": "npm test -- --coverage 2>&1",
    "parser": "regex:All files.*\\|\\s+([\\d.]+)"
  }
}
```

#### Performance (p95 Response Time)

```json
{
  "name": "response time (ms)",
  "direction": "lower is better",
  "verify": {
    "command": "npm run bench:api 2>&1",
    "parser": "regex:p95:\\s+([\\d.]+)ms"
  }
}
```

#### Bundle Size

```json
{
  "name": "bundle size (KB)",
  "direction": "lower is better",
  "verify": {
    "command": "npm run build && npm run analyze 2>&1",
    "parser": "regex:Total Size:\\s+([\\d.]+)\\s+KB"
  }
}
```

#### Build Time

```json
{
  "name": "build duration (s)",
  "direction": "lower is better",
  "verify": {
    "command": "time npm run build 2>&1",
    "parser": "regex:real\\s+(\\d+)m(\\d+\\.\\d+)s"
  }
}
```

### Validação

- ✅ Métrica deve ter nome e direção
- ✅ Comando verify deve ser testado no passo 5
- ⚠️ Alertar se métrica não for mensurável

### Exemplo de Saída

```json
{
  "metric": {
    "name": "coverage %",
    "direction": "higher is better"
  }
}
```

---

## Passo 4: Definir Comando Verify

### Prompt

```
Qual comando verifica a métrica?
O comando deve imprimir o valor da métrica no stdout.

Ex: npm test -- --coverage | grep "All files"
Ex: npm run bench:api | grep "p95"
Ex: npm run build && npm run analyze | grep "Total Size"

Dica: O wizard tentará extrair o valor automaticamente.
```

### Parser Automático

O wizard usa regex heurística para extrair valores:

| Pattern | Regex | Exemplo |
|---------|-------|---------|
| Porcentagem | `([\\d.]+)%` | "85.2%" → 85.2 |
| Milissegundos | `([\\d.]+)\\s*ms` | "120ms" → 120 |
| Segundos | `([\\d.]+)\\s*s` | "3.5s" → 3.5 |
| KB/MB | `([\\d.]+)\\s*(KB|MB)` | "256 KB" → 256 |

### Validação

- ✅ Comando deve ser executável
- ✅ Comando deve produzir output
- ⚠️ Alertar se comando falhar ou timeout

### Exemplo de Saída

```json
{
  "verify": {
    "command": "npm test -- --coverage 2>&1 | grep \"All files\"",
    "parser": "auto"
  }
}
```

---

## Passo 5: Validar (Dry-Run)

### Execução

```bash
Executando comando de verificação para validar...

$ npm test -- --coverage 2>&1 | grep "All files"
All files           |   72.5 |    65.2 |   78.1 |   72.3 |
```

### Validação

```
✓ Comando executou com sucesso
✓ Output capturado
✓ Valor extraído: 72.5%

Configuração válida!
```

### Falhas Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| ❌ Comando não encontrado | Comando não existe no PATH | Verificar scripts do package.json |
| ❌ Timeout | Comando demorou > 60s | Aumentar timeout ou otimizar comando |
| ❌ Valor não extraído | Parser não encontrou padrão | Especificar parser personalizado |
| ❌ Output vazio | Comando não produz stdout | Redirecionar stderr ou ajustar comando |

### Exemplo de Saída

```json
{
  "validation": {
    "success": true,
    "baseline": 72.5,
    "command": "npm test -- --coverage 2>&1 | grep \"All files\"",
    "output": "All files | 72.5 | 65.2 | 78.1 | 72.3 |"
  }
}
```

---

## Salvamento de Configuração

### Arquivo `.autoresearchrc`

Após validação, o wizard salva:

```json
{
  "goal": "Increase test coverage from 72.5% to 90%",
  "scope": ["src/**/*.ts"],
  "metric": {
    "name": "coverage %",
    "direction": "higher is better",
    "baseline": 72.5,
    "target": 90
  },
  "verify": {
    "command": "npm test -- --coverage 2>&1 | grep \"All files\"",
    "parser": "regex:All files.*\\|\\s+([\\d.]+)",
    "timeout": 60000
  },
  "constraints": {
    "maxIterations": 10,
    "maxTimeMinutes": 30,
    "allowedPatterns": ["src/**/*.ts"],
    "forbiddenPatterns": ["**/*.test.ts", "**/node_modules/**"]
  },
  "createdAt": "2026-03-29T10:30:00.000Z",
  "updatedAt": "2026-03-29T10:30:00.000Z"
}
```

### Prompt Final

```
Configuração final:
  Goal: Increase test coverage from 72.5% to 90%
  Scope: src/**/*.ts
  Metric: coverage % (higher is better)
  Verify: npm test -- --coverage 2>&1 | grep "All files"

Deseja iniciar o AutoResearch agora?
[1] Sim, iniciar agora
[2] Não, apenas salvar configuração
[3] Cancelar
```

---

## Fluxo Completo — Exemplo de Sessão

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

O que você quer medir?

Sugestões baseadas no seu objetivo:
[1] Test coverage: coverage % (higher is better)
[2] Performance: response time (ms) (lower is better)
[3] Bundle size: bundle size (KB/MB) (lower is better)
[4] Build time: build duration (s) (lower is better)
[5] Personalizado

> 1

✓ Métrica capturada: coverage % (higher is better)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Passo 4/5: Comando Verify

Qual comando verifica a métrica?
O comando deve imprimir o valor da métrica no stdout.

Ex: npm test -- --coverage | grep "All files"
Ex: npm run bench:api | grep "p95"

> npm test -- --coverage

✓ Comando capturado: npm test -- --coverage

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Passo 5/5: Validação

Executando comando de verificação para validar...

$ npm test -- --coverage

PASS src/utils/math.test.ts
PASS src/api/handlers.test.ts
...

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   72.5  |    65.2  |   78.1  |   72.3  |
----------|---------|----------|---------|---------|-------------------

✓ Comando executou com sucesso
✓ Output capturado
✓ Valor extraído: 72.5%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Configuração Final

Goal: Increase test coverage from 72.5% to 90%
Scope: src/**/*.ts
Metric: coverage % (higher is better)
Verify: npm test -- --coverage

Deseja iniciar o AutoResearch agora?
[1] Sim, iniciar agora
[2] Não, apenas salvar configuração
[3] Cancelar

> 2

✓ Configuração salva em .autoresearchrc

Próximo passo: Execute 'npm run autoresearch' para iniciar.
```

---

## Implementação Técnica

### Estrutura de Arquivos

```
regalaya-web/
├── scripts/
│   └── autoresearch/
│       ├── plan-wizard.ts      # Wizard principal
│       ├── steps/
│       │   ├── objective.ts    # Passo 1
│       │   ├── scope.ts        # Passo 2
│       │   ├── metric.ts       # Passo 3
│       │   ├── verify.ts       # Passo 4
│       │   └── validate.ts     # Passo 5
│       ├── metrics/
│       │   ├── coverage.ts     # Métrica de coverage
│       │   ├── performance.ts  # Métrica de performance
│       │   └── bundle.ts       # Métrica de bundle
│       └── utils/
│           ├── parser.ts       # Parser de valores
│           ├── validator.ts    # Validador de comandos
│           └── config.ts       # Salvamento de config
├── .autoresearchrc             # Configuração salva
└── package.json                # Scripts npm
```

### Scripts NPM

```json
{
  "scripts": {
    "autoresearch:plan": "ts-node scripts/autoresearch/plan-wizard.ts",
    "autoresearch": "ts-node scripts/autoresearch/run.ts"
  }
}
```

### Dependências

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

## Referências

- `SKILL.md` — Documentação principal do AutoResearch
- `.autoresearchrc` — Exemplo de configuração
- `scripts/autoresearch/` — Implementação de referência
