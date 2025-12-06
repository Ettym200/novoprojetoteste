// Serviço de Analytics - Integrado com API

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getUserIdFromToken, getUserRoleFromToken } from '@/lib/utils/jwt';
import type { MetricsEngajamentoResponse } from '@/types/metrics';

// Query keys para React Query
export const analyticsKeys = {
  all: ['analytics'] as const,
  engagement: (startDate?: string, endDate?: string) => [...analyticsKeys.all, 'engagement', startDate, endDate] as const,
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
 * Hook para buscar dados de engajamento
 * Busca via /metrics/engajamento com filtros de afiliados e datas
 */
export function useEngagementMetrics(startDate?: string, endDate?: string) {
  return useQuery<MetricsEngajamentoResponse['data']>({
    queryKey: analyticsKeys.engagement(startDate, endDate),
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
        
        // Buscar métricas de engajamento da API
        const response = await api.get<MetricsEngajamentoResponse>(ENDPOINTS.METRICS.ENGAJAMENTO, {
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
        
        return response.data.data;
      } catch (error) {
        console.warn('Erro ao buscar métricas de engajamento, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
}

