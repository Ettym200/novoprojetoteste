// Tipos para Dashboard

export interface DashboardKPIs {
  totalInvested: number;
  totalFtd: number;
  totalDeposits: number;
  totalWithdrawals: number;
  ggr: number;
  ngr: number;
  netProfit: number;
  roiFtd: number;
  costPerWhatsAppLead: number;
  costPerRegistration: number;
  costPerDeposit: number;
  costPerFtd: number;
}

export interface FunnelStage {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface RevenueData {
  name: string; // Compatível com ChartDataPoint
  deposits: number;
  withdrawals: number;
  ggr: number;
  [key: string]: string | number; // Compatível com ChartDataPoint (sem undefined)
}

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  metric: string;
  metricValue: string;
}

