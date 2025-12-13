# Análise da Página `/dashboard`

Este documento detalha o que está sendo exibido na página `/dashboard`, identificando o que vem da API, o que é calculado e o que está mockado/hardcoded.

## 📊 Dados que Vêm da API (`/metrics/gerais`)

A API `/metrics/gerais` retorna os seguintes dados reais:

### Métricas Financeiras
- `totalInvestidoAtual` - Total investido no período atual
- `totalValorFTDsAtual` - Valor total de FTDs (First Time Deposits)
- `totalValorDepositosAtual` - Valor total de depósitos
- `totalValorSaquesAtual` - Valor total de saques
- `ggrAtual` - Gross Gaming Revenue (Receita Bruta de Jogos)
- `ngrAtual` - Net Gaming Revenue (Receita Líquida de Jogos)
- `lucroLiquidoAtual` - Lucro líquido
- `roiFTDAtual` - ROI de FTD (pode ser null)

### Métricas de Custos
- `custoCadastroAtual` - Custo por cadastro
- `custoDepositoAtual` - Custo por depósito
- `custoFTDAtual` - Custo por FTD
- `custoLeadWhatsappAtual` - Custo por lead do WhatsApp (pode ser null)

### Métricas de Volume
- `totalCadastrosAtual` - Total de cadastros
- `totalFTDsAtual` - Total de FTDs (quantidade)
- `totalDepositosAtual` - Total de depósitos (quantidade)
- `totalClientesAtual` - Total de clientes

---

## 🧮 Dados Calculados (Baseados na API)

Estes dados são calculados no frontend usando os dados reais da API:

### 1. **KPIs do Dashboard** ✅
Todos os KPIs são calculados agregando dados de todos os afiliados:

- **Total Investido:** `Σ(totalInvestidoAtual)` de todos os afiliados
- **Total de FTD:** `Σ(totalValorFTDsAtual)` de todos os afiliados
- **Total de Depósitos:** `Σ(totalValorDepositosAtual)` de todos os afiliados
- **Total de Saques:** `Σ(totalValorSaquesAtual)` de todos os afiliados
- **GGR:** `Σ(ggrAtual)` de todos os afiliados
- **NGR:** `Σ(ngrAtual)` de todos os afiliados
- **Lucro Líquido:** `Σ(lucroLiquidoAtual)` de todos os afiliados
- **ROI de FTD:** Média ponderada ou média simples dos `roiFTDAtual` individuais
- **Custo por Cadastro:** Média ponderada dos `custoCadastroAtual`
- **Custo por Depósito:** Média ponderada dos `custoDepositoAtual`
- **Custo por FTD:** Média ponderada dos `custoFTDAtual`
- **Custo por Lead WhatsApp:** Média simples dos `custoLeadWhatsappAtual` (quando disponível)

**Localização:** `src/lib/services/dashboardService.ts` (linhas 96-252)
**Status:** ✅ Real (calculado a partir de dados da API)

### 2. **Estágios do Funil** ⚠️
O funil é calculado usando dados reais, mas com algumas **estimativas**:

| Etapa | Fonte | Status |
|-------|-------|--------|
| Facebook | `totalCadastros * 10` (estimativa) | ⚠️ Estimado |
| Página | `totalCadastros * 3` (estimativa) | ⚠️ Estimado |
| WhatsApp | `totalClientesAtual` (real da API) | ✅ Real |
| Corretora | `totalCadastros * 1.5` (estimativa) | ⚠️ Estimado |
| Cadastro | `totalCadastrosAtual` (real da API) | ✅ Real |
| FTD | `totalFTDsAtual` (real da API) | ✅ Real |
| Redepósito | `totalDepositos - totalFTDs` (calculado) | ✅ Real |

**Localização:** `src/lib/services/dashboardService.ts` (linhas 305-348)
**Status:** ⚠️ **PARCIALMENTE ESTIMADO** - As etapas iniciais (Facebook, Página, Corretora) são estimadas porque a API `/metrics/gerais` não retorna dados de impressões/cliques do Facebook. Para dados reais dessas etapas, seria necessário usar `/metrics/engajamento`.

**Nota:** Os comentários no código indicam:
```typescript
// Nota: A API não retorna dados de impressões/cliques do Facebook diretamente em /metrics/gerais
// Para isso, precisaríamos de /metrics/engajamento, mas por enquanto usamos estimativas
```

### 3. **Insights Automáticos** ✅
Os insights são gerados baseados em cálculos dos dados reais:

- **ROI Negativo/Excelente:** Baseado no `avgROI` calculado
- **Top Performer:** Afiliado com maior `lucroLiquidoAtual`
- **Afiliados com ROI Negativo:** Contagem de afiliados com `roiFTDAtual < 0`

**Localização:** `src/lib/services/dashboardService.ts` (linhas 430-549)
**Status:** ✅ Real (calculado a partir de dados da API)

---

## ⚠️ Dados Mockados/Hardcoded (NÃO vêm da API)

Estes dados estão fixos no código e **NÃO** existem na API:

### 1. **Valores de "Change" (Variação Percentual)** ❌
Todos os valores de variação percentual nos cards de KPI estão **hardcoded**:

