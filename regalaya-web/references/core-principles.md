# Core Principles — 7 Princípios Universais do AutoResearch

## Visão Geral

O AutoResearch é guiado por 7 princípios fundamentais que garantem eficácia e segurança no processo de otimização automática de código.

---

## 1. Mudança Atômica

**Princípio:** Cada iteração faz exatamente UMA mudança atômica e verificável.

### Por quê?

- Facilita rollback preciso
- Permite rastreamento claro de causa-efeito
- Reduz risco de mudanças catastróficas
- Simplifica debugging

### Como?

```typescript
// ❌ Ruim: Múltiplas mudanças
function optimize() {
  changeAlgorithm();
  addCaching();
  removeLogging();
}

// ✅ Bom: Uma mudança por vez
function optimize() {
  changeAlgorithm(); // Apenas isso
}
```

---

## 2. Commit Antes de Verificar

**Princípio:** Sempre faça git commit ANTES de verificar a métrica.

### Por quê?

- Permite `git revert` limpo
- Preserva histórico de tentativas
- Facilita auditoria
- Habilita `git bisect` para debugging

### Como?

```bash
# Fluxo correto
git add -A
git commit -m "autoresearch: iteration 5 - optimize loop"
npm test -- --coverage  # Verifica depois
```

---

## 3. Verify Mecânico

**Princípio:** O comando verify deve ser mecânico, determinístico e sem interpretação.

### Por quê?

- Remove ambiguidade
- Permite automação completa
- Garante reprodutibilidade
- Facilita debugging

### Como?

```bash
# ❌ Ruim: Subjetivo
Verify: "veja se ficou mais rápido"

# ✅ Bom: Mecânico
Verify: "npm run bench:api | grep 'p95' | awk '{print $2}'"
```

---

## 4. Guard Commands

**Princípio:** Use guard commands para validar integridade antes de verificar métrica.

### Por quê?

- Previne otimizações que quebram funcionalidade
- Garante que testes passam
- Mantém lint limpo
- Evita regressões

### Como?

```bash
# Fluxo com guard
Guard: npm test           # Primeiro: testes passam?
Verify: npm run bench:api # Depois: performance melhorou?
```

---

## 5. Log Estruturado

**Princípio:** Todo resultado deve ser registrado em formato estruturado (TSV).

### Por quê?

- Permite análise posterior
- Facilita visualização de progresso
- Habilita aprendizado de iterações
- Cria audit trail

### Formato TSV

```tsv
iteration	timestamp	value	change	changePercent	decision	filesModified	commitHash	notes
1	2026-03-29T10:00:00Z	72.5	0	0	keep	src/utils.ts	abc123	Initial optimization
2	2026-03-29T10:05:00Z	74.2	+1.7	+2.3%	keep	src/api.ts	def456	Added caching
3	2026-03-29T10:10:00Z	73.1	-1.1	-1.5%	discard	src/utils.ts	ghi789	Reverted: regression
```

---

## 6. Decisão Tricotômica

**Princípio:** Apenas 3 decisões possíveis: Keep, Discard, ou Crash.

### Por quê?

- Simplifica lógica
- Remove ambiguidade
- Facilita automação
- Previne decisões inconsistentes

### Decisões

| Decisão | Quando | Ação |
|---------|--------|------|
| **Keep** | Métrica melhorou | Manter commit, continuar |
| **Discard** | Métrica piorou | `git revert`, continuar |
| **Crash** | Verify falhou | `git reset --hard`, investigar |

---

## 7. Stop Conditions Claras

**Princípio:** Defina condições de parada explícitas antes de iniciar.

### Por quê?

- Previne loops infinitos
- Gerencia expectativas
- Otimiza uso de recursos
- Garante terminação

### Condições

```typescript
// Condições de parada
if (iteration >= maxIterations) stop()      // Máximo de iterações
if (elapsedTime >= maxTimeMinutes) stop()   // Tempo máximo
if (value >= target) stop()                 // Atingiu target
if (consecutiveFailures >= 5) stop()        // Muitas falhas
```

---

## Aplicação dos Princípios

### Exemplo de Fluxo Correto

```bash
# Setup
Goal: Increase coverage from 72% to 90%
Scope: src/**/*.ts
Metric: coverage % (higher is better)
Verify: npm test -- --coverage | grep "All files"
Guard: npm test
Iterations: 50

# Loop
FASE 0: Setup
  ✓ Baseline: 72.5%
  ✓ Target: 90%

FASE 1: Review
  ✓ Current: 72.5%
  ✓ Git log: 5 commits
  ✓ Results: 0 iterations

FASE 2: Choose
  ✓ Selected: Add test for utils.formatDate

FASE 3: Make
  ✓ Added: src/utils.test.ts (20 lines)

FASE 4: Commit
  ✓ Committed: abc123

FASE 5: Verify
  ✓ Guard: PASS
  ✓ Coverage: 74.2%

FASE 6: Decide
  ✓ Improved: +1.7% (+2.3%)
  ✓ Decision: KEEP

FASE 7: Log
  ✓ Logged: results.tsv

FASE 8: Repeat
  ✓ Continue: 74.2% < 90%
```

---

## Referências

- `SKILL.md` — Documentação principal
- `references/autonomous-loop-protocol.md` — Protocolo do loop
- `references/plan-workflow.md` — Wizard de configuração
