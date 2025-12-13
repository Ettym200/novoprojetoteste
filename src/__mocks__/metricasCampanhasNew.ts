// Mock data para /metrics/campanhas (nova estrutura)
// TODO: Quando a API estiver pronta, remover este mock e usar a API real

import metricasCampanhasData from './metricasCampanhasNew.json';
import type { MetricsCampanhasNewResponse } from '@/types/metricsNew';

export const mockMetricasCampanhasNew = metricasCampanhasData as MetricsCampanhasNewResponse;

