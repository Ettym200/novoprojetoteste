// Serviço para dados do dashboard principal

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
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
      const response = await api.get<DashboardKPIs>('/dashboard/kpis');
      return response.data;
    },
    placeholderData: mockDashboardKPIs,
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
      const response = await api.get<FunnelStage[]>('/dashboard/funnel');
      return response.data;
    },
    placeholderData: mockFunnelStages,
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
      const response = await api.get<RevenueData[]>('/dashboard/revenue');
      return response.data;
    },
    placeholderData: mockRevenueData,
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
      const response = await api.get<Insight[]>('/dashboard/insights');
      return response.data;
    },
    placeholderData: mockInsights,
    staleTime: 1000 * 60 * 5,
  });
}

