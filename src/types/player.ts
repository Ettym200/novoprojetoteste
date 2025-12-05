// Tipos relacionados a Jogadores

export interface Player {
  id: string;
  name: string;
  email: string;
  currentStage: string;
  stageColor: string;
  timeInFunnel: string;
  totalDeposits: number;
  depositCount: number;
  totalWithdrawals: number;
  withdrawalCount: number;
  affiliate: string;
  campaign: string;
  churnDate?: string;
  isChurned: boolean;
}

export interface PlayerFilters extends FilterParams {
  search?: string;
  stage?: string;
  churnStatus?: 'all' | 'active' | 'churned';
}

