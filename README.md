# Veloc Broker Dashboard - Next.js

Dashboard de métricas e análises desenvolvido com Next.js 14, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes UI)
- **React Query** (@tanstack/react-query)
- **Recharts** (gráficos)
- **Lucide React** (ícones)
- **date-fns** (manipulação de datas)
- **Zod** (validação de schemas)

## ✅ Melhorias Aplicadas

### Estrutura Organizada
- ✅ Tipos centralizados (`src/types/`)
- ✅ Camada de API preparada (`src/lib/api/`)
- ✅ Serviços com hooks React Query (`src/lib/services/`)
- ✅ Hooks customizados reutilizáveis (`src/hooks/`)
- ✅ Utilitários e constantes centralizados (`src/lib/utils/`, `src/lib/constants/`)
- ✅ Mock data organizado (`src/__mocks__/`)
- ✅ Schemas de validação Zod (`src/lib/validations/`)

### Refatorações de Código
- ✅ **Páginas grandes refatoradas**:
  - `affiliates/page.tsx`: 535 → 336 linhas (-37%)
  - `campaigns/page.tsx`: 510 → 348 linhas (-32%)
  - `page.tsx`: Mock data movido para serviço
- ✅ **Sidebar refatorado**:
  - `sidebar.tsx`: 673 → 140 linhas (-79%)
  - Dividido em 5 arquivos organizados
- ✅ **Mock data extraído** para arquivos separados
- ✅ **Cálculos memoizados** com `useMemo`
- ✅ **Filtragem otimizada** com `useDebounce`
- ✅ **Hooks customizados** para ordenação de tabelas
- ✅ **Cálculos agregados** movidos para camada de serviço

### Segurança
- ✅ Headers HTTP de segurança configurados
- ✅ QueryClient com boas práticas
- ✅ Sanitização de inputs (`src/lib/utils/sanitize.ts`)
- ✅ Dados sensíveis removidos dos mocks
- ✅ Validação de divisão por zero (`safeDivide`)
- ✅ Validação com Zod para formulários
- ✅ Console.log removidos (ESLint configurado)
- ✅ Proteção XSS documentada

### Performance
- ✅ Cálculos pesados memoizados
- ✅ Filtragem e ordenação otimizadas
- ✅ Estados de loading/error implementados
- ✅ Debounce em buscas
- ✅ React Query com cache otimizado

### Clean Code
- ✅ Formatação centralizada (`formatCurrency`, `formatNumber`, `formatPercentage`)
- ✅ Funções de métricas centralizadas (`calculateROI`, `calculateMargin`, `calculateConversionRate`)
- ✅ Constantes centralizadas (status colors, labels)
- ✅ Tipos duplicados removidos
- ✅ Código duplicado eliminado
- ✅ Separação clara de responsabilidades
- ✅ Componentes puramente representacionais

### Pronto para Integração
- ✅ Serviços preparados para substituição fácil de mocks por API real
- ✅ TODO comments indicando pontos de integração
- ✅ Estrutura type-safe completa
- ✅ Hooks React Query configurados
- ✅ Schemas Zod prontos para validação backend

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar em Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 🏗️ Estrutura do Projeto

```
next-replicado/
├── src/
│   ├── app/                    # App Router (páginas)
│   │   ├── page.tsx           # Dashboard Geral (/)
│   │   ├── affiliates/        # Página de Afiliados
│   │   ├── players/           # Página de Jogadores
│   │   ├── campaigns/         # Página de Campanhas
│   │   ├── analytics/         # Página de Análises
│   │   ├── settings/          # Página de Configurações
│   │   ├── layout.tsx         # Layout principal
│   │   ├── providers.tsx       # Providers (React Query, etc)
│   │   └── globals.css        # Estilos globais
│   ├── components/
│   │   ├── dashboard/         # Componentes específicos do dashboard
│   │   ├── layout/            # Componentes de layout (Sidebar, Header)
│   │   └── ui/                # Componentes shadcn/ui
│   │       ├── sidebar.tsx    # Componente principal (140 linhas)
│   │       ├── sidebar-context.tsx    # Provider e Context
│   │       ├── sidebar-menu.tsx       # Componentes de menu
│   │       ├── sidebar-parts.tsx      # Componentes auxiliares
│   │       └── sidebar-group.tsx      # Componentes de grupo
│   ├── hooks/                  # Custom hooks
│   │   ├── useTableSort.ts    # Hook para ordenação de tabelas
│   │   ├── useDebounce.ts     # Hook para debounce
│   │   └── useDateRange.ts    # Hook para seleção de datas
│   ├── lib/                    # Utilitários e configurações
│   │   ├── api/               # Cliente HTTP e endpoints
│   │   ├── constants/         # Constantes do projeto
│   │   ├── services/          # Serviços de API
│   │   ├── utils/             # Funções utilitárias
│   │   │   ├── format.ts      # Formatação (currency, number, percentage)
│   │   │   ├── metrics.ts     # Cálculos de métricas (ROI, Margin, etc)
│   │   │   ├── sanitize.ts    # Sanitização HTML/XSS
│   │   │   └── form-helpers.ts # Helpers para Zod + react-hook-form
│   │   └── validations/       # Schemas Zod
│   │       └── schemas.ts     # Schemas de validação
│   ├── types/                  # Tipos TypeScript centralizados
│   └── __mocks__/              # Dados mockados organizados
│       ├── affiliateMetrics.ts
│       ├── campaigns.ts
│       └── dashboard.ts
├── public/                     # Arquivos estáticos
└── package.json
```

