# 📊 Arquivos Maiores do Projeto

## Top 35 Arquivos por Número de Linhas

| # | Arquivo | Linhas | Categoria | Observações |
|---|---------|--------|-----------|-------------|
| 1 | `src/app/campaigns/page.tsx` | **348** | Page | ✅ **Reduzido** (era 510) - Mock data movido |
| 2 | `src/app/affiliates/page.tsx` | **336** | Page | ✅ **Reduzido** (era 535) - Mock data movido |
| 3 | `src/components/ui/chart.tsx` | **329** | UI Component | Componente shadcn/ui (gerado) |
| 4 | `src/app/settings/page.tsx` | **288** | Page | Tamanho razoável |
| 5 | `src/components/dashboard/PlayerDetailModal.tsx` | **247** | Component | Tamanho razoável |
| 6 | `src/components/ui/sidebar-menu.tsx` | **240** | UI Component | ✅ **Refatorado** - Extraído de `sidebar.tsx` |
| 7 | `src/components/ui/menubar.tsx` | **237** | UI Component | Componente shadcn/ui (gerado) |
| 8 | `src/__mocks__/affiliateMetrics.ts` | **232** | Mock Data | ✅ Mock data extraído de `affiliates/page.tsx` |
| 9 | `src/components/dashboard/AffiliateDetailModal.tsx` | **232** | Component | Tamanho razoável |
| 10 | `src/components/ui/carousel.tsx` | **231** | UI Component | Componente shadcn/ui (gerado) |
| 11 | `src/app/page.tsx` | **221** | Page | Tamanho razoável |
| 12 | `src/components/dashboard/AffiliateTable.tsx` | **210** | Component | ✅ Otimizado com hooks |
| 13 | `src/components/dashboard/PlayerTable.tsx` | **206** | Component | Tamanho razoável |
| 14 | `src/components/dashboard/CampaignTable.tsx` | **200** | Component | ✅ Otimizado com hooks e constantes |
| 15 | `src/__mocks__/campaigns.ts` | **194** | Mock Data | ✅ Mock data extraído de `campaigns/page.tsx` |
| 16 | `src/app/analytics/page.tsx` | **190** | Page | Tamanho razoável |
| 17 | `src/app/players/page.tsx` | **190** | Page | Tamanho razoável |
| 18 | `src/components/ui/dropdown-menu.tsx` | **181** | UI Component | Componente shadcn/ui (gerado) |
| 19 | `src/components/ui/context-menu.tsx` | **181** | UI Component | Componente shadcn/ui (gerado) |
| 20 | `src/components/dashboard/AffiliateMetricsTable.tsx` | **175** | Component | ✅ Otimizado com hooks e useMemo |
| 21 | `src/components/layout/AppSidebar.tsx` | **173** | Layout | Tamanho razoável |
| 22 | `src/hooks/use-toast.ts` | **162** | Hook | Hook shadcn/ui (gerado) |
| 23 | `src/components/ui/form.tsx` | **153** | UI Component | Componente shadcn/ui (gerado) |
| 24 | `src/components/ui/select.tsx` | **146** | UI Component | Componente shadcn/ui (gerado) |
| 25 | `src/components/ui/sidebar.tsx` | **140** | UI Component | ✅ **Refatorado** (era 673) - Dividido em 5 arquivos |
| 26 | `src/components/ui/command.tsx` | **135** | UI Component | Componente shadcn/ui (gerado) |
| 27 | `src/components/ui/sidebar-parts.tsx` | **127** | UI Component | ✅ **Refatorado** - Extraído de `sidebar.tsx` |
| 28 | `src/components/ui/alert-dialog.tsx` | **126** | UI Component | Componente shadcn/ui (gerado) |
| 29 | `src/components/ui/sheet.tsx` | **125** | UI Component | Componente shadcn/ui (gerado) |
| 30 | `src/components/dashboard/DateRangeSelector.tsx` | **123** | Component | Tamanho razoável |
| 31 | `src/components/ui/navigation-menu.tsx` | **117** | UI Component | Componente shadcn/ui (gerado) |
| 32 | `src/components/layout/DashboardHeader.tsx` | **117** | Layout | Tamanho razoável |
| 33 | `src/components/ui/toast.tsx` | **115** | UI Component | Componente shadcn/ui (gerado) |
| 34 | `src/components/dashboard/MetricChart.tsx` | **115** | Component | Tamanho razoável |
| 35 | `src/components/ui/dialog.tsx` | **109** | UI Component | Componente shadcn/ui (gerado) |

