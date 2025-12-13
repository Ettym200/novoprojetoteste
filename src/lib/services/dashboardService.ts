// Serviço para dados do dashboard principal

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getUserIdFromToken, getUserRoleFromToken } from '@/lib/utils/jwt';
import type { MetricsGeraisResponse } from '@/types/metrics';
import type { MetricsGeraisNewResponse } from '@/types/metricsNew';
import type {
  FunnelStage,
  RevenueData,
  Insight,
  DashboardKPIs,
} from '@/types/dashboard';
import { mockMetricasGeraisNew } from '@/__mocks__/metricasGeraisNew';

// TODO: Quando a API estiver pronta, mudar para false
const USE_MOCK_DATA = true;

export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: () => [...dashboardKeys.all, 'kpis'] as const,
  funnel: () => [...dashboardKeys.all, 'funnel'] as const,
  revenue: () => [...dashboardKeys.all, 'revenue'] as const,
  insights: () => [...dashboardKeys.all, 'insights'] as const,
};

/**
 * Helper para buscar lista de IDs de afiliados baseado no role do usuário
 */
async function getAffiliateIds(): Promise<string[]> {
  const userId = getUserIdFromToken();
  const userRole = getUserRoleFromToken();
  
  if (!userId) {
    return [];
  }
  
  try {
    // Buscar dados do usuário via /users/{userId}
    const userResponse = await api.get<{
      success?: boolean;
      data?: {
        affiliates?: Array<{ id: string }>;
        meusAfiliados?: Array<{
          afiliados?: Array<{ id: string }>;
        }>;
      };
    }>(ENDPOINTS.USERS.DETAIL(userId));
    
    if (userResponse.data.success === false || !userResponse.data.data) {
      return [];
    }
    
    const userData = userResponse.data.data;
    const affiliateIds: string[] = [];
    
    // Extrair IDs baseado no role
    if (userRole === 'AFILIADO') {
      if (userData.affiliates && Array.isArray(userData.affiliates)) {
        affiliateIds.push(...userData.affiliates.map(a => a.id));
      }
    } else if (userRole === 'GESTOR') {
      if (userData.meusAfiliados && Array.isArray(userData.meusAfiliados)) {
        userData.meusAfiliados.forEach(gestor => {
          if (gestor.afiliados && Array.isArray(gestor.afiliados)) {
            affiliateIds.push(...gestor.afiliados.map(a => a.id));
          }
        });
      }
    } else if (userRole === 'SUPER') {
      // Para SUPER, buscar todos os afiliados via /affiliates
      try {
        const affiliatesResponse = await api.get<Array<{ id: string }>>(ENDPOINTS.AFFILIATES.LIST);
        const affiliates = Array.isArray(affiliatesResponse.data) 
          ? affiliatesResponse.data 
          : (affiliatesResponse.data as { data?: Array<{ id: string }> })?.data || [];
        affiliateIds.push(...affiliates.map(a => a.id));
      } catch {
        // Se falhar, retornar vazio
      }
    }
  
    // Filtrar IDs válidos (strings não vazias e alfanuméricas)
    // Nota: alguns IDs podem ter menos de 10 caracteres (ex: "FELIPE")
    return affiliateIds.filter(id => 
      typeof id === 'string' && 
      id.length > 0 && 
      /^[A-Za-z0-9]+$/.test(id)
    );
  } catch (error) {
    console.warn('Erro ao buscar IDs de afiliados:', error);
    return [];
  }
}

/**
 * Helper para calcular variação percentual
 */
function calculatePercentageChange(atual: number, anterior: number): number {
  if (anterior === 0) return 0;
  return ((atual - anterior) / anterior) * 100;
}

/**
 * Hook para buscar KPIs do dashboard
 * Usa a nova estrutura da API (/metrics/gerais New)
 */
