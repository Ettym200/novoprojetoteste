# Integração da Tela de Afiliados

## 📋 Status da Integração

**Status:** 🟡 Em Progresso  
**Última atualização:** 2025-12-06

---

## ✅ O que já foi implementado

### 1. **Busca de Afiliados via API**
- ✅ Implementado `useAffiliates()` que busca afiliados via `/users/{userId}` usando o token JWT
- ✅ Extração de afiliados baseada no role do usuário:
  - **AFILIADO**: Busca `data.affiliates[]` do endpoint `/users/{userId}`
  - **GESTOR**: Busca `data.meusAfiliados[].afiliados[]` (faz flat dos afiliados)
  - **SUPER**: Usa `/affiliates` para ver todos os afiliados
- ✅ Validação de resposta da API (verifica `success: false`, `errors`, etc.)
- ✅ Tratamento de erros com retorno de array vazio quando necessário

### 2. **Métricas de Afiliados**
- ✅ Implementado `useAffiliateMetrics()` que busca métricas via `/users/{userId}`
- ✅ Extração de IDs dos afiliados baseada no role
- ✅ Tentativa de buscar métricas via `/metrics/gerais` com IDs dos afiliados
- ✅ Fallback: quando `/metrics/gerais` falha, usa dados básicos de `/users/{userId}` para exibir lista com nomes
- ✅ Cálculo de totais agregados (totalAffiliates, topPerformers, totalGgr, etc.)

### 3. **Filtragem por Usuário**
- ✅ Filtragem automática baseada no token JWT
- ✅ Cada usuário vê apenas seus próprios afiliados:
  - `valter@veloc.com` (AFILIADO) → vê apenas 1 afiliado (ele mesmo)
  - `oxdr@email.com` (GESTOR) → vê afiliados dos seus sub-afiliados
  - SUPER → vê todos os afiliados
- ✅ Cache do React Query limpo no login/logout para evitar dados de outro usuário

### 4. **Componentes da Interface**
- ✅ Página `/affiliates` criada em `src/app/(dashboard)/affiliates/page.tsx`
- ✅ Componente `AffiliateMetricsTable` para exibir tabela de métricas
- ✅ KPIs cards exibindo totais agregados
- ✅ Modal de detalhes do afiliado com abas (Investimento, Depósitos, FTD, Resultados)

### 5. **Validação e Tratamento de Erros**
- ✅ Validação de IDs de afiliados (filtra IDs inválidos antes de buscar métricas)
- ✅ Tratamento de erro 500 da API `/metrics/gerais`
- ✅ Mensagens de erro amigáveis para o usuário
- ✅ Loading states e error states implementados

### 6. **Autenticação e Segurança**
- ✅ Botão "Sair" funcional com limpeza de cache
- ✅ Limpeza de cache do React Query no login/logout
- ✅ Token JWT usado para autenticação nas requisições

---

## 🚧 O que ainda falta implementar

### 1. **Métricas Detalhadas**
- ⏳ Buscar métricas reais de `/metrics/gerais` quando a API estiver funcionando corretamente
- ⏳ Exibir métricas completas na tabela (atualmente mostra zeros quando `/metrics/gerais` falha)
- ⏳ Implementar filtros de data para métricas (startDate, endDate)
- ⏳ Calcular métricas derivadas (ROI, Margem, Taxa de Conversão) com dados reais

### 2. **Funcionalidades da Tela**
- ⏳ Busca/filtro de afiliados na tabela (campo de busca já existe, mas precisa conectar)
- ⏳ Ordenação de colunas na tabela (já implementado no componente, mas precisa testar)
- ⏳ Paginação se houver muitos afiliados
- ⏳ Exportação de dados (CSV, Excel)
- ⏳ Filtros avançados (por data, por performance, etc.)

### 3. **Integração com Outras Telas**
- ⏳ Link para detalhes do afiliado (página dedicada)
- ⏳ Navegação para campanhas do afiliado
- ⏳ Navegação para jogadores do afiliado
- ⏳ Histórico de métricas (gráficos temporais)

