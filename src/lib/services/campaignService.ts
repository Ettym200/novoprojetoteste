// Serviço de Campanhas - Preparado para integração com API

import { useQuery } from '@tanstack/react-query';
import type { Campaign, CampaignFilters } from '@/types/campaign';
import { mockCampaigns, mockCampaignTrendData } from '@/__mocks__/campaigns';

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
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<Campaign[]>(ENDPOINTS.CAMPAIGNS.BASE);
      // return response.data;
      
      // Mock temporário
      let data = [...mockCampaigns];
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        data = data.filter(c => c.name.toLowerCase().includes(search));
      }
      
      if (filters?.status && filters.status !== 'all') {
        data = data.filter(c => c.status === filters.status);
      }
      
      return data;
    },
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
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet<Campaign>(ENDPOINTS.CAMPAIGNS.DETAIL(id));
      // return response.data;
      
      return mockCampaigns.find(c => c.id === id);
    },
    enabled: !!id,
  });
}

/**
 * Hook para buscar dados de tendência de campanhas
 * TODO: Substituir mock por chamada real quando API estiver pronta
 */
export function useCampaignTrends() {
  return useQuery({
    queryKey: campaignKeys.trends(),
    queryFn: async () => {
      // TODO: Descomentar quando API estiver pronta
      // const response = await apiGet(ENDPOINTS.CAMPAIGNS.TRENDS);
      // return response.data;
      
      return mockCampaignTrendData;
    },
    staleTime: 1000 * 60 * 5,
  });
}

