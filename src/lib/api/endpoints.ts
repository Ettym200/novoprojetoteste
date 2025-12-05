// Constantes de endpoints da API

export const ENDPOINTS = {
  // Afiliados
  AFFILIATES: {
    LIST: '/affiliates',
    DETAIL: (id: string) => `/affiliates/${id}`,
    METRICS: '/affiliates/metrics',
  },
  
  // Campanhas
  CAMPAIGNS: {
    LIST: '/campaigns',
    DETAIL: (id: string) => `/campaigns/${id}`,
    CREATE: '/campaigns',
    UPDATE: (id: string) => `/campaigns/${id}`,
    DELETE: (id: string) => `/campaigns/${id}`,
  },
  
  // Jogadores
  PLAYERS: {
    LIST: '/players',
    DETAIL: (id: string) => `/players/${id}`,
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    CHURN: '/analytics/churn',
    RETENTION: '/analytics/retention',
  },
  
  // Usuários
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;

