"use client"

import { useState, useMemo } from "react";
import CampaignTable from "@/components/dashboard/CampaignTable";
import type { Campaign } from "@/types/campaign";
import KpiCard from "@/components/dashboard/KpiCard";
import MetricChart from "@/components/dashboard/MetricChart";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Megaphone, Eye, MousePointer, DollarSign, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCampaigns, useCampaignTrends } from "@/lib/services/campaignService";
import { formatCurrency, formatNumber, formatPercentage, safeDivide } from "@/lib/utils/format";
import { CAMPAIGN_STATUS_COLORS, CAMPAIGN_STATUS_LABELS } from "@/lib/constants";
import { calculateConversionRate } from "@/lib/utils/metrics";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  const { data: campaigns = [], isLoading, isError } = useCampaigns();
  const { data: campaignTrendData = [] } = useCampaignTrends();

  const { totalImpressions, totalSpend, totalFtds, avgCtr, avgCostPerFtd, activeCampaigns } = useMemo(() => {
    const impressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const clicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const spend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const ftds = campaigns.reduce((sum, c) => sum + c.ftds, 0);
    
    return {
      totalImpressions: impressions,
      totalSpend: spend,
      totalFtds: ftds,
      avgCtr: clicks > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00",
      avgCostPerFtd: ftds > 0 ? spend / ftds : 0,
      activeCampaigns: campaigns.filter(c => c.status === "active").length,
    };
  }, [campaigns]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader
          title="Campanhas"
          subtitle="Gestão e análise de campanhas de tráfego"
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
          title="Campanhas"
          subtitle="Gestão e análise de campanhas de tráfego"
        />
        <div className="flex-1 flex items-center justify-center">
          <ErrorMessage message="Erro ao carregar dados das campanhas" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Campanhas"
        subtitle="Gestão e análise de campanhas de tráfego"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard
              title="Campanhas Ativas"
              value={activeCampaigns.toString()}
              icon={<Megaphone className="w-5 h-5 text-primary" />}
              iconBgClass="bg-primary/10"
            />
            <KpiCard
              title="Impressões"
              value={(totalImpressions / 1000).toFixed(0) + "K"}
              icon={<Eye className="w-5 h-5 text-blue-500" />}
              iconBgClass="bg-blue-500/10"
            />
            <KpiCard
              title="CTR Médio"
              value={avgCtr + "%"}
              icon={<MousePointer className="w-5 h-5 text-emerald-500" />}
              iconBgClass="bg-emerald-500/10"
            />
            <KpiCard
              title="Investimento"
              value={formatCurrency(totalSpend)}
              icon={<DollarSign className="w-5 h-5 text-amber-500" />}
              iconBgClass="bg-amber-500/10"
            />
            <KpiCard
              title="Total FTDs"
              value={totalFtds.toString()}
              icon={<Target className="w-5 h-5 text-purple-500" />}
              iconBgClass="bg-purple-500/10"
            />
            <KpiCard
              title="Custo/FTD Médio"
              value={formatCurrency(avgCostPerFtd)}
              icon={<TrendingUp className="w-5 h-5 text-cyan-500" />}
              iconBgClass="bg-cyan-500/10"
            />
          </div>
        </section>

        <section>
          <MetricChart
            title="Tendência Semanal"
            data={campaignTrendData}
            type="line"
            dataKeys={[
              { key: "ftds", color: "hsl(var(--chart-1))", name: "FTDs" },
              { key: "spend", color: "hsl(var(--chart-2))", name: "Investimento (R$)" },
            ]}
            height={220}
          />
        </section>

        <section>
          <CampaignTable
            campaigns={campaigns}
            onViewDetails={(campaign) => setSelectedCampaign(campaign)}
                onNewCampaign={() => {
                  // TODO: Implementar criação de nova campanha
                }}
          />
        </section>

        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="modal-campaign-detail">
            <DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-xl">{selectedCampaign?.name}</DialogTitle>
                  <DialogDescription>{selectedCampaign?.platform}</DialogDescription>
                </div>
                {selectedCampaign && (
                  <Badge className={cn("shrink-0", CAMPAIGN_STATUS_COLORS[selectedCampaign.status])}>
                    {CAMPAIGN_STATUS_LABELS[selectedCampaign.status]}
                  </Badge>
                )}
              </div>
            </DialogHeader>

            {selectedCampaign && (
              <Tabs defaultValue="traffic" className="mt-4">
                <TabsList>
                  <TabsTrigger value="traffic">Tráfego</TabsTrigger>
                  <TabsTrigger value="conversions">Conversões</TabsTrigger>
                  <TabsTrigger value="deposits">Depósitos</TabsTrigger>
                  <TabsTrigger value="results">Resultados</TabsTrigger>
                </TabsList>

                <TabsContent value="traffic" className="mt-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-4">Métricas de Tráfego</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Impressões</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatNumber(selectedCampaign.impressions)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cliques</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatNumber(selectedCampaign.clicks)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">CTR</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedCampaign.ctr.toFixed(2)}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">CPC</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.cpc)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">CPM</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.cpm)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Investimento</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.spend)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="conversions" className="mt-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-4">Métricas de Conversão</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cadastros</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedCampaign.registrations}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Custo por Cadastro</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.costPerRegistration)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">FTDs</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedCampaign.ftds}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Custo por FTD</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.costPerFtd)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Taxa Cadastro → FTD</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatPercentage(calculateConversionRate(selectedCampaign.ftds, selectedCampaign.registrations), 1)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Taxa Clique → FTD</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatPercentage(calculateConversionRate(selectedCampaign.ftds, selectedCampaign.clicks))}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="deposits" className="mt-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-4">Métricas de Depósitos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Depósitos Realizados</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedCampaign.deposits}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Depósitos</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.totalDeposits)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Valor Médio Depósito</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.avgDepositValue)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Depósitos por FTD</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {safeDivide(selectedCampaign.deposits, selectedCampaign.ftds).toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Valor por FTD</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(safeDivide(selectedCampaign.totalDeposits, selectedCampaign.ftds))}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="results" className="mt-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-4">Resultados Financeiros</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Receita</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.revenue)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">GGR</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.ggr)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">NGR</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedCampaign.ngr)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className={cn(
                          "text-lg font-semibold tabular-nums",
                          selectedCampaign.roi > 0 ? "text-emerald-500" : "text-red-500"
                        )}>
                          {selectedCampaign.roi > 0 && "+"}
                          {selectedCampaign.roi.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Lucro Bruto</p>
                          <p className={cn(
                            "text-lg font-semibold tabular-nums",
                            (selectedCampaign.ggr - selectedCampaign.spend) > 0 ? "text-emerald-500" : "text-red-500"
                          )}>
                            {formatCurrency(selectedCampaign.ggr - selectedCampaign.spend)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                          <p className={cn(
                            "text-lg font-semibold tabular-nums",
                            (selectedCampaign.ngr - selectedCampaign.spend) > 0 ? "text-emerald-500" : "text-red-500"
                          )}>
                            {formatCurrency(selectedCampaign.ngr - selectedCampaign.spend)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
