// Serviço de Afiliados - Preparado para integração com API

import { useQuery } from '@tanstack/react-query';
import type { AffiliateFilters, Affiliate, AffiliateMetrics } from '@/types/affiliate';
import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getUserIdFromToken, getUserRoleFromToken } from '@/lib/utils/jwt';

// Mocks removidos - sempre retornar zeros/vazios em caso de erro

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
 * Busca via /users/{userId} para obter afiliados do usuário logado
 */
export function useAffiliates(filters?: AffiliateFilters) {
  return useQuery({
    queryKey: affiliateKeys.list(filters),
    queryFn: async () => {
      try {
        const userId = getUserIdFromToken();
        const userRole = getUserRoleFromToken();
        
        if (!userId) {
          console.warn('Não foi possível obter userId do token, retornando afiliados vazios');
          return [];
        }
        
        // Buscar dados do usuário via /users/{userId}
        const userResponse = await api.get<{
          success?: boolean;
          message?: string;
          data?: {
            id: string;
            name?: string;
            email?: string;
            role?: string;
            affiliates?: Array<{
              id: string;
              name: string;
              email?: string;
              [key: string]: unknown;
            }>;
            meusAfiliados?: Array<{
              id: string;
              name: string;
              email?: string;
              afiliados?: Array<{
                id: string;
                name: string;
                email?: string;
                [key: string]: unknown;
              }>;
            }>;
            errors?: string[];
          };
        }>(ENDPOINTS.USERS.DETAIL(userId));
        
        // Verificar se a resposta indica erro
        if (userResponse.data.success === false) {
          console.warn('[useAffiliates] API retornou success: false', userResponse.data.message || userResponse.data.data?.errors);
          return [];
        }
        
        // Verificar se data existe
        if (!userResponse.data.data) {
          console.warn('[useAffiliates] Resposta não contém data');
          return [];
        }
        
        const userData = userResponse.data.data;
        
        // Verificar se há erros
        if (userData.errors && Array.isArray(userData.errors) && userData.errors.length > 0) {
          console.warn('[useAffiliates] API retornou erros:', userData.errors);
          return [];
        }
        
        let data: Affiliate[] = [];
        
        // Extrair afiliados baseado no role
        if (userRole === 'AFILIADO') {
          // AFILIADO: pegar affiliates[]
          if (userData.affiliates && Array.isArray(userData.affiliates) && userData.affiliates.length > 0) {
            data = userData.affiliates.map((aff) => ({
              id: aff.id,
              name: aff.name,
              email: aff.email || '',
              totalInvestment: 0,
              registrations: 0,
              ftds: 0,
              deposits: 0,
              ggr: 0,
              ngr: 0,
              roi: 0,
              conversionRate: 0,
              status: 'average' as const,
            }));
          }
        } else if (userRole === 'GESTOR') {
          // GESTOR: pegar meusAfiliados[].afiliados[] (fazer flat)
          if (userData.meusAfiliados && Array.isArray(userData.meusAfiliados)) {
            const allAffiliates: Affiliate[] = [];
            userData.meusAfiliados.forEach((meuAfiliado) => {
              if (meuAfiliado.afiliados && Array.isArray(meuAfiliado.afiliados)) {
                meuAfiliado.afiliados.forEach((aff) => {
                  allAffiliates.push({
                    id: aff.id,
                    name: aff.name,
                    email: aff.email || '',
                    totalInvestment: 0,
                    registrations: 0,
                    ftds: 0,
                    deposits: 0,
                    ggr: 0,
                    ngr: 0,
                    roi: 0,
                    conversionRate: 0,
                    status: 'average' as const,
                  });
                });
              }
            });
            data = allAffiliates;
          }
        } else {
          // SUPER ou outros: pode usar /affiliates para ver todos
          try {
            const response = await api.get<Affiliate[]>(ENDPOINTS.AFFILIATES.LIST);
            const responseData = response.data as unknown;
            
            if (Array.isArray(responseData)) {
              data = responseData;
            } else if (responseData && typeof responseData === 'object') {
              const obj = responseData as Record<string, unknown>;
              if (Array.isArray(obj.data)) {
                data = obj.data as Affiliate[];
              } else if (Array.isArray(obj.affiliates)) {
                data = obj.affiliates as Affiliate[];
              } else if (Array.isArray(obj.items)) {
                data = obj.items as Affiliate[];
              }
            }
          } catch (error) {
            console.warn('Erro ao buscar afiliados via /affiliates para SUPER:', error);
            return [];
          }
        }
        
        // Aplicar filtros localmente (ou no backend)
        if (filters?.search) {
          const search = filters.search.toLowerCase();
          data = data.filter(
            a => a.name.toLowerCase().includes(search) || 
                 a.email.toLowerCase().includes(search)
          );
        }
        
        return data;
      } catch (error) {
        // Em caso de erro, retornar array vazio
        console.warn('Erro ao buscar afiliados, retornando vazio:', error);
        return [];
      }
    },
    placeholderData: undefined, // Não usar mocks - retornar vazio se erro
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
 * Busca via /users/{userId} para obter afiliados do usuário logado
 */
export function useAffiliateMetrics() {
  return useQuery<AffiliateMetricsWithTotals>({
    queryKey: affiliateKeys.metrics(),
    queryFn: async () => {
      try {
        const userId = getUserIdFromToken();
        const userRole = getUserRoleFromToken();
        
        if (!userId) {
          console.warn('Não foi possível obter userId do token para métricas, retornando zeros');
          return {
            affiliates: [],
            totals: {
              totalAffiliates: 0,
              topPerformers: 0,
              totalGgr: 0,
              totalNgr: 0,
              totalNetProfit: 0,
              totalFtds: 0,
            },
          };
        }
        
        // Buscar dados do usuário via /users/{userId}
        let userResponse;
        try {
          userResponse = await api.get<{
            success?: boolean;
            message?: string;
            data?: {
              id: string;
              name?: string;
              email?: string;
              role?: string;
              affiliates?: Array<{ id: string; [key: string]: unknown }>;
              meusAfiliados?: Array<{
                id: string;
                name?: string;
                email?: string;
                afiliados?: Array<{ id: string; [key: string]: unknown }>;
              }>;
              errors?: string[];
            };
          }>(ENDPOINTS.USERS.DETAIL(userId));
        } catch {
          return {
            affiliates: [],
            totals: {
              totalAffiliates: 0,
              topPerformers: 0,
              totalGgr: 0,
              totalNgr: 0,
              totalNetProfit: 0,
              totalFtds: 0,
            },
          };
        }
        
        // Verificar se a resposta indica erro
        if (userResponse.data.success === false) {
          console.warn('[useAffiliateMetrics] API retornou success: false', userResponse.data.message || userResponse.data.data?.errors);
          return {
            affiliates: [],
            totals: {
              totalAffiliates: 0,
              topPerformers: 0,
              totalGgr: 0,
              totalNgr: 0,
              totalNetProfit: 0,
              totalFtds: 0,
            },
          };
        }
        
        // Verificar se data existe
        if (!userResponse.data.data) {
          console.warn('[useAffiliateMetrics] Resposta não contém data');
          return {
            affiliates: [],
            totals: {
              totalAffiliates: 0,
              topPerformers: 0,
              totalGgr: 0,
              totalNgr: 0,
              totalNetProfit: 0,
              totalFtds: 0,
            },
          };
        }
        
        const userData = userResponse.data.data;
        
        // Verificar se há erros
        if (userData.errors && Array.isArray(userData.errors) && userData.errors.length > 0) {
          console.warn('[useAffiliateMetrics] API retornou erros:', userData.errors);
          return {
            affiliates: [],
            totals: {
              totalAffiliates: 0,
              topPerformers: 0,
              totalGgr: 0,
              totalNgr: 0,
              totalNetProfit: 0,
              totalFtds: 0,
            },
          };
        }
        
        // Extrair lista de afiliados COM NOMES baseado no role (para usar como fallback)
        let affiliatesWithNames: Array<{ id: string; name: string; email?: string }> = [];
        let affiliatesList: Array<{ id: string }> = [];
        
        if (userRole === 'AFILIADO') {
          // AFILIADO: pegar affiliates[]
          if (userData.affiliates && Array.isArray(userData.affiliates) && userData.affiliates.length > 0) {
            affiliatesWithNames = userData.affiliates.map((aff) => ({
              id: String(aff.id || ''),
              name: String(aff.name || ''),
              email: aff.email ? String(aff.email) : undefined,
            }));
            affiliatesList = affiliatesWithNames.map((aff) => ({ id: aff.id }));
          }
        } else if (userRole === 'GESTOR') {
          // GESTOR: pegar meusAfiliados[].afiliados[] (fazer flat)
          if (userData.meusAfiliados && Array.isArray(userData.meusAfiliados)) {
            userData.meusAfiliados.forEach((meuAfiliado) => {
              if (meuAfiliado.afiliados && Array.isArray(meuAfiliado.afiliados)) {
                meuAfiliado.afiliados.forEach((aff) => {
                  affiliatesWithNames.push({
                    id: String(aff.id || ''),
                    name: String(aff.name || ''),
                    email: aff.email ? String(aff.email) : undefined,
                  });
                  affiliatesList.push({ id: String(aff.id || '') });
                });
              }
            });
          }
        } else {
          // SUPER ou outros: pode usar /affiliates para ver todos
          try {
            const response = await api.get<Array<{ id: string; name?: string; email?: string }>>(ENDPOINTS.AFFILIATES.LIST);
            const responseData = response.data as unknown;
            
            if (Array.isArray(responseData)) {
              affiliatesWithNames = responseData.map((aff) => ({
                id: String(aff.id || ''),
                name: String(aff.name || 'Sem nome'),
                email: aff.email ? String(aff.email) : undefined,
              }));
              affiliatesList = affiliatesWithNames.map((aff) => ({ id: aff.id }));
            } else if (responseData && typeof responseData === 'object') {
              const obj = responseData as Record<string, unknown>;
              let dataArray: Array<{ id: string; name?: string; email?: string }> = [];
              if (Array.isArray(obj.data)) {
                dataArray = obj.data;
              } else if (Array.isArray(obj.affiliates)) {
                dataArray = obj.affiliates;
              } else if (Array.isArray(obj.items)) {
                dataArray = obj.items;
              }
              affiliatesWithNames = dataArray.map((aff) => ({
                id: String(aff.id || ''),
                name: String(aff.name || 'Sem nome'),
                email: aff.email ? String(aff.email) : undefined,
              }));
              affiliatesList = affiliatesWithNames.map((aff) => ({ id: aff.id }));
            }
          } catch (error) {
            console.warn('Erro ao buscar afiliados via /affiliates para SUPER:', error);
            return {
              affiliates: [],
              totals: {
                totalAffiliates: 0,
                topPerformers: 0,
                totalGgr: 0,
                totalNgr: 0,
                totalNetProfit: 0,
                totalFtds: 0,
              },
            };
          }
        }
        
        // Se não houver afiliados, retornar zeros
        if (affiliatesList.length === 0) {
          return {
            affiliates: [],
            totals: {
              totalAffiliates: 0,
              topPerformers: 0,
              totalGgr: 0,
              totalNgr: 0,
              totalNetProfit: 0,
              totalFtds: 0,
            },
          };
        }
        
        // Tentar buscar métricas gerais com IDs dos afiliados
        let affiliates: AffiliateMetrics[] = [];
        // Filtrar apenas IDs válidos (formato: começa com números/letras e tem pelo menos 10 caracteres)
        const affiliateIds = affiliatesList
          .map(a => a.id)
          .filter(id => id && typeof id === 'string' && id.length >= 10 && /^[0-9A-Z]+$/i.test(id));
        
        // Se não houver afiliados válidos, usar dados básicos que já temos
        if (affiliateIds.length === 0) {
          console.warn('[useAffiliateMetrics] Nenhum ID de afiliado válido encontrado, usando dados básicos');
          affiliates = affiliatesWithNames.map((aff, index) => ({
            id: aff.id,
            name: aff.name,
            totalInvestment: 0,
            registrations: 0,
            costPerRegistration: 0,
            cpm: 0,
            costPerLink: 0,
            ctr: 0,
            avgDepositValuePerPlayer: 0,
            depositsPerPlayer: 0,
            playersDeposited: 0,
            totalDeposits: 0,
            avgDepositValue: 0,
            costPerDeposit: 0,
            depositCount: 0,
            costPerFtd: 0,
            avgFtdValue: 0,
            totalFtd: 0,
            ftdCount: 0,
            rl: 0,
            ggr: 0,
            ngr: 0,
            netProfit: 0,
            ranking: index + 1,
          }));
        } else {
          try {
            const response = await api.get<AffiliateMetrics[]>(ENDPOINTS.METRICS.GERAIS, {
              params: {
                affiliateId: affiliateIds,
              },
            });
            
            const responseData = response.data as unknown;
            
            // Garantir que temos um array
            if (Array.isArray(responseData)) {
              affiliates = responseData;
            } else if (responseData && typeof responseData === 'object') {
              const obj = responseData as Record<string, unknown>;
              if (Array.isArray(obj.data)) {
                affiliates = obj.data as AffiliateMetrics[];
              } else if (Array.isArray(obj.affiliates)) {
                affiliates = obj.affiliates as AffiliateMetrics[];
              } else if (Array.isArray(obj.items)) {
                affiliates = obj.items as AffiliateMetrics[];
              }
            }
          } catch (metricsError) {
            // Se /metrics/gerais falhar, usar dados básicos que já temos de /users/{userId}
            console.warn('Erro ao buscar métricas de /metrics/gerais, usando dados básicos:', metricsError);
            affiliates = affiliatesWithNames.map((aff, index) => ({
              id: aff.id,
              name: aff.name,
              totalInvestment: 0,
              registrations: 0,
              costPerRegistration: 0,
              cpm: 0,
              costPerLink: 0,
              ctr: 0,
              avgDepositValuePerPlayer: 0,
              depositsPerPlayer: 0,
              playersDeposited: 0,
              totalDeposits: 0,
              avgDepositValue: 0,
              costPerDeposit: 0,
              depositCount: 0,
              costPerFtd: 0,
              avgFtdValue: 0,
              totalFtd: 0,
              ftdCount: 0,
              rl: 0,
              ggr: 0,
              ngr: 0,
              netProfit: 0,
              ranking: index + 1,
            }));
          }
        }
        
        // Calcular totais (ou vir do backend)
        const totals = {
          totalAffiliates: affiliates.length,
          topPerformers: affiliates.filter((a) => a.ranking && a.ranking <= 3).length,
          totalGgr: affiliates.reduce((sum, a) => sum + (a.ggr || 0), 0),
          totalNgr: affiliates.reduce((sum, a) => sum + (a.ngr || 0), 0),
          totalNetProfit: affiliates.reduce((sum, a) => sum + (a.netProfit || 0), 0),
          totalFtds: affiliates.reduce((sum, a) => sum + (a.ftdCount || 0), 0),
        };
        return { affiliates, totals };
      } catch (error) {
        // Em caso de erro, retornar zeros
        console.warn('Erro ao buscar métricas de afiliados, retornando zeros:', error);
        return {
          affiliates: [],
          totals: {
            totalAffiliates: 0,
            topPerformers: 0,
            totalGgr: 0,
            totalNgr: 0,
            totalNetProfit: 0,
            totalFtds: 0,
          },
        };
      }
    },
    placeholderData: undefined, // Não usar mocks - retornar zeros se erro
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
      try {
        const response = await api.get<Affiliate>(ENDPOINTS.AFFILIATES.DETAIL(id));
        return response.data;
      } catch (error) {
        console.warn('Erro ao buscar detalhes do afiliado:', error);
        throw error; // Re-throw para React Query tratar
      }
    },
    placeholderData: undefined, // Não usar mocks
    enabled: !!id,
  });
}
