# Como Trocar para a API Real

Este documento explica como trocar dos mocks para a API real quando ela estiver pronta na VPN.

## 📋 O que foi feito

1. **Tipos TypeScript criados** (`src/types/metricsNew.ts`):
   - `MetricsGeraisNewResponse` - Nova estrutura de `/metrics/gerais`
   - `MetricsAfiliadosNewResponse` - Nova estrutura de `/metrics/afiliados`
   - `MetricsCampanhasNewResponse` - Nova estrutura de `/metrics/campanhas`

2. **Mocks criados** (`src/__mocks__/`):
   - `metricasGeraisNew.ts` - Mock de métricas gerais
   - `metricasAfiliadosNew.ts` - Mock de métricas de afiliados
   - `metricasCampanhasNew.ts` - Mock de métricas de campanhas
   - Arquivos JSON correspondentes com os dados completos

3. **Dashboard Service atualizado** (`src/lib/services/dashboardService.ts`):
   - Flag `USE_MOCK_DATA = true` para controlar uso de mocks
   - Função `useDashboardKPIs()` atualizada para usar nova estrutura
   - Função `useFunnelStages()` atualizada para usar dados reais do funil
   - Cálculo de variações percentuais implementado

4. **Página Dashboard atualizada** (`src/app/(dashboard)/dashboard/page.tsx`):
   - Todos os valores de `change` agora usam dados calculados
   - Removidos valores hardcoded

## 🔄 Como trocar para a API real

### Passo 1: Atualizar a flag no `dashboardService.ts`

No arquivo `src/lib/services/dashboardService.ts`, linha ~15:

```typescript
// Mudar de:
const USE_MOCK_DATA = true;

// Para:
const USE_MOCK_DATA = false;
```

### Passo 2: Verificar se os endpoints estão corretos

Verificar em `src/lib/api/endpoints.ts` se os endpoints estão apontando para a API correta:

```typescript
METRICS: {
  GERAIS: '/metrics/gerais',
  // ... outros endpoints
}
```

### Passo 3: Testar a integração

1. Fazer login no sistema
2. Acessar `/dashboard`
3. Verificar se os dados estão sendo carregados corretamente
4. Verificar se as variações percentuais estão corretas
5. Verificar se o funil está exibindo dados reais

### Passo 4: Remover os mocks (opcional)

Após confirmar que a API está funcionando, você pode remover os arquivos de mock:

```bash
# Remover arquivos de mock
rm src/__mocks__/metricasGeraisNew.ts
rm src/__mocks__/metricasAfiliadosNew.ts
rm src/__mocks__/metricasCampanhasNew.ts
rm src/__mocks__/metricasAfiliadosNew.json
rm src/__mocks__/metricasCampanhasNew.json
```

**Nota:** Não é necessário remover os mocks imediatamente. Eles podem ser úteis para testes e desenvolvimento.

## 📊 Estrutura da Nova API

### `/metrics/gerais` (Nova estrutura)

```typescript
{
  success: boolean;
  message: string;
  data: {
    metricasGerais: {
      resumo: {
        atual: { ... },
        anterior: { ... }
      },
      eficaciaDeCaptacao: {
        atual: { ... },
        anterior: { ... }
      },
      funilDeConversao: {
        totalImpressions: number;
        funil: {
          pagina: { ... },
          whatsapp: { ... },
          cadastro: { ... },
          FTD: { ... },
          redeposito: { ... }
        }
      }
    }
  }
}
```

### Diferenças da estrutura antiga

- **Antiga:** Retornava array de afiliados com métricas individuais
- **Nova:** Retorna resumo agregado + funil de conversão completo
- **Vantagem:** Dados já agregados, não precisa calcular no frontend
- **Vantagem:** Funil completo com dados reais (não estimativas)

## ✅ Checklist para quando a API estiver pronta

- [ ] Mudar `USE_MOCK_DATA = false` em `dashboardService.ts`
- [ ] Testar carregamento dos KPIs
- [ ] Verificar variações percentuais
- [ ] Verificar funil de conversão
- [ ] Testar filtros de data
- [ ] Verificar se insights estão funcionando
- [ ] Testar com diferentes roles (AFILIADO, GESTOR, SUPER)
- [ ] Verificar performance e tempo de resposta

## 🐛 Troubleshooting

### Se os dados não aparecerem:

1. Verificar console do navegador para erros
2. Verificar Network tab para ver requisições
3. Verificar se o token de autenticação está válido
4. Verificar se os `affiliateIds` estão sendo enviados corretamente

### Se as variações estiverem erradas:

1. Verificar se a API está retornando `atual` e `anterior`
2. Verificar função `calculatePercentageChange()` em `dashboardService.ts`
3. Verificar se não há divisão por zero

### Se o funil estiver vazio:

1. Verificar se a API está retornando `funilDeConversao`
2. Verificar se `totalImpressions` está presente
3. Verificar se os dados do funil estão no formato correto

## 📝 Notas

- Os mocks foram criados baseados nas respostas fornecidas pelo chefe
- A estrutura da API pode ter pequenas diferenças quando for publicada
- Todos os cálculos de variação percentual já estão implementados
- O funil agora usa dados reais em vez de estimativas

