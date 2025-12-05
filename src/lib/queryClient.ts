import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient configurado com boas práticas de segurança e performance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos - dados ficam fresh por 5 min
      gcTime: 1000 * 60 * 30, // 30 minutos - cache mantido por 30 min (antes era cacheTime)
      retry: 2, // Retry até 2 vezes em caso de erro
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
      refetchOnWindowFocus: true, // Atualiza ao voltar para a aba
      refetchOnReconnect: true, // Atualiza ao reconectar
      refetchOnMount: true, // Atualiza ao montar componente
    },
    mutations: {
      retry: 1, // Retry uma vez para mutations
      retryDelay: 1000,
    },
  },
});
