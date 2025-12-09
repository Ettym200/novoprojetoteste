# Análise da Página `/analytics`

Este documento detalha o que está sendo exibido na página `/analytics`, identificando o que vem da API, o que é calculado e o que está mockado/hardcoded.

## 📊 Dados que Vêm da API (`/metrics/engajamento`)

A API `/metrics/engajamento` retorna os seguintes dados reais:

### Facebook
- `impressoes` - Número de impressões
- `cliques` - Número de cliques
- `ctrUnico` - Taxa de cliques única
- `cpc` - Custo por clique
- `cpm` - Custo por mil impressões
- `frequencia` - Frequência de exibição
- `cliquesCadastro` - Cliques que resultaram em cadastro
- `cliquesFtd` - Cliques que resultaram em FTD

### WhatsApp
- `assinaturas` - Número de assinaturas
- `iniciaramConversa` - Número de usuários que iniciaram conversa
- `perdaAssinaturaWpp` - Perda de assinaturas no WhatsApp
- `percentualResponderam1Msg` - Percentual que respondeu a primeira mensagem
- `abandono` - Número de abandonos
- `cadastro` - Número de cadastros
- `conversaoWppCadastro` - Taxa de conversão WhatsApp → Cadastro
- `ftd` - Número de FTDs (First Time Deposits)
- `conversaoCadastroFtd` - Taxa de conversão Cadastro → FTD
- `conversaoWppFtd` - Taxa de conversão WhatsApp → FTD
- `custoPorDeposit` - Custo por depósito

### Vturb
- `playsUnicos` - Número de plays únicos
- `retencaoMedia` - Retenção média
- `cliquesUnicos` - Número de cliques únicos
- `percentualCliques` - Percentual de cliques

---

## 🧮 Dados Calculados (Baseados na API)

Estes dados são calculados no frontend usando os dados reais da API:

### 1. **Taxa de Churn Geral** ✅
- **Cálculo:** Média das taxas de churn de todos os afiliados
- **Fórmula:** `(abandono / cadastro) * 100` por afiliado, depois média
- **Localização:** Linha 110-112 de `analytics/page.tsx`
- **Status:** ✅ Real (calculado a partir de dados da API)

### 2. **Total Churned** ✅
- **Cálculo:** Soma de todos os `whatsapp.abandono` de todos os afiliados
- **Fórmula:** `Σ(whatsapp.abandono)` para todos os afiliados
- **Localização:** Linha 114 de `analytics/page.tsx`
- **Status:** ✅ Real (calculado a partir de dados da API)

### 3. **Retenção D30** ✅
- **Cálculo:** Média de `vturb.retencaoMedia` de todos os afiliados
- **Fórmula:** `média(vturb.retencaoMedia)` para todos os afiliados
- **Localização:** Linha 117-119 de `analytics/page.tsx`
- **Status:** ✅ Real (calculado a partir de dados da API)

### 4. **Churn por Etapa do Funil** ✅
- **Cálculo:** Taxa de churn calculada entre cada etapa do funil
- **Etapas:**
  - Facebook → Página: `(impressoes - cliques) / impressoes * 100`
  - Página → WhatsApp: `(cliques - assinaturas) / cliques * 100`
  - WhatsApp → Corretora: `(assinaturas - iniciaramConversa) / assinaturas * 100`
  - Corretora → Cadastro: `(iniciaramConversa - cadastro) / iniciaramConversa * 100`
  - Cadastro → FTD: `(cadastro - ftd) / cadastro * 100`
  - FTD → Redepósito: `abandono / ftd * 100`
- **Localização:** Linha 62-93 de `analytics/page.tsx`
- **Status:** ✅ Real (calculado a partir de dados da API)

### 5. **Churn por Afiliado** ✅
- **Cálculo:** Taxa de churn individual por afiliado
- **Fórmula:** `(whatsapp.abandono / whatsapp.cadastro) * 100` por afiliado
- **Localização:** Linha 96-107 de `analytics/page.tsx`
- **Status:** ✅ Real (calculado a partir de dados da API)

---

## ⚠️ Dados Mockados/Hardcoded (NÃO vêm da API)

