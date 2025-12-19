// Cliente API unificado - sempre usa API real

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY, AUTH_COOKIE_KEY } from '@/lib/constants/env';

const API_URL = API_BASE_URL;

// Tipo para query params (suporta arrays)
type QueryParams = Record<string, string | number | boolean | (string | number | boolean)[] | undefined>;

// Helper para construir query string com suporte a arrays
function buildQueryString(params?: QueryParams): string {
  if (!params || Object.keys(params).length === 0) return '';
  
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (Array.isArray(value)) {
      // Para arrays, adiciona múltiplas entradas com a mesma chave
      value.forEach(v => {
        if (v !== undefined && v !== null) {
          searchParams.append(key, String(v));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Real client - axios
let axiosInstance: AxiosInstance | null = null;

const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação se existir
    axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // Buscar token do localStorage ou cookie
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(AUTH_TOKEN_KEY) || 
                     document.cookie.split('; ').find(row => row.startsWith(`${AUTH_COOKIE_KEY}=`))?.split('=')[1];
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Interceptor para tratar erros
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token inválido - limpar e redirecionar para login
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }
  return axiosInstance;
};

const realClient = {
  async get<T>(endpoint: string, config?: { params?: QueryParams }): Promise<{ data: T }> {
    const queryString = config?.params ? buildQueryString(config.params) : '';
    const fullUrl = `${endpoint}${queryString}`;
    const response = await getAxiosInstance().get<T>(fullUrl);
    return { data: response.data };
  },

  async post<T>(endpoint: string, data?: unknown): Promise<{ data: T }> {
    const response = await getAxiosInstance().post<T>(endpoint, data);
    return { data: response.data };
  },

  async put<T>(endpoint: string, data?: unknown): Promise<{ data: T }> {
    const response = await getAxiosInstance().put<T>(endpoint, data);
    return { data: response.data };
  },

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    const response = await getAxiosInstance().delete<T>(endpoint);
    return { data: response.data };
  },
};

// Exportar client
export const api = realClient;