### 4. **Melhorias de Performance**
- ⏳ Otimizar chamadas à API (evitar múltiplas requisições desnecessárias)
- ⏳ Implementar cache inteligente (não limpar tudo, apenas dados do usuário anterior)
- ⏳ Lazy loading de métricas detalhadas (carregar apenas quando necessário)

### 5. **Tratamento de Edge Cases**
- ⏳ Tratar caso quando usuário não tem afiliados (mensagem amigável)
- ⏳ Tratar caso quando `/metrics/gerais` retorna erro 500 (já parcialmente implementado)
- ⏳ Tratar caso quando token JWT expira durante o uso
- ⏳ Tratar caso quando API retorna dados em formato inesperado

### 6. **Testes e Validação**
- ⏳ Testes unitários para `useAffiliates` e `useAffiliateMetrics`
- ⏳ Testes de integração para fluxo completo
- ⏳ Validação com diferentes roles (AFILIADO, GESTOR, SUPER)
- ⏳ Validação com diferentes cenários de erro da API

### 7. **Documentação**
- ⏳ Documentar formato esperado da resposta da API
- ⏳ Documentar como adicionar novos filtros
- ⏳ Documentar como adicionar novas métricas

---

## 🔍 Problemas Conhecidos

### 1. **Erro 500 em `/metrics/gerais`**
- **Problema**: API retorna erro 500 quando chamada com `affiliateId`
- **Solução temporária**: Usar dados básicos de `/users/{userId}` para exibir lista com nomes
- **Solução definitiva**: Corrigir backend ou ajustar formato da requisição

### 2. **IDs Inválidos**
- **Problema**: Alguns IDs de afiliados podem ser inválidos (ex: "FELIPE")
- **Solução**: Filtro implementado para validar IDs antes de buscar métricas
- **Melhoria futura**: Validar IDs no backend antes de retornar

### 3. **Cache Persistente**
- **Problema**: Cache do React Query pode manter dados entre sessões
- **Solução**: Limpeza de cache no login/logout implementada
- **Melhoria futura**: Cache mais inteligente baseado em userId

---

## 📝 Notas Técnicas

### Endpoints Utilizados
- `GET /users/{userId}` - Busca dados do usuário e seus afiliados
- `GET /affiliates` - Lista todos os afiliados (apenas para SUPER)
- `GET /metrics/gerais?affiliateId=...` - Busca métricas dos afiliados (atualmente com problemas)

### Estrutura de Dados

#### Resposta de `/users/{userId}` para AFILIADO:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "affiliates": [
      {
        "id": "...",
        "name": "...",
        "email": "..."
      }
    ]
  }
}
```

#### Resposta de `/users/{userId}` para GESTOR:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "meusAfiliados": [
      {
        "id": "...",
        "name": "...",
        "afiliados": [
          {
            "id": "...",
            "name": "..."
          }
        ]
      }
    ]
  }
}
```

### Fluxo de Dados
1. Usuário acessa `/affiliates`
2. `useAffiliateMetrics()` é chamado
3. Extrai `userId` do token JWT
4. Busca `/users/{userId}` para obter lista de afiliados
5. Extrai IDs dos afiliados baseado no role
6. Tenta buscar métricas via `/metrics/gerais`
7. Se falhar, usa dados básicos para exibir lista com nomes
8. Calcula totais e exibe na interface

---

## 🎯 Próximos Passos

1. **Corrigir API `/metrics/gerais`** ou ajustar formato da requisição
2. **Implementar filtros de data** para métricas
3. **Adicionar busca/filtro** na tabela de afiliados
4. **Implementar paginação** se necessário
5. **Adicionar testes** para garantir qualidade

---

## 📚 Referências

- Arquivo principal: `src/lib/services/affiliateService.ts`
- Página: `src/app/(dashboard)/affiliates/page.tsx`
- Componente de tabela: `src/components/dashboard/AffiliateMetricsTable.tsx`
- Tipos: `src/types/affiliate.ts`
- Endpoints: `src/lib/api/endpoints.ts`

