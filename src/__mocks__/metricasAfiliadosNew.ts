// Mock data para /metrics/afiliados (nova estrutura)
// TODO: Quando a API estiver pronta, remover este mock e usar a API real

import metricasAfiliadosData from './metricasAfiliadosNew.json';
import type { MetricsAfiliadosNewResponse } from '@/types/metricsNew';

export const mockMetricasAfiliadosNew = metricasAfiliadosData as MetricsAfiliadosNewResponse;

