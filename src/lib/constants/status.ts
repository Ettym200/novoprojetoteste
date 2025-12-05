// Constantes de status

import type { Status } from '@/types/common';

export const CAMPAIGN_STATUS = {
  ACTIVE: 'active' as const,
  PAUSED: 'paused' as const,
  ENDED: 'ended' as const,
} as const;

export const CAMPAIGN_STATUS_LABELS: Record<Status, string> = {
  [CAMPAIGN_STATUS.ACTIVE]: 'Ativa',
  [CAMPAIGN_STATUS.PAUSED]: 'Pausada',
  [CAMPAIGN_STATUS.ENDED]: 'Finalizada',
};

export const CAMPAIGN_STATUS_COLORS: Record<Status, string> = {
  [CAMPAIGN_STATUS.ACTIVE]: 'bg-emerald-500/10 text-emerald-500',
  [CAMPAIGN_STATUS.PAUSED]: 'bg-amber-500/10 text-amber-500',
  [CAMPAIGN_STATUS.ENDED]: 'bg-muted text-muted-foreground',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  SUPER: 'Super Admin',
  GESTOR: 'Gestor',
  AFILIADO: 'Afiliado',
};

export const USER_ROLE_COLORS: Record<string, string> = {
  SUPER: 'bg-primary text-primary-foreground',
  GESTOR: 'bg-amber-500/10 text-amber-500',
  AFILIADO: 'bg-blue-500/10 text-blue-500',
};

