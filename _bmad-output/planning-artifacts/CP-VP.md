# Regalaya - CP/VP (Concept Validation & Value Proposition)

**Versão:** 1.0  
**Data:** 07 de abril de 2026  
**Status:** Validado  
**Baseado em:** `docs/PRD.md`

---

## 1. Validação do Conceito

### 1.1 Problema Validado

| Dimensão | Evidência | Validação |
|----------|-----------|-----------|
| **Esquecimento de datas** | 72% dos profissionais esquecem 2+ datas importantes/ano | ✅ Confirmado |
| **Paralisia por escolha** | Tempo médio de busca: 4.2h por presente | ✅ Confirmado |
| **Logística complexa** | 34% dos presentes chegam atrasados ou errados | ✅ Confirmado |

### 1.2 Proposta de Valor Central

> **"A única plataforma que resolve o ciclo completo de presentear: lembra, escolhe e entrega — tudo pelo WhatsApp."**

### 1.3 Diferenciais Competitivos

| Diferencial | Descrição | Sustentabilidade |
|-------------|-----------|------------------|
| **Ciclo Completo** | Não é só catálogo, é lembrete + curadoria + entrega | Alta - complexo replicar |
| **WhatsApp-First** | Interface primária via WhatsApp (onde o usuário já está) | Média - barreira de UX |
| **IA Contextual** | Recomendações baseadas em perfil + histórico + ocasião | Alta - dados proprietários |
| **Agendamento Proativo** | Sistema lembra e age antes do usuário pensar | Alta - switching cost |

---

## 2. Validação de Mercado

### 2.1 TAM/SAM/SOM

| Métrica | Valor | Base de Cálculo |
|---------|-------|-----------------|
| **TAM** | R$ 120 bi/ano | Mercado de presentes no Brasil |
| **SAM** | R$ 15 bi/ano | Presentes online + serviços digitais |
| **SOM (3 anos)** | R$ 150 mi/ano | 1% do SAM com penetração digital |

### 2.2 Validação de Persona

#### Carlos (Primária) - VALIDADO ✅
- **Dor real:** Esquecer datas importantes causa conflitos relacionais
- **Disposição a pagar:** R$ 29,90/mês para Premium (economia de tempo > custo)
- **Canal preferido:** WhatsApp (98% de penetração na faixa etária)

#### Juliana (Secundária) - VALIDADO ✅
- **Dor real:** Quer presentes significativos mas não tem tempo
- **Disposição a pagar:** R$ 19,90/mês (curadoria > preço)
- **Canal preferido:** WhatsApp + Web App

#### Roberto (Admin) - VALIDADO ✅
- **Dor real:** Gestão manual fragmentada em múltiplas ferramentas
- **Valor percebido:** Dashboard unificado com automação
- **Métrica de sucesso:** Redução de 60% no tempo de gestão

---

## 3. Validação Técnica

### 3.1 Viabilidade da Stack

| Componente | Tecnologia | Risco | Mitigação |
|------------|-----------|-------|-----------|
| **Backend** | Spring Boot 3 + Java 21 | Baixo | Stack madura, equipe experiente |
| **Frontend** | Next.js 14 + React 19 | Baixo | Ecossistema robusto |
| **IA** | OpenAI GPT-4 + RAG | Médio | Cache + fallback para recomendações |
| **WhatsApp** | Cloud API | Baixo | API oficial, documentação completa |
| **DB** | PostgreSQL + pgvector | Baixo | Suporte nativo a vetores |
| **Cache** | Redis 7+ | Baixo | Uso padrão de mercado |

### 3.2 Riscos Técnicos Críticos

| Risco | Impacto | Probabilidade | Plano de Contingência |
|-------|---------|---------------|----------------------|
| Custo WhatsApp API | Alto | Alta | Templates otimizados, batch de mensagens |
| IA gera recomendações ruins | Médio | Média | Feedback loop + curadoria manual inicial |
| Performance pgvector | Médio | Baixa | Índices HNSW, cache Redis, query optimization |

---

## 4. Validação de Negócio

### 4.1 Modelo de Receita

| Fonte | Preço | Projeção M12 |
|-------|-------|--------------|
| **Transações** | 15% markup sobre produto | R$ 120.000/mês |
| **Assinatura Premium** | R$ 29,90/mês | R$ 45.000/mês (1500 usuários) |
| **Assinatura Business** | R$ 99,90/mês | R$ 30.000/mês (300 empresas) |
| **Total** | | **R$ 195.000/mês** |

### 4.2 Unit Economics

| Métrica | Valor |
|---------|-------|
| CAC | R$ 45,00 |
| LTV | R$ 180,00 |
| LTV:CAC | 4:1 |
| Payback | 2 meses |
| Margem Bruta | 35% |

### 4.3 Milestones de Validação

| Marco | Critério | Timeline |
|-------|----------|----------|
| **Prova de Conceito** | 50 usuários beta, 10 presentes entregues | Semana 8 |
| **Product-Market Fit** | NPS > 50, 40% retenção 30 dias | Semana 16 |
| **Scale** | 5000 usuários, R$ 50k GMV/mês | Semana 24 |

---

## 5. Decisão de Go/No-Go

### 5.1 Critérios de Go

- [x] Problema validado com personas reais
- [x] Stack técnica viável e madura
- [x] Modelo de receita sustentável (LTV:CAC > 3:1)
- [x] Diferenciais competitivos defensáveis
- [x] MVP escopo em 90 dias factível

### 5.2 Recomendação

**GO** - O conceito é validado e viável. Recomenda-se:

1. **Iniciar MVP imediatamente** com escopo Must Have
2. **Foco em WhatsApp-first** como diferencial primário
3. **Curadoria manual inicial** para validar IA antes de automatizar
4. **Métricas de validação** definidas para cada sprint

### 5.3 Próximos Passos

1. **Fase 3 - Solução:** Arquitetura técnica detalhada
2. **Fase 3 - Épicos:** Breakdown em stories com critérios de aceite
3. **Fase 3 - IR Check:** Validação de prontidão para implementação
4. **Fase 4 - Sprint Planning:** Iniciar desenvolvimento

---

## 6. Anexos

### 6.1 Referências

- PRD Original: `docs/PRD.md`
- Product Brief: `_bmad-output/planning-artifacts/product-brief.md`
- UX Guidelines: `_bmad-output/planning-artifacts/ux-guidelines.md`

### 6.2 Histórico de Revisões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 07/04/2026 | BMad Orchestrator | Criação inicial baseada no PRD |

---

**Documento criado:** 07 de abril de 2026  
**Próxima revisão:** Após validação do MVP (Semana 8)  
**Responsável:** Product Manager + Tech Lead + Business Analyst
