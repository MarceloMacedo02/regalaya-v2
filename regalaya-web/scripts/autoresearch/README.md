# AutoResearch

Sistema de otimização automática de código usando IA para melhorar métricas específicas da codebase.

## Quick Start

### 1. Usar o Wizard (Recomendado)

Se você não sabe qual métrica usar ou como configurar:

```bash
npm run autoresearch:plan
```

O wizard vai te guiar por 5 passos:
1. **Objetivo** - Descreva o que quer melhorar
2. **Escopo** - Quais arquivos podem ser modificados
3. **Métrica** - O que medir (coverage, performance, etc.)
4. **Verify** - Comando para verificar a métrica
5. **Validação** - Teste do comando

### 2. Executar AutoResearch

Após configurar:

```bash
npm run autoresearch
```

### 3. Configuração Inline

Você também pode usar configuração inline:

```bash
npm run autoresearch -- "Goal: Increase test coverage from 70% to 90% Scope: src/**/*.ts Metric: coverage % (higher is better) Verify: npm test -- --coverage"
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run autoresearch:plan` | Wizard de configuração |
| `npm run autoresearch` | Executa loop autônomo |
| `npm run autoresearch:security` | Audit de segurança |
| `npm run autoresearch:debug` | Caçador de bugs |
| `npm run autoresearch:fix` | Corretor de erros |
| `npm run autoresearch:learn` | Gera documentação |

## Configuração Inline

Após executar o comando, forneça a configuração:

```bash
npm run autoresearch -- "Goal: <objetivo> Scope: <pattern> Metric: <métrica> Verify: <comando> Guard: <guard> Iterations: N"
```

### Exemplo

```bash
npm run autoresearch -- "Goal: Increase test coverage from 72% to 90% Scope: src/**/*.ts Metric: coverage % (higher is better) Verify: npm test -- --coverage Guard: npm test Iterations: 50"
```

### Opções

| Opção | Descrição | Exemplo |
|-------|-----------|---------|
| **Goal** | Objetivo específico e mensurável | "Increase test coverage from 72% to 90%" |
| **Scope** | Arquivos que podem ser modificados | `src/**/*.ts`, `**/*.py` |
| **Metric** | Métrica e direção | "coverage % (higher is better)" |
| **Verify** | Comando de verificação | `npm test -- --coverage` |
| **Guard** | Comando de segurança (opcional) | `npm test`, `npm run lint` |
| **Iterations** | Número máximo de iterações | `Iterations: 50` |

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run autoresearch:plan` | Inicia o wizard de configuração |
| `npm run autoresearch` | Executa o AutoResearch com configuração salva |

## Loop Autônomo - 8 Fases

O AutoResearch executa um loop autônomo de 8 fases:

### FASE 0: SETUP
- Ler configuração
- Verificar git status
- Estabelecer baseline (iteração #0)
- Confirmar configuração

### FASE 1: REVIEW
- Ler estado atual do código
- Review git log (últimas mudanças)
- Ler results.tsv (iterações anteriores)
- Analisar contexto

### FASE 2: CHOOSE
- Escolher próxima mudança
- Gerar plano de modificação
- Selecionar arquivos alvo

### FASE 3: MAKE
- Aplicar mudança atômica
- Modificar código
- Validar sintaxe

### FASE 4: COMMIT
- Git add de todas mudanças
- Git commit com mensagem descritiva
- Capturar commit hash

### FASE 5: VERIFY
- Executar guard command (se existir)
- Executar verify command
- Extrair valor da métrica

### FASE 6: DECIDE
- Comparar com valor anterior
- Decidir: **Keep**, **Discard**, ou **Crash**
- Keep: métrica melhorou
- Discard: métrica piorou
- Crash: verify falhou

### FASE 7: LOG
- Registrar resultado em results.tsv
- Formato TSV para análise

### FASE 8: REPEAT
- Verificar se atingiu target
- Verificar max iterations
- Verificar max time
- Continuar ou parar

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

> src/**/*.ts

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

Executando comando de verificação...

✓ Comando executou com sucesso
✓ Output capturado
✓ Valor extraído: 72.5%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Configuração Final

Goal: Increase test coverage from 72.5% to 90%
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

## Configuração (.autoresearchrc)

O wizard gera automaticamente um arquivo `.autoresearchrc`:

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
  },
  "constraints": {
    "maxIterations": 10,
    "maxTimeMinutes": 30
  }
}
```

## Métricas Suportadas

### Test Coverage

```
Métrica: coverage %
Direção: higher is better
Comando: npm test -- --coverage
```

### Performance (API Response Time)

```
Métrica: response time (ms)
Direção: lower is better
Comando: npm run bench:api
```

### Bundle Size

```
Métrica: bundle size (KB)
Direção: lower is better
Comando: npm run build && npm run analyze
```

### Build Time

```
Métrica: build duration (s)
Direção: lower is better
Comando: npm run build
```

## Referências

- `SKILL.md` — Documentação principal do AutoResearch
- `references/plan-workflow.md` — Protocolo detalhado do wizard
- `.autoresearchrc.example` — Exemplo de configuração
