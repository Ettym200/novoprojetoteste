// Constantes de ambiente e configuração

/**
 * URL base da API
 * Obrigatório - deve ser definido em .env.local
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL não está definida. Por favor, configure a variável de ambiente no arquivo .env.local'
  );
}

/**
 * Chave usada para armazenar o token de autenticação no localStorage
 * Padrão: 'auth_token'
 */
export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';

/**
 * Chave usada para armazenar o token de autenticação em cookies
 * Padrão: 'token'
 */
export const AUTH_COOKIE_KEY = process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY || 'token';

/**
 * Ambiente atual
 */
export const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Verifica se está em produção
 */
export const IS_PRODUCTION = NODE_ENV === 'production';

/**
 * Verifica se está em desenvolvimento
 */
export const IS_DEVELOPMENT = NODE_ENV === 'development';
