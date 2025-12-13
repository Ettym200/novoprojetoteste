Quando a API estiver pronta na VPN:
Mudar USE_MOCK_DATA = false em dashboardService.ts# ✅ Checklist: Trocar para API Real

Este documento lista **todas as mudanças necessárias** quando a API estiver online na VPN.

---

## 🔧 Mudanças Obrigatórias

### 1. Dashboard Service (`src/lib/services/dashboardService.ts`)

**Localização:** Linha ~15

**Mudança:**
```typescript
// ❌ ANTES (usando mocks):
const USE_MOCK_DATA = true;

// ✅ DEPOIS (usando API real):
const USE_MOCK_DATA = false;
```

**Impacto:** Esta é a única mudança obrigatória. Todos os outros arquivos já estão preparados.

---

## 📋 Verificações Necessárias

### 2. Verificar Endpoints (`src/lib/api/endpoints.ts`)

Verificar se os endpoints estão corretos:

```typescript
METRICS: {
  GERAIS: '/metrics/gerais',        // ✅ Verificar se está correto
  ENGAJAMENTO: '/metrics/engajamento', // ✅ Verificar se está correto
  CAMPANHAS: '/metrics/campanhas',   // ✅ Verificar se está correto
}
```

**O que verificar:**
- [ ] URLs estão corretas (sem `/api/v1` ou prefixos extras)
- [ ] Nomes dos endpoints correspondem à documentação da API
- [ ] Base URL está configurada corretamente em `src/lib/api/client.ts`

---

### 3. Verificar Estrutura de Resposta

A API deve retornar exatamente esta estrutura:

#### `/metrics/gerais`
```json
{
  "success": true,
  "message": "Requisição concluída com sucesso",
  "data": {
    "metricasGerais": {
      "resumo": {
        "atual": { ... },
        "anterior": { ... }
      },
      "eficaciaDeCaptacao": {
        "atual": { ... },
        "anterior": { ... }
      },
      "funilDeConversao": {
        "totalImpressions": number,
        "funil": { ... }
      }
    }
  }
}
```

**O que verificar:**
- [ ] Resposta tem `success: true`
- [ ] Estrutura `data.metricasGerais` existe
- [ ] `resumo.atual` e `resumo.anterior` existem
- [ ] `eficaciaDeCaptacao.atual` e `eficaciaDeCaptacao.anterior` existem
- [ ] `funilDeConversao` existe com `totalImpressions` e `funil`

---

### 4. Verificar Parâmetros da Requisição

A API deve aceitar estes parâmetros:

```typescript
// GET /metrics/gerais
params: {
  affiliateId: string[] | string,  // Array de IDs ou string única
  startDate: string,                // Formato: YYYY-MM-DD
  endDate: string,                  // Formato: YYYY-MM-DD
}
```

**O que verificar:**
- [ ] API aceita múltiplos `affiliateId` (array)
- [ ] API aceita `startDate` e `endDate` no formato `YYYY-MM-DD`
- [ ] API retorna dados filtrados por essas datas
- [ ] API retorna dados agregados de todos os afiliados quando múltiplos IDs são enviados

---

## 🧪 Testes a Realizar

### 5. Testar Carregamento dos KPIs

**O que testar:**
- [ ] Dashboard carrega sem erros
- [ ] KPIs exibem valores corretos (não zeros)
- [ ] Variações percentuais (`change`) estão corretas
- [ ] Valores correspondem aos dados reais da API

**Como testar:**
1. Fazer login
2. Acessar `/dashboard`
3. Verificar se os cards de KPI mostram valores
4. Verificar se as variações percentuais aparecem (verde/vermelho)

---

### 6. Testar Funil de Conversão

**O que testar:**
- [ ] Funil Sankey aparece na página
- [ ] Etapas do funil têm valores reais (não zeros)
- [ ] Valores correspondem aos dados da API

**Como testar:**
1. Acessar `/dashboard`
2. Verificar se o gráfico "Funil de Conversão" aparece
3. Verificar se as etapas têm valores (Facebook, Página, WhatsApp, etc.)

---

### 7. Testar Filtros de Data

**O que testar:**
- [ ] Seletor de data funciona
- [ ] Dados são atualizados ao mudar a data
- [ ] API recebe os parâmetros `startDate` e `endDate` corretos

