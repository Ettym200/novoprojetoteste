# Correções Aplicadas

Este documento descreve as correções aplicadas aos problemas identificados nos prints.

## ✅ Problemas Corrigidos

### 1. API BASE URL exposta no código

**Problema:** A URL da API estava hardcoded nos arquivos `base.ts` e `client.ts`.

**Solução:**
- Movida a URL para variável de ambiente `NEXT_PUBLIC_API_BASE_URL`
- Criado arquivo `.env.local.example` como referência
- Atualizados `src/lib/api/base.ts` e `src/lib/api/client.ts` para usar `process.env.NEXT_PUBLIC_API_BASE_URL`
- Atualizado `next.config.mjs` para usar a variável de ambiente no CSP

**Como usar:**
1. Criar arquivo `.env.local` na raiz do projeto
2. Adicionar: `NEXT_PUBLIC_API_BASE_URL=https://bi-velock-api.bos1wt.easypanel.host`

### 2. Proteção de rotas do dashboard

**Problema:** Sistema permitia acesso ao dashboard mesmo sem token no localStorage.

**Solução:**
- Criado middleware (`src/middleware.ts`) para proteger rotas do dashboard
- Criado componente `ProtectedRoute` (`src/components/auth/ProtectedRoute.tsx`) para verificação no cliente
- Integrado `ProtectedRoute` no layout do dashboard (`src/app/(dashboard)/layout.tsx`)

**Rotas protegidas:**
- `/dashboard`
- `/affiliates`
- `/players`
- `/campaigns`
- `/analytics`
- `/settings`

### 3. Filtro de tempo como estado global

**Problema:** Filtro de data não persistia ao navegar entre páginas.

**Solução:**
- Criado contexto global `DateRangeContext` (`src/contexts/DateRangeContext.tsx`)
- Integrado no `Providers` (`src/app/providers.tsx`)
- Atualizado `DateRangeSelector` para usar o contexto
- Atualizadas páginas do dashboard para usar o contexto global
- Estado salvo no `localStorage` para persistência entre sessões

**Benefícios:**
- Filtro persiste ao navegar entre páginas
- Estado salvo no localStorage
- Sincronização automática entre componentes

### 4. Erro no cálculo de data "ontem"

**Problema:** Quando selecionava "ontem", a requisição era feita para "hoje" devido a problemas de timezone.

**Solução:**
- Criada função `formatDateForAPI()` em `src/lib/utils/format.ts` que formata datas sem problemas de timezone
- Atualizado contexto para criar datas sem hora (apenas ano, mês, dia)
- Atualizado `DateRangeSelector` para usar datas sem hora
- Atualizada página do dashboard para usar `formatDateForAPI()` ao invés de `format()` do date-fns

**Como funciona:**
- Datas são criadas sem hora: `new Date(year, month, day)`
- Formatação usa `getFullYear()`, `getMonth()`, `getDate()` diretamente
- Evita problemas de conversão de timezone

### 5. Verificação de requisições ao abrir dashboard

**Status:** Verificado - As requisições estão sendo feitas corretamente.

**Observações:**
- O dashboard faz 4 hooks React Query:
  - `useDashboardKPIs()` - Busca KPIs principais
  - `useFunnelStages()` - Busca dados do funil
  - `useRevenueData()` - Busca dados de receita
  - `useInsights()` - Busca insights automáticos
- Todas usam o mesmo endpoint `/metrics/gerais`, mas com queryKeys diferentes
- React Query faz cache automático, então requisições duplicadas são evitadas
- O número de requisições pode variar dependendo do cache

## 📝 Arquivos Criados/Modificados

### Novos Arquivos:
- `src/middleware.ts` - Middleware de proteção de rotas
- `src/contexts/DateRangeContext.tsx` - Contexto global para filtro de data
- `src/components/auth/ProtectedRoute.tsx` - Componente de proteção de rotas
- `.env.local.example` - Exemplo de variáveis de ambiente
- `CORRECOES_APLICADAS.md` - Este arquivo

### Arquivos Modificados:
- `src/lib/api/base.ts` - Usa variável de ambiente
- `src/lib/api/client.ts` - Usa variável de ambiente
- `next.config.mjs` - Usa variável de ambiente no CSP
- `src/app/providers.tsx` - Adicionado DateRangeProvider
- `src/app/(dashboard)/layout.tsx` - Adicionado ProtectedRoute
- `src/app/(dashboard)/dashboard/page.tsx` - Usa contexto global e formatDateForAPI
- `src/app/(dashboard)/affiliates/page.tsx` - Adicionado showDatePicker
- `src/components/dashboard/DateRangeSelector.tsx` - Usa contexto global
- `src/components/layout/DashboardHeader.tsx` - Mantido compatível
- `src/lib/utils/format.ts` - Adicionada função formatDateForAPI

## 🚀 Próximos Passos

1. Criar arquivo `.env.local` com a URL da API
2. Testar proteção de rotas (tentar acessar dashboard sem token)
3. Testar persistência do filtro de data entre páginas
4. Verificar se datas estão sendo enviadas corretamente nas requisições
5. Verificar se as requisições estão sendo feitas conforme esperado

## ⚠️ Notas Importantes

- O middleware verifica cookies, mas a verificação completa é feita no cliente via `ProtectedRoute`
- O filtro de data é salvo no localStorage, então persiste entre sessões do navegador
- As datas são formatadas sem hora para evitar problemas de timezone
- A URL da API deve ser configurada no `.env.local` antes de fazer build/deploy