export function useDashboardKPIs(startDate?: string, endDate?: string) {
  return useQuery<DashboardKPIs & { changes: Record<string, number> }>({
    queryKey: [...dashboardKeys.kpis(), startDate, endDate],
    queryFn: async () => {
      // TODO: Quando a API estiver pronta, remover este bloco de mock
      if (USE_MOCK_DATA) {
        const mockData = mockMetricasGeraisNew.data.metricasGerais;
        const resumo = mockData.resumo;
        const eficacia = mockData.eficaciaDeCaptacao;
        
        // Calcular variações percentuais
        const changes = {
          totalInvested: calculatePercentageChange(resumo.atual.totalInvestido, resumo.anterior.totalInvestido),
          totalFtd: calculatePercentageChange(resumo.atual.totalFTD, resumo.anterior.totalFTD),
          totalDeposits: calculatePercentageChange(resumo.atual.totalDepositos, resumo.anterior.totalDepositos),
          totalWithdrawals: calculatePercentageChange(resumo.atual.totalSaques, resumo.anterior.totalSaques),
          ggr: calculatePercentageChange(resumo.atual.GGR, resumo.anterior.GGR),
          ngr: calculatePercentageChange(resumo.atual.NGR, resumo.anterior.NGR),
          netProfit: calculatePercentageChange(resumo.atual.lucroLiquido, resumo.anterior.lucroLiquido),
          roiFtd: calculatePercentageChange(resumo.atual.roiFTD, resumo.anterior.roiFTD),
          costPerWhatsAppLead: calculatePercentageChange(eficacia.atual.custoLeadWhatsapp, eficacia.anterior.custoLeadWhatsapp),
          costPerRegistration: calculatePercentageChange(eficacia.atual.custoCadastro, eficacia.anterior.custoCadastro),
          costPerDeposit: calculatePercentageChange(eficacia.atual.custoDeposito, eficacia.anterior.custoDeposito),
          costPerFtd: calculatePercentageChange(eficacia.atual.custoFTD, eficacia.anterior.custoFTD),
        };
        
        return {
          totalInvested: resumo.atual.totalInvestido,
          totalFtd: resumo.atual.totalFTD,
          totalDeposits: resumo.atual.totalDepositos,
          totalWithdrawals: resumo.atual.totalSaques,
          ggr: resumo.atual.GGR,
          ngr: resumo.atual.NGR,
          netProfit: resumo.atual.lucroLiquido,
          roiFtd: resumo.atual.roiFTD,
          costPerWhatsAppLead: eficacia.atual.custoLeadWhatsapp,
          costPerRegistration: eficacia.atual.custoCadastro,
          costPerDeposit: eficacia.atual.custoDeposito,
          costPerFtd: eficacia.atual.custoFTD,
          changes,
        };
      }
      
      // Código original para quando a API estiver pronta
      try {
        // Buscar IDs de afiliados baseado no role do usuário
        const affiliateIds = await getAffiliateIds();
        
        if (affiliateIds.length === 0) {
          return {
            totalInvested: 0,
            totalFtd: 0,
            totalDeposits: 0,
            totalWithdrawals: 0,
            ggr: 0,
            ngr: 0,
            netProfit: 0,
            roiFtd: 0,
            costPerWhatsAppLead: 0,
            costPerRegistration: 0,
            costPerDeposit: 0,
            costPerFtd: 0,
            changes: {},
          };
        }
        
        // Usar datas fornecidas ou padrão (hoje)
        const today = new Date();
        const finalStartDate = startDate || today.toISOString().split('T')[0];
        const finalEndDate = endDate || today.toISOString().split('T')[0];
        
        // Buscar métricas gerais da API (nova estrutura)
        const response = await api.get<MetricsGeraisNewResponse>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
            startDate: finalStartDate,
            endDate: finalEndDate,
          },
        });
        
        if (response.data.success === false || !response.data.data) {
          return {
            totalInvested: 0,
            totalFtd: 0,
            totalDeposits: 0,
            totalWithdrawals: 0,
            ggr: 0,
            ngr: 0,
            netProfit: 0,
            roiFtd: 0,
            costPerWhatsAppLead: 0,
            costPerRegistration: 0,
            costPerDeposit: 0,
            costPerFtd: 0,
            changes: {},
          };
        }
        
        const metricasGerais = response.data.data.metricasGerais;
        const resumo = metricasGerais.resumo;
        const eficacia = metricasGerais.eficaciaDeCaptacao;
        
        // Calcular variações percentuais
        const changes = {
          totalInvested: calculatePercentageChange(resumo.atual.totalInvestido, resumo.anterior.totalInvestido),
          totalFtd: calculatePercentageChange(resumo.atual.totalFTD, resumo.anterior.totalFTD),
          totalDeposits: calculatePercentageChange(resumo.atual.totalDepositos, resumo.anterior.totalDepositos),
          totalWithdrawals: calculatePercentageChange(resumo.atual.totalSaques, resumo.anterior.totalSaques),
          ggr: calculatePercentageChange(resumo.atual.GGR, resumo.anterior.GGR),
          ngr: calculatePercentageChange(resumo.atual.NGR, resumo.anterior.NGR),
          netProfit: calculatePercentageChange(resumo.atual.lucroLiquido, resumo.anterior.lucroLiquido),
          roiFtd: calculatePercentageChange(resumo.atual.roiFTD, resumo.anterior.roiFTD),
          costPerWhatsAppLead: calculatePercentageChange(eficacia.atual.custoLeadWhatsapp, eficacia.anterior.custoLeadWhatsapp),
          costPerRegistration: calculatePercentageChange(eficacia.atual.custoCadastro, eficacia.anterior.custoCadastro),
          costPerDeposit: calculatePercentageChange(eficacia.atual.custoDeposito, eficacia.anterior.custoDeposito),
          costPerFtd: calculatePercentageChange(eficacia.atual.custoFTD, eficacia.anterior.custoFTD),
        };
        
        return {
          totalInvested: resumo.atual.totalInvestido,
          totalFtd: resumo.atual.totalFTD,
          totalDeposits: resumo.atual.totalDepositos,
          totalWithdrawals: resumo.atual.totalSaques,
          ggr: resumo.atual.GGR,
          ngr: resumo.atual.NGR,
          netProfit: resumo.atual.lucroLiquido,
          roiFtd: resumo.atual.roiFTD,
          costPerWhatsAppLead: eficacia.atual.custoLeadWhatsapp,
          costPerRegistration: eficacia.atual.custoCadastro,
          costPerDeposit: eficacia.atual.custoDeposito,
          costPerFtd: eficacia.atual.custoFTD,
          changes,
        };
      } catch (error) {
        console.warn('Erro ao buscar KPIs da API, retornando zeros:', error);
        return {
          totalInvested: 0,
          totalFtd: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          ggr: 0,
          ngr: 0,
          netProfit: 0,
          roiFtd: 0,
          costPerWhatsAppLead: 0,
          costPerRegistration: 0,
          costPerDeposit: 0,
          costPerFtd: 0,
          changes: {},
        };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Hook para buscar estágios do funil
 * Usa a nova estrutura da API que já retorna dados do funil
 */
export function useFunnelStages(startDate?: string, endDate?: string) {
  return useQuery<FunnelStage[]>({
    queryKey: [...dashboardKeys.funnel(), startDate, endDate],
    queryFn: async () => {
      // TODO: Quando a API estiver pronta, remover este bloco de mock
      if (USE_MOCK_DATA) {
        const funilData = mockMetricasGeraisNew.data.metricasGerais.funilDeConversao;
        const funil = funilData.funil;
        
        // Criar estágios do funil usando dados reais da nova estrutura
        const stages: FunnelStage[] = [
          { 
            id: "1", 
            name: "Facebook", 
            value: funilData.totalImpressions,
            color: "#1877F2" 
          },
          { 
            id: "2", 
            name: "Página", 
            value: funil.pagina.total,
            color: "#6366F1" 
          },
          { 
            id: "3", 
            name: "WhatsApp", 
            value: funil.whatsapp.total,
            color: "#25D366" 
          },
          { 
            id: "4", 
            name: "Corretora", 
            value: funil.whatsapp.total, // Usar total de WhatsApp como proxy
            color: "#F59E0B" 
          },
          { 
            id: "5", 
            name: "Cadastro", 
            value: funil.cadastro.total,
            color: "#8B5CF6" 
          },
          { 
            id: "6", 
            name: "FTD", 
            value: funil.FTD.total,
            color: "#10B981" 
          },
          { 
            id: "7", 
            name: "Redepósito", 
            value: funil.redeposito.total,
            color: "#06B6D4" 
          },
        ];
        
        return stages;
      }
      
      // Código original para quando a API estiver pronta
      try {
        const affiliateIds = await getAffiliateIds();
        
        if (affiliateIds.length === 0) {
          return [];
        }
        
        const today = new Date();
        const finalStartDate = startDate || today.toISOString().split('T')[0];
        const finalEndDate = endDate || today.toISOString().split('T')[0];
        
        // Buscar métricas gerais (nova estrutura)
        const response = await api.get<MetricsGeraisNewResponse>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
            startDate: finalStartDate,
            endDate: finalEndDate,
          },
        });
        
        if (response.data.success === false || !response.data.data) {
          return [];
        }
        
        const funilData = response.data.data.metricasGerais.funilDeConversao;
        const funil = funilData.funil;
        
        const stages: FunnelStage[] = [
          { 
            id: "1", 
            name: "Facebook", 
            value: funilData.totalImpressions,
            color: "#1877F2" 
          },
          { 
            id: "2", 
            name: "Página", 
            value: funil.pagina.total,
            color: "#6366F1" 
          },
          { 
            id: "3", 
            name: "WhatsApp", 
            value: funil.whatsapp.total,
            color: "#25D366" 
          },
          { 
            id: "4", 
            name: "Corretora", 
            value: funil.whatsapp.total,
            color: "#F59E0B" 
          },
          { 
            id: "5", 
            name: "Cadastro", 
            value: funil.cadastro.total,
            color: "#8B5CF6" 
          },
          { 
            id: "6", 
            name: "FTD", 
            value: funil.FTD.total,
            color: "#10B981" 
          },
          { 
            id: "7", 
            name: "Redepósito", 
            value: funil.redeposito.total,
            color: "#06B6D4" 
          },
        ];
        
        return stages;
      } catch (error) {
        console.warn('Erro ao buscar funil da API, retornando vazio:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Hook para buscar dados de receita
 * Por enquanto retorna vazio pois não há endpoint específico para receita temporal
 * TODO: Quando houver endpoint com dados temporais (por dia/semana/mês), usar ele
 */
export function useRevenueData(startDate?: string, endDate?: string) {
  return useQuery<RevenueData[]>({
    queryKey: [...dashboardKeys.revenue(), startDate, endDate],
    queryFn: async () => {
      try {
        // Buscar IDs de afiliados baseado no role do usuário
        const affiliateIds = await getAffiliateIds();
        
        if (affiliateIds.length === 0) {
          return [];
        }
        
        // Calcular datas padrão (hoje)
        const today = new Date();
        const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Buscar métricas gerais para calcular totais
        const response = await api.get<MetricsGeraisResponse>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
            startDate,
            endDate,
          },
        });
        
        if (response.data.success === false || !response.data.data) {
          return [];
        }
        
        const metricsData = response.data.data;
        
        // Calcular totais
        const totalDeposits = metricsData.reduce((sum, item) => sum + (item.metrics.totalValorDepositosAtual || 0), 0);
        const totalWithdrawals = metricsData.reduce((sum, item) => sum + (item.metrics.totalValorSaquesAtual || 0), 0);
        const totalGgr = metricsData.reduce((sum, item) => sum + (item.metrics.ggrAtual || 0), 0);
        
        // Se todos os valores forem zero, retornar array vazio
        if (totalDeposits === 0 && totalGgr === 0 && totalWithdrawals === 0) {
          return [];
        }
        
        // TODO: Quando houver endpoint com dados temporais (por dia/semana/mês), usar ele
        // Por enquanto, retornar vazio pois não temos dados temporais
        // A API /metrics/gerais retorna apenas totais, não dados por período
        return [];
      } catch (error) {
        // Em caso de erro, retornar array vazio
        console.warn('Erro ao buscar receita da API, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Hook para buscar insights automáticos
 * Gera insights baseados nos dados de métricas gerais
 */
export function useInsights(startDate?: string, endDate?: string) {
  return useQuery<Insight[]>({
    queryKey: [...dashboardKeys.insights(), startDate, endDate],
    queryFn: async () => {
      try {
        // Buscar IDs de afiliados baseado no role do usuário
        const affiliateIds = await getAffiliateIds();
        
        if (affiliateIds.length === 0) {
          return [];
        }
        
        // Calcular datas padrão (hoje)
        const today = new Date();
        const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Buscar métricas para calcular insights
        const response = await api.get<MetricsGeraisResponse>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
            startDate,
            endDate,
          },
        });
        
        if (response.data.success === false || !response.data.data) {
          return [];
        }
        
        const metricsData = response.data.data;
        
        // Se não houver dados, retornar array vazio
        if (metricsData.length === 0) {
          return [];
        }
        
        // Calcular métricas para insights
        const totalNetProfit = metricsData.reduce((sum, item) => sum + (item.metrics.lucroLiquidoAtual || 0), 0);
        const totalInvestment = metricsData.reduce((sum, item) => sum + (item.metrics.totalInvestidoAtual || 0), 0);
        const avgROI = totalInvestment > 0 ? (totalNetProfit / totalInvestment) * 100 : 0;
        
        // Se todos os valores forem zero, retornar array vazio
        if (totalNetProfit === 0 && totalInvestment === 0) {
          return [];
        }
        
        // Gerar insights baseados nos dados
        const insights: Insight[] = [];
        
        // Insight sobre ROI
        if (avgROI < 0) {
          insights.push({
            id: "1",
            type: "danger",
            title: "ROI Negativo",
            description: `O ROI médio está em ${avgROI.toFixed(2)}%. Revise as estratégias de captação.`,
            metric: "ROI Médio",
            metricValue: `${avgROI.toFixed(2)}%`,
          });
        } else if (avgROI > 50) {
          insights.push({
            id: "2",
            type: "success",
            title: "ROI Excelente",
            description: `O ROI médio está em ${avgROI.toFixed(2)}%. Desempenho acima da média.`,
            metric: "ROI Médio",
            metricValue: `${avgROI.toFixed(2)}%`,
          });
        }
        
        // Encontrar top performer (afiliado com maior lucro líquido)
        if (metricsData.length > 0) {
          const topPerformer = metricsData.reduce((top, item) => {
            const currentProfit = item.metrics.lucroLiquidoAtual || 0;
            const topProfit = top.metrics.lucroLiquidoAtual || 0;
            return currentProfit > topProfit ? item : top;
          }, metricsData[0]);
          
          if (topPerformer.metrics.lucroLiquidoAtual > 0) {
            insights.push({
              id: "3",
              type: "success",
              title: `${topPerformer.affiliate} é top performer`,
              description: `Afiliado com maior lucro líquido: ${topPerformer.metrics.lucroLiquidoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
              metric: "Lucro Líquido",
              metricValue: topPerformer.metrics.lucroLiquidoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            });
          }
        }
        
        // Insight sobre afiliados com ROI negativo
        const negativeROI = metricsData.filter(item => {
          const roi = item.metrics.roiFTDAtual;
          return roi !== null && typeof roi === 'number' && roi < 0;
        });
        
        if (negativeROI.length > 0) {
          insights.push({
            id: "4",
            type: "warning",
            title: `${negativeROI.length} afiliado(s) com ROI negativo`,
            description: `Alguns afiliados estão com desempenho abaixo do esperado. Revise suas estratégias.`,
            metric: "Afiliados",
            metricValue: `${negativeROI.length}`,
          });
        }
        
        return insights;
      } catch (error) {
        // Em caso de erro, retornar array vazio
        console.warn('Erro ao buscar insights da API, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