## 📄 Páginas Disponíveis

- `/` - Dashboard Geral
- `/affiliates` - Métricas por Afiliado
- `/players` - Gestão de Jogadores
- `/campaigns` - Gestão de Campanhas
- `/analytics` - Análises e Retenção
- `/settings` - Configurações do Sistema

## 🎨 Tema

O projeto utiliza tema escuro por padrão, configurado no `layout.tsx`. Os estilos seguem o design system do projeto com:

- Cores primárias em roxo (`hsl(262 83% 58%)`)
- Sistema de elevação para interações
- Tipografia Inter
- Componentes totalmente responsivos

## 🔧 Configurações Importantes

### Tailwind CSS
O `tailwind.config.ts` está configurado com todas as variáveis CSS do projeto, incluindo:
- Cores do tema (background, foreground, primary, etc)
- Cores da sidebar
- Cores dos gráficos (chart-1 a chart-5)
- Sistema de elevação

### Componentes UI
Todos os componentes shadcn/ui estão disponíveis em `src/components/ui/`. O componente `sidebar` foi refatorado em 5 arquivos para melhor organização e manutenibilidade.

### ESLint
Configurado com regras de qualidade:
- `no-console`: Aviso em desenvolvimento, erro em produção
- Regras do Next.js e TypeScript

## 📊 Estatísticas de Melhorias

### Redução de Código
- **Total reduzido**: -894 linhas (-52%)
- **affiliates/page.tsx**: 535 → 336 linhas (-37%)
- **campaigns/page.tsx**: 510 → 348 linhas (-32%)
- **sidebar.tsx**: 673 → 140 linhas (-79%)

### Qualidade de Código
- ✅ **Nenhum arquivo > 500 linhas** (todos refatorados!)
- ✅ **Código duplicado eliminado**
- ✅ **Funções utilitárias centralizadas**
- ✅ **Hooks customizados reutilizáveis**
- ✅ **Type-safe completo**
- ✅ **Validação robusta com Zod**

## 🔄 Próximos Passos para Integração

### Quando o Backend Estiver Pronto:

1. **Descomentar chamadas de API nos serviços**
   - Arquivo: `src/lib/services/affiliateService.ts`
   - Arquivo: `src/lib/services/campaignService.ts`
   - Arquivo: `src/lib/services/dashboardService.ts`
   - Remover código de mock
   - Descomentar linhas com `// TODO:`

2. **Configurar variáveis de ambiente**
   - Criar `.env.local` com `NEXT_PUBLIC_API_URL`

3. **Criar serviços adicionais**
   - `playerService.ts`, `analyticsService.ts`, `userService.ts`

4. **Usar schemas Zod nos formulários**
   - Exemplo disponível em `src/lib/validations/schemas.ts`
   - Helper em `src/lib/utils/form-helpers.ts`

## 📁 Estrutura Detalhada

