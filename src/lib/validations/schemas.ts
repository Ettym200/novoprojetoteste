// Schemas de validação Zod para formulários
// Fonte única da verdade para validação frontend e backend

import { z } from 'zod';

/**
 * Schema para validação de filtros de afiliados
 */
export const affiliateFiltersSchema = z.object({
  search: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

/**
 * Schema para validação de filtros de campanhas
 */
export const campaignFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'paused', 'ended', 'all']).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

/**
 * Schema para validação de criação/edição de campanha
 */
export const campaignFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  platform: z.string().min(1, 'Plataforma é obrigatória'),
  status: z.enum(['active', 'paused', 'ended']),
  budget: z.number().positive('Orçamento deve ser positivo').optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine((data) => {
  // Validação: data de fim deve ser após data de início
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
}, {
  message: 'Data de fim deve ser após data de início',
  path: ['endDate'],
});

/**
 * Schema para validação de criação/edição de usuário
 */
export const userFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  role: z.enum(['SUPER', 'ADMIN', 'USER']),
  status: z.enum(['authorized', 'pending', 'blocked']),
});

/**
 * Schema para validação de filtros de jogadores
 */
export const playerFiltersSchema = z.object({
  search: z.string().optional(),
  stage: z.string().optional(),
  affiliate: z.string().optional(),
  campaign: z.string().optional(),
  isChurned: z.boolean().optional(),
});

/**
 * Schema para validação de configurações do sistema
 */
export const settingsFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().min(2).max(5).optional(),
  notifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
});

// Exportar tipos inferidos dos schemas (para uso em src/types/)
export type AffiliateFiltersInput = z.infer<typeof affiliateFiltersSchema>;
export type CampaignFiltersInput = z.infer<typeof campaignFiltersSchema>;
export type CampaignFormInput = z.infer<typeof campaignFormSchema>;
export type UserFormInput = z.infer<typeof userFormSchema>;
export type PlayerFiltersInput = z.infer<typeof playerFiltersSchema>;
export type SettingsFormInput = z.infer<typeof settingsFormSchema>;

// Exportar tipos principais (se necessário criar schemas completos no futuro)
// Por enquanto, os tipos estão em src/types/ e os schemas são apenas para validação de formulários

