// Tipos relacionados a Afiliados

export interface AffiliateMetrics {
  id: string;
  name: string;
  totalInvestment: number;
  registrations: number;
  costPerRegistration: number;
  cpm: number;
  costPerLink: number;
  ctr: number;
  avgDepositValuePerPlayer: number;
  depositsPerPlayer: number;
  playersDeposited: number;
  totalDeposits: number;
  avgDepositValue: number;
  costPerDeposit: number;
  depositCount: number;
  costPerFtd: number;
  avgFtdValue: number;
  totalFtd: number;
  ftdCount: number;
  rl: number;
  ggr: number;
  ngr: number;
  netProfit: number;
  ranking?: number;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  totalInvestment: number;
  registrations: number;
  ftds: number;
  deposits: number;
  ggr: number;
  ngr: number;
  roi: number;
  conversionRate: number;
  ranking?: number;
  status: 'top' | 'average' | 'below';
}

export interface AffiliateFilters extends FilterParams {
  search?: string;
}