**Como testar:**
1. Acessar `/dashboard`
2. Mudar o range de datas no seletor
3. Verificar se os KPIs são atualizados
4. Verificar no Network tab se a requisição tem os parâmetros corretos

---

### 8. Testar com Diferentes Roles

**O que testar:**
- [ ] AFILIADO: Vê apenas seus próprios dados
- [ ] GESTOR: Vê dados de seus afiliados
- [ ] SUPER: Vê dados de todos os afiliados

**Como testar:**
1. Fazer login com cada role
2. Verificar se os dados exibidos correspondem ao role
3. Verificar se `affiliateIds` enviados na requisição estão corretos

---

## 🐛 Troubleshooting

### Problema: KPIs mostram zeros

**Possíveis causas:**
1. API não está retornando dados
2. Estrutura da resposta está diferente
3. `affiliateIds` não estão sendo enviados corretamente

**Solução:**
1. Verificar Network tab no DevTools
2. Verificar resposta da API no console
3. Verificar se a estrutura corresponde ao esperado
4. Verificar se `USE_MOCK_DATA = false`

---

### Problema: Variações percentuais estão erradas

**Possíveis causas:**
1. API não está retornando `anterior`
2. Cálculo está incorreto
3. Valores `anterior` são zero

**Solução:**
1. Verificar se `resumo.anterior` existe na resposta
2. Verificar função `calculatePercentageChange()` em `dashboardService.ts`
3. Adicionar tratamento para divisão por zero

---

### Problema: Funil está vazio

**Possíveis causas:**
1. API não está retornando `funilDeConversao`
2. `totalImpressions` é zero
3. Estrutura do funil está diferente

**Solução:**
1. Verificar se `funilDeConversao` existe na resposta
2. Verificar se `totalImpressions` tem valor
3. Verificar estrutura de `funil` na resposta

---

### Problema: Erro 401/403 (Não autorizado)

**Possíveis causas:**
1. Token de autenticação expirado
2. Token não está sendo enviado
3. Usuário não tem permissão

**Solução:**
1. Verificar se o token está sendo enviado no header
2. Fazer logout e login novamente
3. Verificar permissões do usuário no backend

---

### Problema: Erro 500 (Erro do servidor)

**Possíveis causas:**
1. API está com problemas
2. Parâmetros inválidos sendo enviados
3. `affiliateId` inválido

**Solução:**
1. Verificar logs do backend
2. Verificar parâmetros sendo enviados
3. Verificar se `affiliateIds` são válidos (não contém "FELIPE" ou outros valores inválidos)

---

## 📝 Arquivos que NÃO Precisam ser Alterados

Estes arquivos já estão preparados e **não precisam** de mudanças:

- ✅ `src/types/metricsNew.ts` - Tipos já definidos
- ✅ `src/app/(dashboard)/dashboard/page.tsx` - Já usa `kpis?.changes`
- ✅ `src/lib/services/dashboardService.ts` - Já tem código para API real (comentado)
- ✅ `src/types/dashboard.ts` - Tipos já definidos

---

## 🔄 Processo Completo de Migração

### Passo 1: Preparação
- [ ] Confirmar que a API está online na VPN
- [ ] Confirmar que a estrutura da resposta está correta
- [ ] Confirmar que os endpoints estão corretos

### Passo 2: Mudança Principal
- [ ] Mudar `USE_MOCK_DATA = false` em `dashboardService.ts`

### Passo 3: Testes
- [ ] Testar carregamento dos KPIs
- [ ] Testar funil de conversão
- [ ] Testar filtros de data
- [ ] Testar com diferentes roles

### Passo 4: Validação
- [ ] Verificar se valores correspondem aos dados reais
- [ ] Verificar se variações percentuais estão corretas
- [ ] Verificar se não há erros no console

### Passo 5: Limpeza (Opcional)
- [ ] Remover arquivos de mock (opcional, pode manter para testes)
- [ ] Remover comentários `TODO` relacionados aos mocks

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar console do navegador** - Erros JavaScript
2. **Verificar Network tab** - Requisições HTTP
3. **Verificar resposta da API** - Estrutura dos dados
4. **Comparar com mocks** - Ver se estrutura está igual

---

## ✅ Resumo Rápido

**Única mudança obrigatória:**
```typescript
// src/lib/services/dashboardService.ts, linha ~15
const USE_MOCK_DATA = false; // Mudar de true para false
```

**Tudo mais já está pronto!** 🎉

