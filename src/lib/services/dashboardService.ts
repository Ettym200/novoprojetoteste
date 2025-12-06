// Serviço para dados do dashboard principal

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getUserIdFromToken, getUserRoleFromToken } from '@/lib/utils/jwt';
import type { MetricsGeraisResponse } from '@/types/metrics';
import type {
  FunnelStage,
  RevenueData,
  Insight,
  DashboardKPIs,
} from '@/types/dashboard';

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
 * Hook para buscar KPIs do dashboard
 * Agrega dados de /metrics/gerais para calcular KPIs
 */
export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: dashboardKeys.kpis(),
    queryFn: async () => {
      try {
        // Buscar IDs de afiliados baseado no role do usuário
        const affiliateIds = await getAffiliateIds();
        
        if (affiliateIds.length === 0) {
          // Se não houver afiliados, retornar zeros
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
          };
        }
        
        // Calcular datas padrão (hoje)
        const today = new Date();
        const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Buscar métricas gerais da API com os IDs dos afiliados e datas
        const response = await api.get<MetricsGeraisResponse>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
            startDate,
            endDate,
          },
        });
        
        // Verificar se a resposta indica erro
        if (response.data.success === false || !response.data.data) {
          console.warn('[useDashboardKPIs] API retornou success: false ou sem data', response.data);
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
          };
        }
        
        const metricsData = response.data.data;
        
        // Agregar dados de todos os afiliados para calcular KPIs totais
        const kpis: DashboardKPIs = {
          // Mapear campos da API para os KPIs do dashboard
          totalInvested: metricsData.reduce((sum, item) => sum + (item.metrics.totalInvestidoAtual || 0), 0),
          totalFtd: metricsData.reduce((sum, item) => sum + (item.metrics.totalValorFTDsAtual || 0), 0),
          totalDeposits: metricsData.reduce((sum, item) => sum + (item.metrics.totalValorDepositosAtual || 0), 0),
          totalWithdrawals: metricsData.reduce((sum, item) => sum + (item.metrics.totalValorSaquesAtual || 0), 0),
          ggr: metricsData.reduce((sum, item) => sum + (item.metrics.ggrAtual || 0), 0),
          ngr: metricsData.reduce((sum, item) => sum + (item.metrics.ngrAtual || 0), 0),
          netProfit: metricsData.reduce((sum, item) => sum + (item.metrics.lucroLiquidoAtual || 0), 0),
          roiFtd: 0, // Calcular média ponderada
          costPerWhatsAppLead: 0, // Calcular média ponderada
          costPerRegistration: 0, // Calcular média ponderada
          costPerDeposit: 0, // Calcular média ponderada
          costPerFtd: 0, // Calcular média ponderada
        };
        
        // Calcular médias ponderadas para custos
        const totalCadastros = metricsData.reduce((sum, item) => sum + (item.metrics.totalCadastrosAtual || 0), 0);
        const totalDepositos = metricsData.reduce((sum, item) => sum + (item.metrics.totalDepositosAtual || 0), 0);
        const totalFTDs = metricsData.reduce((sum, item) => sum + (item.metrics.totalFTDsAtual || 0), 0);
        
        // Calcular ROI médio ponderado
        if (kpis.totalInvested > 0) {
          kpis.roiFtd = (kpis.netProfit / kpis.totalInvested) * 100;
        } else {
          // Se não houver investimento, calcular média dos ROIs individuais
          const rois = metricsData
            .map(item => item.metrics.roiFTDAtual)
            .filter((roi): roi is number => roi !== null && typeof roi === 'number');
          if (rois.length > 0) {
            kpis.roiFtd = rois.reduce((sum, roi) => sum + roi, 0) / rois.length;
          }
        }
        
        // Calcular custos médios ponderados
        if (totalCadastros > 0) {
          kpis.costPerRegistration = metricsData.reduce((sum, item) => {
            const custo = item.metrics.custoCadastroAtual || 0;
            const cadastros = item.metrics.totalCadastrosAtual || 0;
            return sum + (custo * cadastros);
          }, 0) / totalCadastros;
        }
        
        if (totalDepositos > 0) {
          kpis.costPerDeposit = metricsData.reduce((sum, item) => {
            const custo = item.metrics.custoDepositoAtual || 0;
            const depositos = item.metrics.totalDepositosAtual || 0;
            return sum + (custo * depositos);
          }, 0) / totalDepositos;
        }
        
        if (totalFTDs > 0) {
          kpis.costPerFtd = metricsData.reduce((sum, item) => {
            const custo = item.metrics.custoFTDAtual || 0;
            const ftds = item.metrics.totalFTDsAtual || 0;
            return sum + (custo * ftds);
          }, 0) / totalFTDs;
        }
        
        // Custo por lead WhatsApp (média simples já que não temos total de assinaturas)
        const leadsWithCost = metricsData.filter(item => 
          item.metrics.custoLeadWhatsappAtual !== null && 
          typeof item.metrics.custoLeadWhatsappAtual === 'number'
        );
        if (leadsWithCost.length > 0) {
          kpis.costPerWhatsAppLead = leadsWithCost.reduce((sum, item) => 
            sum + (item.metrics.custoLeadWhatsappAtual as number), 0
          ) / leadsWithCost.length;
        }
        
        return kpis;
      } catch (error) {
        // Em caso de erro, retornar valores zerados
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
        };
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1, // Tentar uma vez em caso de erro
  });
}