| KPI | Valor de Change | Localização | Status |
|-----|----------------|-------------|--------|
| Total Investido | `-56.48` | Linha 119 | ❌ Hardcoded |
| Total de FTD | `-81.84` | Linha 127 | ❌ Hardcoded |
| Total de Depósitos | `-82.89` | Linha 135 | ❌ Hardcoded |
| Total de Saques | `-97.19` | Linha 143 | ❌ Hardcoded |
| GGR | `256.82` | Linha 156 | ❌ Hardcoded |
| NGR | `-199.57` | Linha 164 | ❌ Hardcoded |
| Lucro Líquido | `-103.70` | Linha 172 | ❌ Hardcoded |
| ROI de FTD | `-99.09` | Linha 180 | ❌ Hardcoded |
| Custo por Lead WhatsApp | `-30.62` | Linha 194 | ❌ Hardcoded |
| Custo por Cadastro | `-23.53` | Linha 202 | ❌ Hardcoded |
| Custo por Depósito | `-3.97` | Linha 210 | ❌ Hardcoded |
| Custo por FTD | `-26.83` | Linha 218 | ❌ Hardcoded |

**Localização:** `src/app/(dashboard)/dashboard/page.tsx` (linhas 119, 127, 135, 143, 156, 164, 172, 180, 194, 202, 210, 218)
**Status:** ❌ **MOCKADO** - A API retorna `totalInvestidoAnterior`, `ggrAnterior`, etc., mas esses valores não estão sendo usados para calcular a variação percentual.

**Solução:** Calcular a variação usando os valores `Atual` e `Anterior` da API:
```typescript
change = ((valorAtual - valorAnterior) / valorAnterior) * 100
```

### 2. **Gráfico de Receitas e Saques** ❌
O gráfico "Receitas e Saques" está **vazio** porque não há endpoint específico para dados temporais.

**Localização:** `src/lib/services/dashboardService.ts` (linhas 368-424)
**Status:** ❌ **VAZIO** - A função `useRevenueData()` retorna um array vazio.

**Comentário no código:**
```typescript
// TODO: Quando houver endpoint com dados temporais (por dia/semana/mês), usar ele
// Por enquanto, retornar vazio pois não temos dados temporais
// A API /metrics/gerais retorna apenas totais, não dados por período
```

**Nota:** A API `/metrics/gerais` retorna apenas totais agregados, não dados por período (dia/semana/mês). Para exibir um gráfico temporal, seria necessário um endpoint que retorne dados históricos.

---

## 📋 Resumo por Seção da Página

### KPIs (Cards no Topo)
| KPI | Valor | Change | Status |
|-----|-------|--------|--------|
| Total Investido | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Total de FTD | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Total de Depósitos | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Total de Saques | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| GGR | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| NGR | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Lucro Líquido | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| ROI de FTD | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Custo por Lead WhatsApp | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Custo por Cadastro | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Custo por Depósito | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |
| Custo por FTD | ✅ Real (API) | ❌ Mockado | ⚠️ Parcial |

### Gráficos
| Gráfico | Fonte | Status |
|---------|-------|--------|
| Funil de Conversão (Sankey) | Parcial (API + Estimativas) | ⚠️ Parcial |
| Receitas e Saques | Vazio | ❌ Não implementado |

### Insights
| Insight | Fonte | Status |
|---------|-------|--------|
| ROI Negativo/Excelente | Calculado (API) | ✅ Real |
| Top Performer | Calculado (API) | ✅ Real |
| Afiliados com ROI Negativo | Calculado (API) | ✅ Real |

---

## 🔍 Localização dos Códigos

- **Página Dashboard:** `src/app/(dashboard)/dashboard/page.tsx`
- **Serviço de Dashboard:** `src/lib/services/dashboardService.ts`
- **Tipos da API:** `src/types/metrics.ts` (interface `MetricsGeraisResponse`)

---

## ✅ Recomendações

### 1. **Calcular Variação Percentual Real** 🔴 Alta Prioridade
   - Usar valores `Anterior` da API para calcular a variação percentual
   - Substituir todos os valores hardcoded de `change` por cálculos reais
   - Fórmula: `change = ((valorAtual - valorAnterior) / valorAnterior) * 100`

### 2. **Melhorar Funil de Conversão** 🟡 Média Prioridade
   - Integrar com `/metrics/engajamento` para obter dados reais de:
     - Impressões do Facebook (`facebook.impressoes`)
     - Cliques do Facebook (`facebook.cliques`)
     - Assinaturas WhatsApp (`whatsapp.assinaturas`)
   - Remover estimativas e usar dados reais

### 3. **Implementar Gráfico de Receitas e Saques** 🟡 Média Prioridade
   - Verificar se existe endpoint com dados temporais (por dia/semana/mês)
   - Se não existir, solicitar ao backend
   - Se existir, integrar e exibir o gráfico

### 4. **Manter:**
   - Todos os cálculos de KPIs (são baseados em dados reais)
   - Insights automáticos (são calculados a partir de dados reais)
   - Filtros de data (já implementados e funcionando)

---

## 📝 Notas Técnicas

- A API `/metrics/gerais` retorna dados `Atual` e `Anterior` para comparação, mas apenas os valores `Atual` estão sendo usados
- A API **NÃO** retorna dados temporais (por dia/semana/mês) - apenas totais agregados
- Para dados detalhados do funil (Facebook, WhatsApp), é necessário usar `/metrics/engajamento`
- Os dados são filtrados por `affiliateId` e `dateRange` (startDate, endDate)
- Todos os cálculos são feitos no frontend agregando dados de múltiplos afiliados

---

## 🔄 Comparação com `/analytics`

| Aspecto | `/dashboard` | `/analytics` |
|---------|--------------|--------------|
| Dados da API | ✅ `/metrics/gerais` | ✅ `/metrics/engajamento` |
| Valores Mockados | ⚠️ Variação percentual | ⚠️ Tempo médio no funil |
| Gráficos Vazios | ⚠️ Receitas e Saques | ❌ Nenhum |
| Cálculos Reais | ✅ KPIs, Insights | ✅ Churn, Retenção |
| Estimativas | ⚠️ Funil (início) | ⚠️ Retenção D7/D30 |