Estes dados estão fixos no código e **NÃO** existem na API:

### 1. **Tempo Médio no Funil** ❌
- **Valor:** `'16.4 dias'` (hardcoded)
- **Localização:** Linha 123 de `analytics/page.tsx`
- **Comentário no código:** `// TODO: Calcular baseado em dados reais se disponível`
- **Status:** ❌ **MOCKADO** - Não existe na API

### 2. **Tempo por Etapa** ❌
Todos os valores de tempo médio e mediana estão hardcoded:

| Etapa | Tempo Médio | Mediana | Status |
|-------|-------------|---------|--------|
| Facebook → Página | `2.3 dias` | `1.8 dias` | ❌ Hardcoded |
| Página → WhatsApp | `1.5 dias` | `1.2 dias` | ❌ Hardcoded |
| WhatsApp → Corretora | `3.2 dias` | `2.5 dias` | ❌ Hardcoded |
| Corretora → Cadastro | `1.1 dias` | `0.8 dias` | ❌ Hardcoded |
| Cadastro → FTD | `2.8 dias` | `2.1 dias` | ❌ Hardcoded |
| FTD → Redepósito | `5.5 dias` | `4.2 dias` | ❌ Hardcoded |

- **Localização:** Linha 126-163 de `analytics/page.tsx`
- **Status:** ❌ **MOCKADO** - Não existe na API
- **Nota:** Apenas a coluna "Taxa de Abandono" é real (calculada a partir dos dados da API)

### 3. **Retenção por Cohort** ⚠️
- **D1:** ✅ Usa `vturb.retencaoMedia` (real da API)
- **D7:** ❌ Calculado como `retencaoMedia * 0.85` (multiplicador arbitrário)
- **D30:** ❌ Calculado como `retencaoMedia * 0.65` (multiplicador arbitrário)
- **Localização:** Linha 166-171 de `analytics/page.tsx`
- **Status:** ⚠️ **PARCIALMENTE MOCKADO** - D1 é real, D7 e D30 são estimativas arbitrárias

---

## 📋 Resumo por Seção da Página

### KPIs (Cards no Topo)
| KPI | Fonte | Status |
|-----|-------|--------|
| Tempo Médio no Funil | Hardcoded | ❌ Mockado |
| Taxa de Churn Geral | Calculado (API) | ✅ Real |
| Total Churned | Calculado (API) | ✅ Real |
| Retenção D30 | Calculado (API) | ✅ Real |

### Gráficos
| Gráfico | Fonte | Status |
|---------|-------|--------|
| Churn por Etapa do Funil | Calculado (API) | ✅ Real |
| Retenção por Cohort | Parcial (API + Mock) | ⚠️ Parcial |

### Tabelas
| Tabela | Fonte | Status |
|--------|-------|--------|
| Tempo Médio por Etapa | Hardcoded | ❌ Mockado |
| Churn por Afiliado | Calculado (API) | ✅ Real |

---

## 🔍 Localização dos Códigos

- **Página Analytics:** `src/app/(dashboard)/analytics/page.tsx`
- **Serviço de Analytics:** `src/lib/services/analyticsService.ts`
- **Tipos da API:** `src/types/metrics.ts` (interface `MetricsEngajamentoResponse`)

---

## ✅ Recomendações

1. **Remover ou Ocultar:**
   - Seção "Tempo Médio no Funil" (KPI card)
   - Tabela "Tempo Médio por Etapa" (todos os valores são mockados)

2. **Ajustar:**
   - Gráfico "Retenção por Cohort": Usar apenas D1 (real) ou remover D7/D30 se não houver dados reais na API

3. **Manter:**
   - Todos os cálculos de churn (são baseados em dados reais)
   - Retenção D30 (usa `retencaoMedia` da API)
   - Churn por Afiliado (calculado a partir de dados reais)

---

## 📝 Notas Técnicas

- A API `/metrics/engajamento` **NÃO** retorna dados de tempo médio
- A API **NÃO** retorna dados de retenção por cohort (D7, D30)
- Todos os cálculos de churn são feitos no frontend usando os dados agregados da API
- Os dados são filtrados por `affiliateId` e `dateRange` (startDate, endDate)

