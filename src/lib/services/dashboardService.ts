// Serviço para dados do dashboard principal

import { useQuery } from '@tanstack/react-query';
// import { apiGet } from '@/lib/api/base'; // TODO: Descomentar quando API estiver pronta
// import { ENDPOINTS } from '@/lib/api/endpoints'; // TODO: Descomentar quando API estiver pronta
import {
  mockFunnelStages,
  mockRevenueData,
  mockInsights,
  mockDashboardKPIs,
  type FunnelStage,
  type RevenueData,
  type Insight,
  type DashboardKPIs,
} from '@/__mocks__/dashboard';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: () => [...dashboardKeys.all, 'kpis'] as const,
  funnel: () => [...dashboardKeys.all, 'funnel'] as const,
  revenue: () => [...dashboardKeys.all, 'revenue'] as const,
  insights: () => [...dashboardKeys.all, 'insights'] as const,
};

/**
 * Hook para buscar KPIs do dashboard
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: dashboardKeys.kpis(),
    queryFn: async () => {
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<DashboardKPIs>(ENDPOINTS.ANALYTICS.BASE + '/kpis');
      // return response.data;
      return mockDashboardKPIs;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar estágios do funil
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useFunnelStages() {
  return useQuery<FunnelStage[]>({
    queryKey: dashboardKeys.funnel(),
    queryFn: async () => {
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<FunnelStage[]>(ENDPOINTS.ANALYTICS.BASE + '/funnel');
      // return response.data;
      return mockFunnelStages;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar dados de receita
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useRevenueData() {
  return useQuery<RevenueData[]>({
    queryKey: dashboardKeys.revenue(),
    queryFn: async () => {
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<RevenueData[]>(ENDPOINTS.ANALYTICS.BASE + '/revenue');
      // return response.data;
      return mockRevenueData;
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar insights automáticos
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useInsights() {
  return useQuery<Insight[]>({
    queryKey: dashboardKeys.insights(),
    queryFn: async () => {
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<Insight[]>(ENDPOINTS.ANALYTICS.BASE + '/insights');
      // return response.data;
      return mockInsights;
    },
    staleTime: 1000 * 60 * 5,
  });
}

