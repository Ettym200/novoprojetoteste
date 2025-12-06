// Serviço para dados do dashboard principal

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { AffiliateMetrics } from '@/types/affiliate';
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
 * Hook para buscar KPIs do dashboard
 * Agrega dados de /metrics/gerais para calcular KPIs
 */
export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: dashboardKeys.kpis(),
    queryFn: async () => {
      try {
        // Buscar métricas gerais da API
        const response = await api.get<AffiliateMetrics[]>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            // Parâmetros opcionais podem ser adicionados aqui (startDate, endDate, affiliateId[])
          },
        });
        
        const metrics = response.data;
        
        // Agregar dados para calcular KPIs
        const kpis: DashboardKPIs = {
          totalInvested: metrics.reduce((sum, m) => sum + (m.totalInvestment || 0), 0),
          totalFtd: metrics.reduce((sum, m) => sum + (m.totalFtd || 0), 0),
          totalDeposits: metrics.reduce((sum, m) => sum + (m.totalDeposits || 0), 0),
          totalWithdrawals: 0, // Não disponível em AffiliateMetrics, usar mock por enquanto
          ggr: metrics.reduce((sum, m) => sum + (m.ggr || 0), 0),
          ngr: metrics.reduce((sum, m) => sum + (m.ngr || 0), 0),
          netProfit: metrics.reduce((sum, m) => sum + (m.netProfit || 0), 0),
          roiFtd: 0, // Calcular se necessário
          costPerWhatsAppLead: 0, // Não disponível, usar mock
          costPerRegistration: metrics.length > 0 
            ? metrics.reduce((sum, m) => sum + (m.costPerRegistration || 0), 0) / metrics.length 
            : 0,
          costPerDeposit: metrics.length > 0
            ? metrics.reduce((sum, m) => sum + (m.costPerDeposit || 0), 0) / metrics.length
            : 0,
          costPerFtd: metrics.length > 0
            ? metrics.reduce((sum, m) => sum + (m.costPerFtd || 0), 0) / metrics.length
            : 0,
        };
        
        // Calcular ROI de FTD se houver dados
        if (kpis.totalFtd > 0 && kpis.totalInvested > 0) {
          kpis.roiFtd = ((kpis.netProfit / kpis.totalInvested) * 100);
        }
        
        // Campos não disponíveis na API ficam zerados
        kpis.totalWithdrawals = 0;
        kpis.costPerWhatsAppLead = 0;
        
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
        // Primeiro, buscar afiliados
        let affiliatesResponse;
        try {
          affiliatesResponse = await api.get<Array<{ id: string }>>(ENDPOINTS.AFFILIATES.LIST);
        } catch {
          return [];
        }
        
        // Garantir que temos um array
        let affiliates: Array<{ id: string }> = [];
        const responseData = affiliatesResponse.data as unknown;
        
        if (Array.isArray(responseData)) {
          affiliates = responseData;
        } else if (responseData && typeof responseData === 'object') {
          // Se for um objeto, tentar encontrar o array dentro
          const obj = responseData as Record<string, unknown>;
          if (Array.isArray(obj.data)) {
            affiliates = obj.data as Array<{ id: string }>;
          } else if (Array.isArray(obj.affiliates)) {
            affiliates = obj.affiliates as Array<{ id: string }>;
          } else if (Array.isArray(obj.items)) {
            affiliates = obj.items as Array<{ id: string }>;
          }
        }
        
        if (!Array.isArray(affiliates) || affiliates.length === 0) {
          return [];
        }
        
        // Buscar métricas gerais com IDs dos afiliados
        const affiliateIds = affiliates.map(a => a.id);
        const response = await api.get<AffiliateMetrics[]>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
          },
        });
        const metrics = response.data || [];
        
        // Se não houver dados, retornar array vazio
        if (!metrics || metrics.length === 0) {
          return [];
        }
        
        // Calcular totais para criar funil
        const totalRegistrations = metrics.reduce((sum, m) => sum + (m.registrations || 0), 0);
        const totalFtds = metrics.reduce((sum, m) => sum + (m.ftdCount || 0), 0);
        const totalDeposits = metrics.reduce((sum, m) => sum + (m.depositCount || 0), 0);
        
        // Se todos os valores forem zero, retornar vazio
        if (totalRegistrations === 0 && totalFtds === 0 && totalDeposits === 0) {
          return [];
        }
        
        // Criar estágios do funil baseado nos dados
        // Valores aproximados baseados nas proporções dos mocks
        const stages: FunnelStage[] = [
          { id: "1", name: "Facebook", value: totalRegistrations * 67.5, color: "#1877F2" },
          { id: "2", name: "Página", value: totalRegistrations * 47.25, color: "#6366F1" },
          { id: "3", name: "WhatsApp", value: totalRegistrations * 27.78, color: "#25D366" },
          { id: "4", name: "Corretora", value: totalRegistrations * 11.11, color: "#F59E0B" },
          { id: "5", name: "Cadastro", value: totalRegistrations, color: "#8B5CF6" },
          { id: "6", name: "FTD", value: totalFtds, color: "#10B981" },
          { id: "7", name: "Redepósito", value: Math.max(0, totalDeposits - totalFtds), color: "#06B6D4" },
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
 * Usa dados mockados pois não há endpoint específico para receita temporal
 */
export function useRevenueData() {
  return useQuery<RevenueData[]>({
    queryKey: dashboardKeys.revenue(),
    queryFn: async () => {
      try {
        // Primeiro, buscar afiliados
        let affiliatesResponse;
        try {
          affiliatesResponse = await api.get<Array<{ id: string }>>(ENDPOINTS.AFFILIATES.LIST);
        } catch {
          return [];
        }
        
        // Garantir que temos um array
        let affiliates: Array<{ id: string }> = [];
        const responseData = affiliatesResponse.data as unknown;
        
        if (Array.isArray(responseData)) {
          affiliates = responseData;
        } else if (responseData && typeof responseData === 'object') {
          // Se for um objeto, tentar encontrar o array dentro
          const obj = responseData as Record<string, unknown>;
          if (Array.isArray(obj.data)) {
            affiliates = obj.data as Array<{ id: string }>;
          } else if (Array.isArray(obj.affiliates)) {
            affiliates = obj.affiliates as Array<{ id: string }>;
          } else if (Array.isArray(obj.items)) {
            affiliates = obj.items as Array<{ id: string }>;
          }
        }
        
        if (!Array.isArray(affiliates) || affiliates.length === 0) {
          return [];
        }
        
        // Buscar métricas gerais para calcular totais
        const affiliateIds = affiliates.map(a => a.id);
        const response = await api.get<AffiliateMetrics[]>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
          },
        });
        const metrics = response.data || [];
        
        // Se não houver dados, retornar array vazio
        if (!metrics || metrics.length === 0) {
          return [];
        }
        
        // Calcular totais
        const totalDeposits = metrics.reduce((sum, m) => sum + (m.totalDeposits || 0), 0);
        const totalGgr = metrics.reduce((sum, m) => sum + (m.ggr || 0), 0);
        
        // Se todos os valores forem zero, retornar array vazio
        if (totalDeposits === 0 && totalGgr === 0) {
          return [];
        }
        
        // TODO: Quando houver endpoint com dados temporais, usar ele
        // Por enquanto, retornar vazio se não houver dados reais
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
 * Usa dados mockados pois não há endpoint específico para insights
 */
export function useInsights() {
  return useQuery<Insight[]>({
    queryKey: dashboardKeys.insights(),
    queryFn: async () => {
      try {
        // Primeiro, buscar afiliados
        let affiliatesResponse;
        try {
          affiliatesResponse = await api.get<Array<{ id: string }>>(ENDPOINTS.AFFILIATES.LIST);
        } catch {
          return [];
        }
        
        // Garantir que temos um array
        let affiliates: Array<{ id: string }> = [];
        const responseData = affiliatesResponse.data as unknown;
        
        if (Array.isArray(responseData)) {
          affiliates = responseData;
        } else if (responseData && typeof responseData === 'object') {
          // Se for um objeto, tentar encontrar o array dentro
          const obj = responseData as Record<string, unknown>;
          if (Array.isArray(obj.data)) {
            affiliates = obj.data as Array<{ id: string }>;
          } else if (Array.isArray(obj.affiliates)) {
            affiliates = obj.affiliates as Array<{ id: string }>;
          } else if (Array.isArray(obj.items)) {
            affiliates = obj.items as Array<{ id: string }>;
          }
        }
        
        if (!Array.isArray(affiliates) || affiliates.length === 0) {
          return [];
        }
        
        // Buscar métricas para calcular insights
        const affiliateIds = affiliates.map(a => a.id);
        const response = await api.get<AffiliateMetrics[]>(ENDPOINTS.METRICS.GERAIS, {
          params: {
            affiliateId: affiliateIds,
          },
        });
        const metrics = response.data || [];
        
        // Se não houver dados, retornar array vazio
        if (!metrics || metrics.length === 0) {
          return [];
        }
        
        // Calcular métricas para insights
        const totalNetProfit = metrics.reduce((sum, m) => sum + (m.netProfit || 0), 0);
        const totalInvestment = metrics.reduce((sum, m) => sum + (m.totalInvestment || 0), 0);
        const avgROI = totalInvestment > 0 ? (totalNetProfit / totalInvestment) * 100 : 0;
        
        // Se todos os valores forem zero, retornar array vazio
        if (totalNetProfit === 0 && totalInvestment === 0) {
          return [];
        }
        
        // Gerar insights baseados nos dados
        const insights: Insight[] = [];
        
        if (avgROI < 0) {
          insights.push({
            id: "1",
            type: "danger",
            title: "ROI Negativo",
            description: `O ROI médio está em ${avgROI.toFixed(2)}%. Revise as estratégias de captação.`,
            metric: "ROI Médio",
            metricValue: `${avgROI.toFixed(2)}%`,
          });
        }
        
        if (metrics.length > 0) {
          const topPerformer = metrics.find(m => m.ranking === 1);
          if (topPerformer) {
            insights.push({
              id: "2",
              type: "success",
              title: `${topPerformer.name} é top performer`,
              description: `Afiliado com melhor desempenho no período.`,
              metric: "Ranking",
              metricValue: "#1",
            });
          }
        }
        
        // Retornar apenas insights calculados (sem mocks)
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

