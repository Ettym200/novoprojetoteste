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
 * Hook para buscar métricas de afiliados
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useAffiliateMetrics() {
  return useQuery({
    queryKey: affiliateKeys.metrics(),
    queryFn: async () => {
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<AffiliateMetrics[]>(ENDPOINTS.AFFILIATES.METRICS);
      // return response.data;
      
      // Mock temporário - usar dados completos de métricas
      return mockAffiliateMetrics;
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

