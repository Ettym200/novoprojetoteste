// Serviço de Afiliados - Preparado para integração com API

import { useQuery } from '@tanstack/react-query';
import type { AffiliateFilters } from '@/types/affiliate';

// Mock data - será substituído quando API estiver pronta
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
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<Affiliate[]>(ENDPOINTS.AFFILIATES.LIST);
      // return response.data;
      
      // Mock temporário
      let data = [...mockAffiliates];
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        data = data.filter(
          a => a.name.toLowerCase().includes(search) || 
               a.email.toLowerCase().includes(search)
        );
      }
      
      return data;
    },
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
  return useQuery<AffiliateMetricsWithTotals>({
    queryKey: affiliateKeys.metrics(),
    queryFn: async () => {
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<AffiliateMetrics[]>(ENDPOINTS.AFFILIATES.METRICS);
      // const affiliates = response.data;
      // 
      // // Calcular totais no backend ou aqui
      // const totals = {
      //   totalAffiliates: affiliates.length,
      //   topPerformers: affiliates.filter((a) => a.ranking && a.ranking <= 3).length,
      //   totalGgr: affiliates.reduce((sum, a) => sum + a.ggr, 0),
      //   totalNgr: affiliates.reduce((sum, a) => sum + a.ngr, 0),
      //   totalNetProfit: affiliates.reduce((sum, a) => sum + a.netProfit, 0),
      //   totalFtds: affiliates.reduce((sum, a) => sum + a.ftdCount, 0),
      // };
      // return { affiliates, totals };
      
      // Mock temporário - calcular totais
      const affiliates = mockAffiliateMetrics;
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
      // TODO: Substituir por chamada real
      // const response = await apiGet<Affiliate>(ENDPOINTS.AFFILIATES.DETAIL(id));
      // return response.data;
      
      return mockAffiliates.find(a => a.id === id);
    },
    enabled: !!id,
  });
}