**Nota**: `sidebar-context.tsx` (106 linhas) e `sidebar-group.tsx` (66 linhas) também foram criados na refatoração.

---

## 📈 Análise por Categoria

### ✅ Arquivos Refatorados Recentemente

#### 1. `src/components/ui/sidebar.tsx` - **140 linhas** (era 673)
**Status**: ✅ **MELHORADO** - Redução de **533 linhas** (79%)

**Melhorias Aplicadas**:
- ✅ Dividido em 5 arquivos organizados:
  - `sidebar.tsx` (140 linhas) - Componente principal
  - `sidebar-context.tsx` (106 linhas) - Provider e Context
  - `sidebar-menu.tsx` (240 linhas) - Componentes de menu
  - `sidebar-parts.tsx` (127 linhas) - Componentes auxiliares
  - `sidebar-group.tsx` (66 linhas) - Componentes de grupo
- ✅ Separação clara de responsabilidades
- ✅ Melhor manutenibilidade e legibilidade
- ✅ Todas as exportações mantidas (compatibilidade 100%)

**Resultado**: Código muito mais organizado e fácil de manter

#### 2. `src/app/affiliates/page.tsx` - **336 linhas** (era 535)
**Status**: ✅ **MELHORADO** - Redução de **199 linhas** (37%)

**Melhorias Aplicadas**:
- ✅ Mock data movido para `src/__mocks__/affiliateMetrics.ts` (232 linhas)
- ✅ Usa hook `useAffiliateMetrics` do `affiliateService.ts`
- ✅ Cálculos memoizados com `useMemo`
- ✅ Estados de loading/error implementados
- ✅ Formatação centralizada (`formatCurrency`)
- ✅ Funções de métricas centralizadas (`calculateROI`, `calculateMargin`, `calculateConversionRate`)

**Resultado**: Arquivo mais limpo e fácil de manter

#### 3. `src/app/campaigns/page.tsx` - **348 linhas** (era 510)
**Status**: ✅ **MELHORADO** - Redução de **162 linhas** (32%)

**Melhorias Aplicadas**:
- ✅ Mock data movido para `src/__mocks__/campaigns.ts` (194 linhas)
- ✅ Criado `campaignService.ts` com hooks React Query
- ✅ Cálculos memoizados com `useMemo`
- ✅ Estados de loading/error implementados
- ✅ Constantes de status centralizadas (`CAMPAIGN_STATUS_COLORS`, `CAMPAIGN_STATUS_LABELS`)
- ✅ Formatação centralizada
- ✅ Validação de divisão por zero com `safeDivide`

**Resultado**: Arquivo mais organizado e preparado para backend

### 🟡 Arquivos de Componentes UI (Gerados - OK)

Arquivos em `src/components/ui/` são componentes do shadcn/ui gerados automaticamente:
- `chart.tsx` (329 linhas) - Wrapper do Recharts
- `sidebar-menu.tsx` (240 linhas) - Componentes de menu (refatorado)
- Outros componentes UI (109-237 linhas)

**Status**: ✅ Componentes gerados não precisam refatoração, mas o sidebar foi refatorado para melhor organização

### 🟢 Arquivos de Tamanho Razoável

Arquivos entre 100-250 linhas estão em tamanho aceitável:
- Componentes de dashboard (115-247 linhas)
- Páginas menores (190-221 linhas)
- Layouts e hooks (117-173 linhas)
- Mock data em `__mocks__/` (194-232 linhas)
- Componentes sidebar refatorados (66-240 linhas)

**Status**: ✅ Tamanho adequado

### 📦 Arquivos de Mock Data

Novos arquivos criados para organizar mock data:
- `src/__mocks__/affiliateMetrics.ts` (232 linhas) - Métricas de afiliados
- `src/__mocks__/campaigns.ts` (194 linhas) - Dados de campanhas

**Status**: ✅ Organizados e prontos para substituição por API

### 🔧 Arquivos Sidebar Refatorados

Arquivos criados na refatoração do sidebar:
- `src/components/ui/sidebar.tsx` (140 linhas) - Componente principal
- `src/components/ui/sidebar-context.tsx` (106 linhas) - Provider e Context
- `src/components/ui/sidebar-menu.tsx` (240 linhas) - Componentes de menu
- `src/components/ui/sidebar-parts.tsx` (127 linhas) - Componentes auxiliares
- `src/components/ui/sidebar-group.tsx` (66 linhas) - Componentes de grupo

