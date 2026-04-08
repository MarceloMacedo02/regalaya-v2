# Autonomous Loop Protocol — Protocolo de Loop de 8 Fases

## Visão Geral

O AutoResearch executa um loop autônomo de 8 fases que se repete até atingir o objetivo ou condições de parada.

```
┌─────────────────────────────────────────────────────────────┐
│                    FASE 0: SETUP                            │
│  - Ler configuração                                         │
│  - Verificar git status                                     │
│  - Estabelecer baseline (iteração #0)                       │
│  - Confirmar configuração                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              ┌──────────────────────────────────┐           │
│              │         LOOP PRINCIPAL           │           │
│              │  (repete até condição de parada) │           │
│              └──────────────────────────────────┘           │
│                           │                                 │
│              ┌────────────┴────────────┐                    │
│              ▼                         ▼                    │
│    FASE 1: REVIEW           FASE 6: DECIDE                  │
│    - Estado atual           - Comparar valores              │
│    - Git log                - Keep / Discard / Crash        │
│    - Results.tsv            - Reverter se necessário        │
│              │                         │                    │
│              ▼                         ▼                    │
│    FASE 2: CHOOSE           FASE 7: LOG                     │
│    - Escolher mudança       - Registrar em TSV              │
│    - Gerar plano            - Atualizar estado              │
│              │                         │                    │
│              ▼                         ▼                    │
│    FASE 3: MAKE             FASE 8: REPEAT                  │
│    - Aplicar mudança        - Verificar condições           │
│    - Validar sintaxe        - Continuar ou parar            │
│              │                                              │
│              ▼                                              │
│    FASE 4: COMMIT                                           │
│    - Git add                                                │
│    - Git commit                                             │
│    - Capturar hash                                          │
│              │                                              │
│              ▼                                              │
│    FASE 5: VERIFY                                           │
│    - Guard command (opcional)                               │
│    - Verify command                                         │
│    - Extrair valor                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## FASE 0: SETUP

### Objetivo

Preparar o ambiente para o loop autônomo.

### Tarefas

1. **Ler configuração**
   - Carregar `.autoresearchrc` ou parse inline config
   - Validar campos obrigatórios
   - Aplicar defaults

2. **Verificar git status**
   - Working directory limpo?
   - Alertar se houver mudanças pendentes

3. **Estabelecer baseline**
   - Executar verify command
   - Extrair valor inicial
   - Registrar como iteração #0

4. **Confirmar configuração**
   - Mostrar resumo
   - Aguardar confirmação do usuário

### Output

```
Configuration:
  Goal: Increase test coverage from 72% to 90%
  Scope: src/**/*.ts
  Metric: coverage % (higher is better)
  Verify: npm test -- --coverage
  Guard: npm test
  Max Iterations: 50

✓ Baseline: 72.5%
✓ Target: 90%
✓ Improvement needed: +24.1%

Start autonomous loop? (y/n)
```

---

## FASE 1: REVIEW

### Objetivo

Compreender o estado atual antes de fazer mudanças.

### Tarefas

1. **Ler estado atual**
   - Valor atual da métrica
   - Melhor valor atingido
   - Iteração atual

2. **Review git log**
   - Últimos 5 commits
   - Identificar padrões de mudança

3. **Ler results.tsv**
   - Histórico de iterações
   - Taxa de sucesso
   - Mudanças mais eficazes

4. **Analisar contexto**
   - Arquivos modificados recentemente
   - Mudanças pendentes
   - Conflitos potenciais

### Output

```
FASE 1: REVIEW
  Git log (últimos 5):
    abc1234 autoresearch: iteration 5 - optimize loop
    def5678 autoresearch: iteration 4 - add caching
    ghi9012 autoresearch: iteration 3 - refactor utils
    ...
  Results: 5 iterações registradas
  Current coverage: 78.2%
  Best coverage: 78.2%
```

---

## FASE 2: CHOOSE

### Objetivo

Selecionar a próxima mudança a ser feita.

### Tarefas

1. **Analisar oportunidades**
   - Arquivos in-scope
   - Padrões de código otimizáveis
   - Lições de iterações anteriores

2. **Gerar plano de mudança**
   - Tipo de otimização
   - Arquivos alvo
   - Impacto esperado

3. **Selecionar melhor opção**
   - Priorizar por impacto
   - Considerar risco
   - Balancear exploração vs exploração

### Output

```
FASE 2: CHOOSE
  Generating change plan...
  Selected: Add memoization to formatDate function
  Target files: src/utils/date.ts
  Expected impact: +0.5% coverage
```

---

## FASE 3: MAKE

### Objetivo

Aplicar a mudança de código de forma atômica.

### Tarefas

1. **Aplicar mudança**
   - Modificar arquivos
   - Adicionar testes
   - Atualizar documentação

2. **Validar sintaxe**
   - TypeScript compile
   - Lint básico
   - Sem erros óbvios

3. **Verificar escopo**
   - Apenas arquivos in-scope
   - Sem mudanças colaterais

### Output

```
FASE 3: MAKE
  Applying atomic change...
  Modified: src/utils/date.ts (+15 lines)
  Added: src/utils/date.test.ts (+25 lines)
  Syntax check: PASS
