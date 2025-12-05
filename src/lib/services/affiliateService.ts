// Serviço de Afiliados - Preparado para integração com API

import { useQuery } from '@tanstack/react-query';
import type { AffiliateFilters, Affiliate, AffiliateMetrics } from '@/types/affiliate';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

// Mock data - usado como placeholderData
import { mockAffiliates } from '@/__mocks__/affiliates';
import { mockAffiliateMetrics } from '@/__mocks__/affiliateMetrics';

// Query keys para React Query
export const affiliateKeys = {
  all: ['affiliates'] as const,
  lists: () => [...affiliateKeys.all, 'list'] as const,
  list: (filters?: AffiliateFilters) => [...affiliateKeys.lists(), filters] as const,
  details: () => [...affiliateKeys.all, 'detail'] as const,
  detail: (id: string) => [...affiliateKeys.details(), id] as const,
  metrics: () => [...affiliateKeys.all, 'metrics'] as const,
};

/**
 * Hook para buscar lista de afiliados
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useAffiliates(filters?: AffiliateFilters) {
  return useQuery({
    queryKey: affiliateKeys.list(filters),
    queryFn: async () => {
      const response = await api.get<Affiliate[]>(ENDPOINTS.AFFILIATES.LIST);
      let data = response.data;
      
      // Aplicar filtros localmente (ou no backend)
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        data = data.filter(
          a => a.name.toLowerCase().includes(search) || 
               a.email.toLowerCase().includes(search)
        );
      }
      
      return data;
    },
    placeholderData: mockAffiliates,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Interface para retornar métricas com totais agregados
 */
export interface AffiliateMetricsWithTotals {
  affiliates: AffiliateMetrics[];
  totals: {
    totalAffiliates: number;
    topPerformers: number;
    totalGgr: number;
    totalNgr: number;
    totalNetProfit: number;
    totalFtds: number;
  };
}

/**
 * Hook para buscar métricas de afiliados com totais agregados
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useAffiliateMetrics() {
  const mockTotals = {
    totalAffiliates: mockAffiliateMetrics.length,
    topPerformers: mockAffiliateMetrics.filter((a) => a.ranking && a.ranking <= 3).length,
    totalGgr: mockAffiliateMetrics.reduce((sum, a) => sum + a.ggr, 0),
    totalNgr: mockAffiliateMetrics.reduce((sum, a) => sum + a.ngr, 0),
    totalNetProfit: mockAffiliateMetrics.reduce((sum, a) => sum + a.netProfit, 0),
    totalFtds: mockAffiliateMetrics.reduce((sum, a) => sum + a.ftdCount, 0),
  };

  return useQuery<AffiliateMetricsWithTotals>({
    queryKey: affiliateKeys.metrics(),
    queryFn: async () => {
      const response = await api.get<AffiliateMetrics[]>(ENDPOINTS.AFFILIATES.METRICS);
      const affiliates = response.data;
      
      // Calcular totais (ou vir do backend)
      const totals = {
        totalAffiliates: affiliates.length,
        topPerformers: affiliates.filter((a) => a.ranking && a.ranking <= 3).length,
        totalGgr: affiliates.reduce((sum, a) => sum + a.ggr, 0),
        totalNgr: affiliates.reduce((sum, a) => sum + a.ngr, 0),
        totalNetProfit: affiliates.reduce((sum, a) => sum + a.netProfit, 0),
        totalFtds: affiliates.reduce((sum, a) => sum + a.ftdCount, 0),
      };
      return { affiliates, totals };
    },
    placeholderData: { affiliates: mockAffiliateMetrics, totals: mockTotals },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar detalhes de um afiliado
 */
export function useAffiliate(id: string) {
  return useQuery({
    queryKey: affiliateKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Affiliate>(ENDPOINTS.AFFILIATES.DETAIL(id));
      return response.data;
    },
    placeholderData: mockAffiliates.find(a => a.id === id),
    enabled: !!id,
  });
}

