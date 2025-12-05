// Tipos relacionados a Campanhas

import type { Status, FilterParams } from './common';

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: Status;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  spend: number;
  registrations: number;
  costPerRegistration: number;
  ftds: number;
  costPerFtd: number;
  deposits: number;
  totalDeposits: number;
  avgDepositValue: number;
  revenue: number;
  ggr: number;
  ngr: number;
  roi: number;
}

export interface CampaignFilters extends FilterParams {
  search?: string;
  status?: Status | 'all';
}

