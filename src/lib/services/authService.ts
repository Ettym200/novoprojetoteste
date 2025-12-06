// Serviço de Autenticação

import { api } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
  // Compatibilidade com formato antigo
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Realiza login do usuário
 */
export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.SIGNIN, {
      email: credentials.email,
      password: credentials.password,
    });

    const data = response.data;

    // Extrair token da estrutura de resposta
    const token = data.data?.token || data.token;
    
    // Salvar token se existir
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }

    // Retornar no formato esperado pelo componente
    return {
      success: data.success,
      message: data.message,
      token: token,
      user: data.data?.user || data.user,
    };
  } catch (error: unknown) {
    // Tratar erro e relançar com mensagem amigável
    if (error instanceof Error) {
      throw new Error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
    throw new Error('Erro ao fazer login. Tente novamente.');
  }
}

/**
 * Realiza cadastro de novo usuário
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.SIGNUP, {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    const authData = response.data;

    // Extrair token da estrutura de resposta
    const token = authData.data?.token || authData.token;
    
    // Salvar token se existir
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }

    // Retornar no formato esperado pelo componente
    return {
      success: authData.success,
      message: authData.message,
      token: token,
      user: authData.data?.user || authData.user,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Erro ao criar conta. Tente novamente.');
    }
    throw new Error('Erro ao criar conta. Tente novamente.');
  }
}

/**
 * Realiza logout do usuário
 */
export function signOut(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  }
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

/**
 * Obtém o token de autenticação
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

