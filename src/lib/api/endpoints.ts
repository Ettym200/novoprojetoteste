// Constantes de endpoints da API

export const ENDPOINTS = {
  // Afiliados
  AFFILIATES: {
    LIST: '/affiliates',
    BY_ID: '/affiliates/by',
    DETAIL: (id: string) => `/affiliates/by?id=${id}`,
    CREATE: '/affiliates/create',
    UPDATE: (id: string) => `/affiliates/update/${id}`,
    METRICS: '/affiliates/metrics', // Mantido para compatibilidade
  },
  
  // Métricas
  METRICS: {
    GERAIS: '/metrics/gerais',
    ENGAJAMENTO: '/metrics/engajamento',
    CAMPANHAS: '/metrics/campanhas',
  },
  
  // Campanhas
  CAMPAIGNS: {
    LIST: '/campaigns',
    DETAIL: (id: string) => `/campaigns/${id}`,
    CREATE: '/campaigns',
    UPDATE: (id: string) => `/campaigns/${id}`,
    DELETE: (id: string) => `/campaigns/${id}`,
  },
  
  // Jogadores/Clientes
  PLAYERS: {
    LIST: '/players',
    DETAIL: (id: string) => `/players/${id}`,
  },
  CLIENTS: {
    LIST: '/clients',
  },
  
  // Analytics (mantido para compatibilidade)
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    CHURN: '/analytics/churn',
    RETENTION: '/analytics/retention',
  },
  
  // Autenticação
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    RESET_PASSWORD: '/auth/reset-pass',
  },
  
  // Usuários
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users/create',
    UPDATE: (id: string) => `/users/update/${id}`,
    DELETE: (id: string) => `/users/delete/${id}`,
    RESTORE: (id: string) => `/users/restore/${id}`,
  },
  
  // Configurações
  CONFIGS: {
    LIST: '/configs',
    BY_ID: '/configuracoes',
    CREATE: '/configuracoes/create',
  },
  
  // Pixels
  PIXELS: {
    LIST: '/pixels',
    BY_ID: '/pixels/by',
    BY_AFFILIATE: '/pixels/by-affiliate',
    CREATE: '/pixels/create',
    UPDATE: (id: string) => `/pixels/update/${id}`,
    DELETE: (id: string) => `/pixels/delete/${id}`,
  },
} as const;