/**
 * Hook para buscar estágios do funil
 * Calcula funil a partir dos dados de métricas gerais
 */
export function useFunnelStages() {
  return useQuery<FunnelStage[]>({
    queryKey: dashboardKeys.funnel(),
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
        
        // Buscar métricas gerais com IDs dos afiliados e datas
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
        
        // Calcular totais para criar funil usando dados reais
        const totalCadastros = metricsData.reduce((sum, item) => sum + (item.metrics.totalCadastrosAtual || 0), 0);
        const totalFTDs = metricsData.reduce((sum, item) => sum + (item.metrics.totalFTDsAtual || 0), 0);
        const totalDepositos = metricsData.reduce((sum, item) => sum + (item.metrics.totalDepositosAtual || 0), 0);
        const totalClientes = metricsData.reduce((sum, item) => sum + (item.metrics.totalClientesAtual || 0), 0);
        
        // Se todos os valores forem zero, retornar vazio
        if (totalCadastros === 0 && totalFTDs === 0 && totalDepositos === 0) {
          return [];
        }
        
        // Criar estágios do funil baseado nos dados reais
        // Usar proporções aproximadas baseadas em dados típicos de funil
        // Nota: A API não retorna dados de impressões/cliques do Facebook diretamente em /metrics/gerais
        // Para isso, precisaríamos de /metrics/engajamento, mas por enquanto usamos estimativas
        const stages: FunnelStage[] = [
          { 
            id: "1", 
            name: "Facebook", 
            value: Math.round(totalCadastros * 10), // Estimativa: 10x mais impressões que cadastros
            color: "#1877F2" 
          },
          { 
            id: "2", 
            name: "Página", 
            value: Math.round(totalCadastros * 3), // Estimativa: 3x mais visitas que cadastros
            color: "#6366F1" 
          },
          { 
            id: "3", 
            name: "WhatsApp", 
            value: totalClientes, // Usar totalClientes como proxy para assinaturas WhatsApp
            color: "#25D366" 
          },
          { 
            id: "4", 
            name: "Corretora", 
            value: Math.round(totalCadastros * 1.5), // Estimativa: 1.5x mais cliques que cadastros
            color: "#F59E0B" 
          },
          { 
            id: "5", 
            name: "Cadastro", 
            value: totalCadastros, 
            color: "#8B5CF6" 
          },
          { 
            id: "6", 
            name: "FTD", 
            value: totalFTDs, 
            color: "#10B981" 
          },
          { 
            id: "7", 
            name: "Redepósito", 
            value: Math.max(0, totalDepositos - totalFTDs), 
            color: "#06B6D4" 
          },
        ];
        
        return stages;
      } catch (error) {
        // Em caso de erro, retornar funil vazio
        console.warn('Erro ao buscar funil da API, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Hook para buscar dados de receita
 * Por enquanto retorna vazio pois não há endpoint específico para receita temporal
 * TODO: Quando houver endpoint com dados temporais (por dia/semana/mês), usar ele
 */
export function useRevenueData() {
  return useQuery<RevenueData[]>({
    queryKey: dashboardKeys.revenue(),
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
export function useInsights() {
  return useQuery<Insight[]>({
    queryKey: dashboardKeys.insights(),
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