**Status**: ✅ Organizados e mantendo compatibilidade total

---

## 🎯 Recomendações Prioritárias

### ✅ Prioridade 1: CONCLUÍDA
1. ✅ **`affiliates/page.tsx`** - Refatorado
   - Mock data extraído → `__mocks__/affiliateMetrics.ts`
   - Hook `useAffiliateMetrics` implementado
   - Cálculos memoizados

2. ✅ **`campaigns/page.tsx`** - Refatorado
   - Mock data extraído → `__mocks__/campaigns.ts`
   - `campaignService.ts` criado
   - Cálculos memoizados

3. ✅ **`sidebar.tsx`** - Refatorado
   - Dividido em 5 arquivos organizados
   - Redução de 673 para 140 linhas no arquivo principal
   - Melhor separação de responsabilidades

### 🟡 Prioridade 2: Melhorias Opcionais
- Considerar extrair modais grandes para componentes separados
- Adicionar mais testes unitários
- Documentar hooks de serviço

### ✅ Prioridade 3: Manter Componentes UI
- Componentes shadcn/ui não precisam alteração
- São gerados automaticamente
- Sidebar foi refatorado para melhor organização

---

## 📊 Estatísticas Gerais

### Antes vs Depois da Refatoração

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **affiliates/page.tsx** | 535 linhas | 336 linhas | -199 linhas (-37%) |
| **campaigns/page.tsx** | 510 linhas | 348 linhas | -162 linhas (-32%) |
| **sidebar.tsx** | 673 linhas | 140 linhas | -533 linhas (-79%) |
| **Total reduzido** | 1718 linhas | 824 linhas | **-894 linhas (-52%)** |

### Distribuição Atual

- **Arquivos > 500 linhas**: 0 ✅ (todos refatorados!)
- **Arquivos 300-500 linhas**: 3 (2 páginas refatoradas + 1 UI)
- **Arquivos 200-300 linhas**: 8 (tamanho razoável)
- **Arquivos < 200 linhas**: 24+ (tamanho adequado)

### Arquivos por Categoria

- **Páginas (`src/app/`)**: 8 arquivos (190-348 linhas)
- **Componentes Dashboard**: 8 arquivos (115-247 linhas)
- **Componentes UI**: 52 arquivos (3-329 linhas, maioria gerada)
  - **Sidebar refatorado**: 5 arquivos (66-240 linhas)
- **Mock Data**: 2 arquivos (194-232 linhas)
- **Layouts**: 2 arquivos (117-173 linhas)
- **Hooks**: 1 arquivo (162 linhas)

---

## 💡 Regra de Ouro

**Arquivos de código customizado devem ter:**
- **< 300 linhas**: ✅ Ideal
- **300-500 linhas**: ✅ Aceitável (após refatoração)
- **> 500 linhas**: ⚠️ **Precisa refatoração urgente**

**Componentes UI gerados podem ter mais linhas** pois são gerados automaticamente e não precisam manutenção manual. No entanto, o sidebar foi refatorado para melhor organização mesmo sendo gerado.

---

## 🎉 Melhorias Implementadas

### Refatoração de Arquivos Grandes
- ✅ **Mock Data Extraído**: ~426 linhas movidas para `__mocks__/`
- ✅ **Hooks Implementados**: `useAffiliateMetrics`, `useCampaigns`, `useCampaignTrends`
- ✅ **Cálculos Otimizados**: `useMemo` aplicado em cálculos pesados
- ✅ **Formatação Centralizada**: Funções utilitárias em `lib/utils/format.ts`
- ✅ **Validação de Segurança**: `safeDivide` para evitar divisão por zero
- ✅ **Constantes Centralizadas**: Status colors e labels em `lib/constants/`
- ✅ **Sidebar Refatorado**: Dividido em 5 arquivos organizados (redução de 79%)

### Redução Total de Código
- **-894 linhas** removidas dos arquivos principais
- **+426 linhas** organizadas em arquivos de mock
- **+679 linhas** organizadas em arquivos sidebar (mas muito mais organizadas)
- **Resultado**: Código mais limpo, organizado e manutenível

### Conquistas
- ✅ **Nenhum arquivo > 500 linhas** (todos refatorados!)
- ✅ **Arquivo principal do sidebar reduzido em 79%**
- ✅ **Melhor separação de responsabilidades**
- ✅ **100% de compatibilidade mantida**

---

**Última Atualização**: 2025-01-XX