```

---

## FASE 4: COMMIT

### Objetivo

Criar ponto de restauração antes de verificar.

### Tarefas

1. **Git add**
   - Todas mudanças
   - Staged para commit

2. **Git commit**
   - Mensagem descritiva
   - Incluir número da iteração
   - Incluir métrica alvo

3. **Capturar hash**
   - Short hash (7 chars)
   - Registrar para logging

### Output

```
FASE 4: COMMIT
  ✓ Committed: abc1234
  Message: autoresearch: iteration 6 - coverage
```

---

## FASE 5: VERIFY

### Objetivo

Verificar se a mudança melhorou a métrica.

### Tarefas

1. **Executar guard command** (opcional)
   - Validar integridade
   - Testes passam?
   - Lint limpo?

2. **Executar verify command**
   - Comando mecânico
   - Capturar output
   - Extrair valor

3. **Validar resultado**
   - Valor extraído com sucesso?
   - Dentro de faixa esperada?

### Output

```
FASE 5: VERIFY
  Running guard: npm test
  ✓ Guard: PASS (45 tests)
  
  Running verify: npm test -- --coverage
  ✓ Coverage: 78.9%
```

---

## FASE 6: DECIDE

### Objetivo

Decidir o destino da mudança baseada na métrica.

### Tarefas

1. **Comparar valores**
   - Novo valor vs valor anterior
   - Considerar direção (higher/lower is better)

2. **Tomar decisão**
   - **Keep**: melhorou
   - **Discard**: piorou
   - **Crash**: verify falhou

3. **Executar ação**
   - Keep: continuar
   - Discard: `git revert`
   - Crash: `git reset --hard`

### Output

```
FASE 6: DECIDE
  Previous: 78.2%
  Current:  78.9%
  Change:   +0.7% (+0.9%)
  
  ✓ Improved
  Decision: KEEP
```

---

## FASE 7: LOG

### Objetivo

Registrar resultado para análise futura.

### Tarefas

1. **Formatar resultado**
   - Campos TSV
   - Timestamp ISO
   - Valores numéricos

2. **Append em results.tsv**
   - Criar se não existir
   - Header na primeira linha
   - Uma linha por iteração

3. **Atualizar estado**
   - Incrementar iteração
   - Atualizar melhor valor
   - Resetar/conectar falhas

### Formato TSV

```tsv
iteration	timestamp	value	change	changePercent	decision	filesModified	commitHash	notes
6	2026-03-29T11:30:00Z	78.9	+0.7	+0.9%	keep	src/utils/date.ts;src/utils/date.test.ts	abc1234	Added memoization
```

---

## FASE 8: REPEAT

### Objetivo

Decidir se continua ou para o loop.

### Tarefas

1. **Verificar condições de parada**
   - `iteration >= maxIterations`?
   - `elapsedTime >= maxTimeMinutes`?
   - `value >= target`?
   - `consecutiveFailures >= 5`?

2. **Decidir continuação**
   - Nenhuma condição: continuar
   - Alguma condição: parar

3. **Preparar próxima iteração**
   - Resetar estado se necessário
   - Limpar cache
   - Log mensagem de parada

### Output

```
FASE 8: REPEAT
  Iteration: 6/50
  Elapsed: 5.2 minutes
  Current: 78.9%
  Target: 90%
  
  Continue: YES
  
────────────────────────────────────────
```

---

## Condições de Parada

### 1. Máximo de Iterações

```typescript
if (iteration >= maxIterations) {
  console.log('⏱ Maximum iterations reached');
  stop();
}
```

### 2. Tempo Máximo

```typescript
const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
if (elapsedMinutes >= maxTimeMinutes) {
  console.log('⏱ Time limit reached');
  stop();
}
```

### 3. Target Atingido

```typescript
const targetReached = direction === 'higher is better'
  ? currentValue >= target
  : currentValue <= target;

if (targetReached) {
  console.log('🎯 Target reached!');
  stop();
}
```

### 4. Falhas Consecutivas

```typescript
if (consecutiveFailures >= 5) {
  console.log('✗ Too many consecutive failures');
  stop();
}
```

---

## Relatório Final

### Estrutura

```
✨ AutoResearch Complete!

  Initial coverage: 72.5%
  Final coverage:   88.3%
  Total Improvement: +21.8%
  
  Iterations: 45
  Time: 42m 15s
  
  Kept: 32
  Discarded: 10
  Crashes: 3
  
  Files modified: 15
  Results saved to: results.tsv
```

---

## Referências

- `SKILL.md` — Documentação principal
- `references/core-principles.md` — 7 princípios
- `references/plan-workflow.md` — Wizard
