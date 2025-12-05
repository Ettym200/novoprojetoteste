// Tipos relacionados a Analytics

export interface ChurnByStage {
  name: string;
  churn: number;
  retained: number;
}

export interface TimeByStage {
  stage: string;
  avgTime: string;
  median: string;
  dropoff: string;
}

export interface AffiliateChurn {
  name: string;
  churnRate: number;
  players: number;
  churned: number;
}

export interface RetentionData {
  name: string;
  d1: number;
  d7: number;
  d30: number;
}

