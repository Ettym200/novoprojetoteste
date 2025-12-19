// Configuração base do cliente HTTP

import type { ApiError, ApiResponse } from '@/types/api';
import { API_BASE_URL } from '@/lib/constants/env';

export { API_BASE_URL };

/**
 * Sanitiza query keys para prevenir path traversal
 */
export function sanitizeQueryKey(key: unknown[]): string {
  return key
    .filter(Boolean)
    .map(k => encodeURIComponent(String(k)))
    .join('/');
}

/**
 * Constrói URL completa para requisições
 */
export function buildApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
}

/**
 * Trata erros de resposta da API
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorMessage = response.statusText;
  
  try {
    const errorData: ApiError = await response.json();
    errorMessage = errorData.message || errorData.errors 
      ? JSON.stringify(errorData.errors) 
      : response.statusText;
  } catch {
    // Se não conseguir parsear JSON, usar texto
    const text = await response.text();
    errorMessage = text || response.statusText;
  }
  
  const error: ApiError = {
    status: response.status,
    message: errorMessage,
  };
  
  throw error;
}

/**
 * Requisição HTTP genérica
 */
export async function apiRequest<T>(
  method: string,
  url: string,
  data?: unknown,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include' as RequestCredentials,
    ...options,
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(buildApiUrl(url), config);

  if (!response.ok) {
    await handleApiError(response);
  }

  const result: ApiResponse<T> = await response.json();
  return result;
}

/**
 * GET request
 */
export async function apiGet<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  return apiRequest<T>('GET', url, undefined, options);
}

/**
 * POST request
 */
export async function apiPost<T>(url: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
  return apiRequest<T>('POST', url, data, options);
}

/**
 * PUT request
 */
export async function apiPut<T>(url: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
  return apiRequest<T>('PUT', url, data, options);
}

/**
 * DELETE request
 */
export async function apiDelete<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  return apiRequest<T>('DELETE', url, undefined, options);
}

