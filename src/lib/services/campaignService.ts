// Serviço de Campanhas - Integrado com API

import { useQuery } from '@tanstack/react-query';
import type { Campaign, CampaignFilters } from '@/types/campaign';
import type { ChartDataPoint } from '@/components/dashboard/MetricChart';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getUserIdFromToken, getUserRoleFromToken } from '@/lib/utils/jwt';
import type { MetricsCampanhasResponse } from '@/types/metrics';

// Query keys para React Query
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters?: CampaignFilters, startDate?: string, endDate?: string) => [...campaignKeys.lists(), filters, startDate, endDate] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
  trends: () => [...campaignKeys.all, 'trends'] as const,
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
 * Hook para buscar lista de campanhas
 * Busca via /metrics/campanhas com filtros de afiliados e datas
 */
export function useCampaigns(filters?: CampaignFilters, startDate?: string, endDate?: string) {
  return useQuery<Campaign[]>({
    queryKey: campaignKeys.list(filters, startDate, endDate),
    queryFn: async () => {
      try {
        // Buscar IDs de afiliados baseado no role do usuário
        const affiliateIds = await getAffiliateIds();
        
        if (affiliateIds.length === 0) {
          return [];
        }
        
        // Usar datas fornecidas ou padrão (hoje)
        const today = new Date();
        const finalStartDate = startDate || today.toISOString().split('T')[0]; // YYYY-MM-DD
        const finalEndDate = endDate || today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Buscar métricas de campanhas da API
        const response = await api.get<MetricsCampanhasResponse>(ENDPOINTS.METRICS.CAMPANHAS, {
          params: {
            affiliateId: affiliateIds,
            startDate: finalStartDate,
            endDate: finalEndDate,
          },
        });
        
        // Verificar se a resposta indica erro
        if (response.data.success === false || !response.data.data) {
          return [];
        }
        
        const campaignsData = response.data.data;
        
        // Converter objeto Record<string, CampaignData> para array de Campaign
        // Filtrar IDs inválidos (ex: "{{campaign.id}}")
        const campaigns: Campaign[] = Object.entries(campaignsData)
          .filter(([campaignId]) => {
            // Filtrar IDs inválidos (variáveis de template ou vazios)
            return campaignId && 
                   campaignId !== '{{campaign.id}}' && 
                   !campaignId.startsWith('{{') && 
                   !campaignId.endsWith('}}') &&
                   campaignId.length > 0;
          })
          .map(([campaignId, campaignData]) => {
            // Calcular campos derivados
            const ctr = campaignData.impressions > 0 
              ? (campaignData.clicks / campaignData.impressions) * 100 
              : 0;
            const cpc = campaignData.clicks > 0 
              ? campaignData.spend / campaignData.clicks 
              : 0;
            const avgDepositValue = campaignData.depositCount > 0 
              ? campaignData.depositAmount / campaignData.depositCount 
              : 0;
            
            // Determinar status baseado em spend e impressões
            // Se spend > 0 ou impressions > 0, considera ativo
            const status: Campaign['status'] = campaignData.spend > 0 || campaignData.impressions > 0 
              ? 'active' 
              : 'paused';
            
            // Campos que não vêm da API (revenue, ggr, ngr, roi)
            // Por enquanto, deixar como 0 ou calcular se necessário
            const revenue = 0; // Não disponível na API
            const ggr = 0; // Não disponível na API
            const ngr = 0; // Não disponível na API
            const roi = 0; // Não disponível na API (poderia calcular se tivéssemos revenue)
            
            return {
              id: campaignId,
              name: campaignData.campaign_name || '',
              platform: 'Facebook', // Assumindo Facebook já que não vem na resposta
              status,
              impressions: campaignData.impressions,
              clicks: campaignData.clicks,
              ctr,
              cpc,
              cpm: campaignData.cpm,
              spend: campaignData.spend,
              registrations: campaignData.registeredCount,
              costPerRegistration: campaignData.costPerRegistered,
              ftds: campaignData.ftdCount,
              costPerFtd: campaignData.costPerFtd,
              deposits: campaignData.depositCount,
              totalDeposits: campaignData.depositAmount,
              avgDepositValue,
              revenue,
              ggr,
              ngr,
              roi,
            };
          })
          .filter(campaign => {
            // Aplicar filtros locais
            if (filters?.search) {
              const search = filters.search.toLowerCase();
              if (!campaign.name.toLowerCase().includes(search)) {
                return false;
              }
            }
            
            if (filters?.status && filters.status !== 'all') {
              if (campaign.status !== filters.status) {
                return false;
              }
            }
            
            return true;
          });
        
        return campaigns;
      } catch (error) {
        console.warn('Erro ao buscar campanhas, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
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