```
src/
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Dashboard principal (usa dashboardService)
│   ├── affiliates/        # Página de afiliados (refatorada)
│   ├── campaigns/         # Página de campanhas (refatorada)
│   ├── players/           # Página de jogadores
│   ├── analytics/         # Página de análises
│   ├── settings/          # Página de configurações
│   ├── layout.tsx         # Layout principal
│   └── providers.tsx      # Providers (React Query)
├── components/             # Componentes React
│   ├── dashboard/         # Componentes do dashboard
│   │   ├── AffiliateMetricsTable.tsx  # Otimizado com hooks
│   │   ├── CampaignTable.tsx          # Otimizado com hooks
│   │   ├── KpiCard.tsx                # Aceita valores numéricos
│   │   └── ...
│   ├── layout/            # Componentes de layout
│   │   ├── AppSidebar.tsx
│   │   └── DashboardHeader.tsx
│   └── ui/                # Componentes shadcn/ui
│       ├── sidebar.tsx    # Componente principal (refatorado)
│       ├── sidebar-context.tsx
│       ├── sidebar-menu.tsx
│       ├── sidebar-parts.tsx
│       └── sidebar-group.tsx
├── hooks/                  # Hooks customizados
│   ├── useTableSort.ts    # Ordenação de tabelas
│   ├── useDebounce.ts     # Debounce de valores
│   └── useDateRange.ts    # Seleção de intervalo de datas
├── lib/                    # Utilitários e configurações
│   ├── api/               # Cliente HTTP
│   │   ├── base.ts        # Cliente base e helpers
│   │   └── endpoints.ts   # Endpoints centralizados
│   ├── constants/         # Constantes
│   │   └── status.ts      # Status colors e labels
│   ├── services/          # Serviços de API
│   │   ├── affiliateService.ts  # Hooks para afiliados (com totais)
│   │   ├── campaignService.ts   # Hooks para campanhas
│   │   └── dashboardService.ts  # Hooks para dashboard
│   ├── utils/             # Funções utilitárias
│   │   ├── format.ts      # Formatação (currency, number, percentage, safeDivide)
│   │   ├── metrics.ts     # Cálculos (ROI, Margin, ConversionRate)
│   │   ├── sanitize.ts    # Sanitização HTML/XSS
│   │   └── form-helpers.ts # Helpers para Zod
│   └── validations/       # Schemas Zod
│       └── schemas.ts     # Schemas de validação
├── types/                  # Tipos TypeScript
│   ├── affiliate.ts       # Tipos de afiliados
│   ├── campaign.ts        # Tipos de campanhas
│   ├── player.ts          # Tipos de jogadores
│   ├── common.ts          # Tipos comuns
│   └── ...
└── __mocks__/              # Dados mockados
    ├── affiliateMetrics.ts # Mock de métricas de afiliados
    ├── campaigns.ts        # Mock de campanhas
    └── dashboard.ts        # Mock do dashboard
```

## 🔧 Configuração

### Variáveis de Ambiente

Criar arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_ENV=development
```

### ESLint

O projeto está configurado com ESLint para garantir qualidade de código:
- Regra `no-console` ativa (warn em dev, error em prod)
- Regras do Next.js e TypeScript

## 📚 Documentação Adicional

- **ARQUIVOS_MAIORES.md**: Análise detalhada dos arquivos maiores do projeto
- **MELHORIAS_IDENTIFICADAS.md**: Lista completa de melhorias identificadas e aplicadas
- **MELHORIAS_SEGURANCA.md**: Melhorias de segurança implementadas

## 🎯 Melhorias Implementadas

### Refatorações Principais
- ✅ Mock data extraído para `__mocks__/`
- ✅ Hooks React Query implementados
- ✅ Cálculos memoizados com `useMemo`
- ✅ Formatação centralizada
- ✅ Validação de segurança (`safeDivide`)
- ✅ Constantes centralizadas
- ✅ Sidebar refatorado em 5 arquivos
- ✅ Cálculos agregados movidos para serviços
- ✅ Valores numéricos brutos em componentes

### Hooks Customizados
- ✅ `useTableSort`: Ordenação reutilizável para tabelas
- ✅ `useDebounce`: Debounce para buscas
- ✅ `useDateRange`: Seleção de intervalo de datas

### Utilitários
- ✅ `formatCurrency`, `formatNumber`, `formatPercentage`
- ✅ `safeDivide`: Divisão segura (evita divisão por zero)
- ✅ `calculateROI`, `calculateMargin`, `calculateConversionRate`
- ✅ `sanitizeHTML`, `escapeHTML`, `isSafeHTML`: Proteção XSS

### Validação
- ✅ Schemas Zod para formulários
- ✅ Integração com react-hook-form
- ✅ Validação type-safe

### Segurança
- ✅ Console.log removidos
- ✅ Headers HTTP de segurança
- ✅ Sanitização de HTML
- ✅ Validação de entrada com Zod

## 🐛 Resolução de Problemas

Se encontrar erros de importação:
- Verifique se todos os componentes UI estão em `src/components/ui/`
- Certifique-se de que os caminhos de importação usam `@/` (configurado no `tsconfig.json`)

Se encontrar erros de lint:
- Execute `npm run lint` para ver detalhes
- Console.log são permitidos apenas em desenvolvimento (warn)
- Em produção, console.log geram erro no build

## 📄 Licença

MIT
