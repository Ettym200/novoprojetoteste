// Mock data para o dashboard principal

export interface FunnelStage {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface RevenueData {
  name: string;
  deposits: number;
  withdrawals: number;
  ggr: number;
  [key: string]: string | number; // Compatível com ChartDataPoint
}

export interface Insight {
  id: string;
  type: "danger" | "warning" | "success" | "tip";
  title: string;
  description: string;
  metric?: string;
  metricValue?: string;
}

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

export const mockFunnelStages: FunnelStage[] = [
  { id: "1", name: "Facebook", value: 25500, color: "#1877F2" },
  { id: "2", name: "Página", value: 17850, color: "#6366F1" },
  { id: "3", name: "WhatsApp", value: 10500, color: "#25D366" },
  { id: "4", name: "Corretora", value: 4200, color: "#F59E0B" },
  { id: "5", name: "Cadastro", value: 378, color: "#8B5CF6" },
  { id: "6", name: "FTD", value: 79, color: "#10B981" },
  { id: "7", name: "Redepósito", value: 35, color: "#06B6D4" },
];

export const mockRevenueData: RevenueData[] = [
  { name: "01/11", deposits: 12500, withdrawals: 3200, ggr: 9300 },
  { name: "05/11", deposits: 15800, withdrawals: 4100, ggr: 11700 },
  { name: "10/11", deposits: 18200, withdrawals: 5500, ggr: 12700 },
  { name: "15/11", deposits: 14300, withdrawals: 3800, ggr: 10500 },
  { name: "20/11", deposits: 22100, withdrawals: 6200, ggr: 15900 },
  { name: "25/11", deposits: 19500, withdrawals: 4800, ggr: 14700 },
  { name: "27/11", deposits: 14722, withdrawals: 2077, ggr: 12645 },
];

export const mockInsights: Insight[] = [
  {
    id: "1",
    type: "danger",
    title: "Queda abrupta no ROI",
    description: "O ROI geral caiu 45% em comparação com o período anterior.",
    metric: "ROI Atual",
    metricValue: "-15.3%",
  },
  {
    id: "2",
    type: "warning",
    title: "Alta taxa de churn no WhatsApp",
    description: "32% dos jogadores abandonaram na etapa de WhatsApp.",
    metric: "Taxa de Churn",
    metricValue: "32%",
  },
  {
    id: "3",
    type: "success",
    title: "Cordeiro atingiu meta",
    description: "Afiliado atingiu 150% da meta mensal.",
    metric: "Meta",
    metricValue: "150%",
  },
  {
    id: "4",
    type: "tip",
    title: "Oportunidade de remarketing",
    description: "Campanhas de remarketing convertem 3x mais.",
  },
];

export const mockDashboardKPIs: DashboardKPIs = {
  totalInvested: 9240.61,
  totalFtd: 9359.64,
  totalDeposits: 14722.95,
  totalWithdrawals: 2077.01,
  ggr: 12645.94,
  ngr: 10413.05,
  netProfit: 1172.44,
  roiFtd: 0.01,
  costPerWhatsAppLead: 13.68,
  costPerRegistration: 28.37,
  costPerDeposit: 101.68,
  costPerFtd: 121.09,
};

