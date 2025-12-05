// Cliente API unificado - suporta modo mock e real
// Controlado via NEXT_PUBLIC_API_MOCK env var

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { mockAffiliates } from '@/__mocks__/affiliates';
import { mockAffiliateMetrics } from '@/__mocks__/affiliateMetrics';
import { mockCampaigns, mockCampaignTrendData } from '@/__mocks__/campaigns';
import {
  mockDashboardKPIs,
  mockFunnelStages,
  mockRevenueData,
  mockInsights,
} from '@/__mocks__/dashboard';

const IS_MOCK = process.env.NEXT_PUBLIC_API_MOCK === 'true';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Delay aleatório 200-600ms
const randomDelay = () => Math.floor(Math.random() * 400) + 200;

// 5% chance de erro
const shouldSimulateError = () => Math.random() < 0.05;

// Simular erro de rede ou 401
const simulateError = () => {
  if (Math.random() < 0.5) {
    throw new Error('Network Error');
  }
  const error = new Error('Unauthorized') as AxiosError;
  error.response = {
    status: 401,
    statusText: 'Unauthorized',
    data: { message: 'Unauthorized' },
    headers: {},
    config: {} as AxiosRequestConfig,
  };
  throw error;
};

// Mock client - simula chamadas API
const mockClient = {
  async get<T>(endpoint: string): Promise<{ data: T }> {
    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));

    // 5% chance de erro
    if (shouldSimulateError()) {
      simulateError();
    }

    // Mapear endpoints para mocks
    if (endpoint.includes('/affiliates/metrics')) {
      return { data: mockAffiliateMetrics as T };
    }
    if (endpoint.includes('/affiliates')) {
      return { data: mockAffiliates as T };
    }
    if (endpoint.includes('/campaigns/trends')) {
      return { data: mockCampaignTrendData as T };
    }
    if (endpoint.includes('/campaigns')) {
      return { data: mockCampaigns as T };
    }
    if (endpoint.includes('/dashboard/kpis')) {
      return { data: mockDashboardKPIs as T };
    }
    if (endpoint.includes('/dashboard/funnel')) {
      return { data: mockFunnelStages as T };
    }
    if (endpoint.includes('/dashboard/revenue')) {
      return { data: mockRevenueData as T };
    }
    if (endpoint.includes('/dashboard/insights')) {
      return { data: mockInsights as T };
    }

    // Fallback
    return { data: [] as T };
  },

  async post<T>(endpoint: string, data?: unknown): Promise<{ data: T }> {
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
    if (shouldSimulateError()) {
      simulateError();
    }
    return { data: data as T };
  },
};

// Real client - axios
let axiosInstance: AxiosInstance | null = null;

const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }
  return axiosInstance;
};

const realClient = {
  async get<T>(endpoint: string): Promise<{ data: T }> {
    const response = await getAxiosInstance().get<T>(endpoint);
    return { data: response.data };
  },

  async post<T>(endpoint: string, data?: unknown): Promise<{ data: T }> {
    const response = await getAxiosInstance().post<T>(endpoint, data);
    return { data: response.data };
  },
};

// Exportar client baseado em env
export const api = IS_MOCK ? mockClient : realClient;

