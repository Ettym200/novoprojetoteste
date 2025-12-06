// Serviço de Campanhas - Preparado para integração com API

import { useQuery } from '@tanstack/react-query';
import type { Campaign, CampaignFilters } from '@/types/campaign';
import type { ChartDataPoint } from '@/components/dashboard/MetricChart';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
// Mocks removidos - sempre retornar zeros/vazios em caso de erro

// Query keys para React Query
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters?: CampaignFilters) => [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
  trends: () => [...campaignKeys.all, 'trends'] as const,
};

/**
 * Hook para buscar lista de campanhas
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useCampaigns(filters?: CampaignFilters) {
  return useQuery<Campaign[]>({
    queryKey: campaignKeys.list(filters),
    queryFn: async () => {
      try {
        const response = await api.get<Campaign[]>(ENDPOINTS.CAMPAIGNS.LIST);
        let data = response.data || [];
        
        // Aplicar filtros localmente (ou no backend)
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          data = data.filter(c => c.name.toLowerCase().includes(search));
        }
        
        if (filters?.status && filters.status !== 'all') {
          data = data.filter(c => c.status === filters.status);
        }
        
        return data;
      } catch (error) {
        console.warn('Erro ao buscar campanhas, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar detalhes de uma campanha
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useCampaign(id: string) {
  return useQuery<Campaign | undefined>({
    queryKey: campaignKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await api.get<Campaign>(ENDPOINTS.CAMPAIGNS.DETAIL(id));
        return response.data;
      } catch (error) {
        console.warn('Erro ao buscar campanha, retornando undefined:', error);
        return undefined;
      }
    },
    placeholderData: undefined, // Não usar mocks
    enabled: !!id,
  });
}

/**
 * Hook para buscar dados de tendência de campanhas
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useCampaignTrends() {
  return useQuery<ChartDataPoint[]>({
    queryKey: campaignKeys.trends(),
    queryFn: async () => {
      try {
        const response = await api.get<ChartDataPoint[]>(ENDPOINTS.CAMPAIGNS.LIST + '/trends');
        return response.data || [];
      } catch (error) {
        console.warn('Erro ao buscar tendências de campanhas, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5,
  });
}

