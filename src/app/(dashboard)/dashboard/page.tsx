"use client"

import { useState, useMemo } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import FunnelSankey from "@/components/dashboard/FunnelSankey";
import MetricChart from "@/components/dashboard/MetricChart";
import InsightCard from "@/components/dashboard/InsightCard";
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
import { useDashboardKPIs, useFunnelStages, useRevenueData, useInsights } from "@/lib/services/dashboardService";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { format } from "date-fns";

export default function DashboardGeral() {
  const [, setRefreshing] = useState(false);
  
  // Estado para o range de datas selecionado
  const today = new Date();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: today,
    to: today,
  });

  // Converter datas para formato YYYY-MM-DD
  const startDate = useMemo(() => format(dateRange.from, 'yyyy-MM-dd'), [dateRange.from]);
  const endDate = useMemo(() => format(dateRange.to, 'yyyy-MM-dd'), [dateRange.to]);

  const { data: kpis, isLoading: isLoadingKPIs, isError: isErrorKPIs } = useDashboardKPIs(startDate, endDate);
  const { data: funnelStages = [], isLoading: isLoadingFunnel } = useFunnelStages(startDate, endDate);
  const { data: revenueData = [], isLoading: isLoadingRevenue } = useRevenueData(startDate, endDate);
  const { data: insights = [], isLoading: isLoadingInsights } = useInsights(startDate, endDate);

  const isLoading = isLoadingKPIs || isLoadingFunnel || isLoadingRevenue || isLoadingInsights;
  const isError = isErrorKPIs;

  const handleRefresh = () => {
    setRefreshing(true);
    // TODO: Implementar refresh real quando API estiver pronta
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader
          title="Dashboard Geral"
          subtitle="Visão executiva da operação"
          onRefresh={handleRefresh}
          showSearch
        />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader
          title="Dashboard Geral"
          subtitle="Visão executiva da operação"
          onRefresh={handleRefresh}
          showSearch
        />
        <div className="flex-1 flex items-center justify-center">
          <ErrorMessage message="Erro ao carregar dados do dashboard" />
        </div>
      </div>
    );
  }

  // Icon mapping for KpiCard
  const iconMap = {
    DollarSign: <DollarSign className="w-5 h-5 text-primary" />,
    Target: <Target className="w-5 h-5 text-emerald-500" />,
    ArrowDownCircle: <ArrowDownCircle className="w-5 h-5 text-blue-500" />,
    Wallet: <Wallet className="w-5 h-5 text-amber-500" />,
    TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    BarChart3: <BarChart3 className="w-5 h-5 text-purple-500" />,
    PiggyBank: <PiggyBank className="w-5 h-5 text-cyan-500" />,
    Users: <Users className="w-5 h-5 text-rose-500" />,
    Clock: <Clock className="w-5 h-5 text-green-500" />,
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Dashboard Geral"
        subtitle="Visão executiva da operação"
        onRefresh={handleRefresh}
        showSearch
        showDatePicker
        onDateRangeChange={(range) => setDateRange(range)}
      />

      <div className="flex-1 overflow-auto p-3 md:p-6 space-y-4 md:space-y-6">
        <section>
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Financeiro Resumido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <KpiCard
              title="Total Investido"
              value={kpis?.totalInvested || 0}
              format="currency"
              change={-56.48}
              icon={iconMap.DollarSign}
              iconBgClass="bg-primary/10"
            />
            <KpiCard
              title="Total de FTD"
              value={kpis?.totalFtd || 0}
              format="currency"
              change={-81.84}
              icon={iconMap.Target}
              iconBgClass="bg-emerald-500/10"
            />
            <KpiCard
              title="Total de Depósitos"
              value={kpis?.totalDeposits || 0}
              format="currency"
              change={-82.89}
              icon={iconMap.ArrowDownCircle}
              iconBgClass="bg-blue-500/10"
            />
            <KpiCard
              title="Total de Saques"
              value={kpis?.totalWithdrawals || 0}
              format="currency"
              change={-97.19}
              icon={iconMap.Wallet}
              iconBgClass="bg-amber-500/10"
            />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <KpiCard
              title="GGR"
              value={kpis?.ggr || 0}
              format="currency"
              change={256.82}
              icon={iconMap.TrendingUp}
              iconBgClass="bg-emerald-500/10"
            />
            <KpiCard
              title="NGR"
              value={kpis?.ngr || 0}
              format="currency"
              change={-199.57}
              icon={iconMap.BarChart3}
              iconBgClass="bg-purple-500/10"
            />
            <KpiCard
              title="Lucro Líquido"
              value={kpis?.netProfit || 0}
              format="currency"
              change={-103.70}
              icon={iconMap.PiggyBank}
              iconBgClass="bg-cyan-500/10"
            />
            <KpiCard
              title="ROI de FTD"
              value={kpis?.roiFtd || 0}
              format="percentage"
              change={-99.09}
              icon={iconMap.Users}
              iconBgClass="bg-rose-500/10"
            />
          </div>
        </section>

        <section>
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Eficiência de Captação</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <KpiCard
              title="Custo por Lead WhatsApp"
              value={kpis?.costPerWhatsAppLead || 0}
              format="currency"
              change={-30.62}
              icon={iconMap.Clock}
              iconBgClass="bg-green-500/10"
            />
            <KpiCard
              title="Custo por Cadastro"
              value={kpis?.costPerRegistration || 0}
              format="currency"
              change={-23.53}
              icon={iconMap.Users}
              iconBgClass="bg-blue-500/10"
            />
            <KpiCard
              title="Custo por Depósito"
              value={kpis?.costPerDeposit || 0}
              format="currency"
              change={-3.97}
              icon={iconMap.DollarSign}
              iconBgClass="bg-amber-500/10"
            />
            <KpiCard
              title="Custo por FTD"
              value={kpis?.costPerFtd || 0}
              format="currency"
              change={-26.83}
              icon={iconMap.Target}
              iconBgClass="bg-red-500/10"
            />
          </div>
        </section>

        <section>
          {funnelStages && funnelStages.length > 0 && (
            <FunnelSankey stages={funnelStages} title="Funil de Conversão" />
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {revenueData && (
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
          )}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Insights Automáticos
            </h3>
            <div className="space-y-3">
              {insights?.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onClick={() => {
                    // TODO: Implementar ação quando insight for clicado
                  }}
                />
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

