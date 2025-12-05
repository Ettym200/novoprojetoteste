"use client"

import { useState } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import FunnelSankey from "@/components/dashboard/FunnelSankey";
import MetricChart from "@/components/dashboard/MetricChart";
import InsightCard, { type Insight } from "@/components/dashboard/InsightCard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Target,
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  BarChart3,
  PiggyBank,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

// todo: remove mock functionality
const funnelStages = [
  { id: "1", name: "Facebook", value: 25500, color: "#1877F2" },
  { id: "2", name: "Página", value: 17850, color: "#6366F1" },
  { id: "3", name: "WhatsApp", value: 10500, color: "#25D366" },
  { id: "4", name: "Corretora", value: 4200, color: "#F59E0B" },
  { id: "5", name: "Cadastro", value: 378, color: "#8B5CF6" },
  { id: "6", name: "FTD", value: 79, color: "#10B981" },
  { id: "7", name: "Redepósito", value: 35, color: "#06B6D4" },
];

// todo: remove mock functionality
const revenueData = [
  { name: "01/11", deposits: 12500, withdrawals: 3200, ggr: 9300 },
  { name: "05/11", deposits: 15800, withdrawals: 4100, ggr: 11700 },
  { name: "10/11", deposits: 18200, withdrawals: 5500, ggr: 12700 },
  { name: "15/11", deposits: 14300, withdrawals: 3800, ggr: 10500 },
  { name: "20/11", deposits: 22100, withdrawals: 6200, ggr: 15900 },
  { name: "25/11", deposits: 19500, withdrawals: 4800, ggr: 14700 },
  { name: "27/11", deposits: 14722, withdrawals: 2077, ggr: 12645 },
];

// todo: remove mock functionality
const insights: Insight[] = [
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

export default function DashboardGeral() {
  const [, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    console.log("Refreshing dashboard data...");
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Dashboard Geral"
        subtitle="Visão executiva da operação"
        onRefresh={handleRefresh}
        showSearch
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-4">Financeiro Resumido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              title="Total Investido"
              value="R$ 9.240,61"
              change={-56.48}
              icon={<DollarSign className="w-5 h-5 text-primary" />}
              iconBgClass="bg-primary/10"
            />
            <KpiCard
              title="Total de FTD"
              value="R$ 9.359,64"
              change={-81.84}
              icon={<Target className="w-5 h-5 text-emerald-500" />}
              iconBgClass="bg-emerald-500/10"
            />
            <KpiCard
              title="Total de Depósitos"
              value="R$ 14.722,95"
              change={-82.89}
              icon={<ArrowDownCircle className="w-5 h-5 text-blue-500" />}
              iconBgClass="bg-blue-500/10"
            />
            <KpiCard
              title="Total de Saques"
              value="R$ 2.077,01"
              change={-97.19}
              icon={<Wallet className="w-5 h-5 text-amber-500" />}
              iconBgClass="bg-amber-500/10"
            />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              title="GGR"
              value="R$ 12.645,94"
              change={256.82}
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
              iconBgClass="bg-emerald-500/10"
            />
            <KpiCard
              title="NGR"
              value="R$ 10.413,05"
              change={-199.57}
              icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
              iconBgClass="bg-purple-500/10"
            />
            <KpiCard
              title="Lucro Líquido"
              value="R$ 1.172,44"
              change={-103.70}
              icon={<PiggyBank className="w-5 h-5 text-cyan-500" />}
              iconBgClass="bg-cyan-500/10"
            />
            <KpiCard
              title="ROI de FTD"
              value="0,01%"
              change={-99.09}
              icon={<Users className="w-5 h-5 text-rose-500" />}
              iconBgClass="bg-rose-500/10"
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Eficiência de Captação</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              title="Custo por Lead WhatsApp"
              value="R$ 13,68"
              change={-30.62}
              icon={<Clock className="w-5 h-5 text-green-500" />}
              iconBgClass="bg-green-500/10"
            />
            <KpiCard
              title="Custo por Cadastro"
              value="R$ 28,37"
              change={-23.53}
              icon={<Users className="w-5 h-5 text-blue-500" />}
              iconBgClass="bg-blue-500/10"
            />
            <KpiCard
              title="Custo por Depósito"
              value="R$ 101,68"
              change={-3.97}
              icon={<DollarSign className="w-5 h-5 text-amber-500" />}
              iconBgClass="bg-amber-500/10"
            />
            <KpiCard
              title="Custo por FTD"
              value="R$ 121,09"
              change={-26.83}
              icon={<Target className="w-5 h-5 text-red-500" />}
              iconBgClass="bg-red-500/10"
            />
          </div>
        </section>

        <section>
          <FunnelSankey stages={funnelStages} title="Funil de Conversão" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricChart
            title="Receitas e Saques"
            data={revenueData}
            type="area"
            dataKeys={[
              { key: "deposits", color: "hsl(var(--chart-3))", name: "Depósitos" },
              { key: "withdrawals", color: "hsl(var(--destructive))", name: "Saques" },
              { key: "ggr", color: "hsl(var(--chart-1))", name: "GGR" },
            ]}
          />
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Insights Automáticos
            </h3>
            <div className="space-y-3">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onClick={(i) => console.log("Insight clicked:", i.title)}
                />
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
