"use client"

import { useState } from "react";
import AffiliateMetricsTable from "@/components/dashboard/AffiliateMetricsTable";
import type { AffiliateMetrics } from "@/types/affiliate";
import KpiCard from "@/components/dashboard/KpiCard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, TrendingDown, Target, DollarSign, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAffiliateMetrics } from "@/lib/services/affiliateService";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { calculateROI, calculateMargin, calculateConversionRate } from "@/lib/utils/metrics";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export default function Affiliates() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateMetrics | null>(null);
  
  const { data, isLoading, isError } = useAffiliateMetrics();
  const affiliates = data?.affiliates ?? [];
  const totals = data?.totals ?? {
    totalAffiliates: 0,
    topPerformers: 0,
    totalGgr: 0,
    totalNgr: 0,
    totalNetProfit: 0,
    totalFtds: 0,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader
          title="Métricas por Afiliado"
          subtitle="Performance detalhada dos experts"
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
          title="Métricas por Afiliado"
          subtitle="Performance detalhada dos experts"
        />
        <div className="flex-1 flex items-center justify-center">
          <ErrorMessage message="Erro ao carregar dados dos afiliados" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Métricas por Afiliado"
        subtitle="Performance detalhada dos experts"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <KpiCard
                  title="Total de Afiliados"
                  value={totals.totalAffiliates}
                  format="number"
                  icon={<Users className="w-5 h-5 text-primary" />}
                  iconBgClass="bg-primary/10"
                />
                <KpiCard
                  title="Top Performers"
                  value={totals.topPerformers}
                  format="number"
                  icon={<Trophy className="w-5 h-5 text-amber-500" />}
                  iconBgClass="bg-amber-500/10"
                />
                <KpiCard
                  title="Total FTDs"
                  value={totals.totalFtds}
                  format="number"
                  icon={<Target className="w-5 h-5 text-emerald-500" />}
                  iconBgClass="bg-emerald-500/10"
                />
                <KpiCard
                  title="GGR Total"
                  value={totals.totalGgr}
                  format="currency"
                  icon={<DollarSign className="w-5 h-5 text-blue-500" />}
                  iconBgClass="bg-blue-500/10"
                />
                <KpiCard
                  title="NGR Total"
                  value={totals.totalNgr}
                  format="currency"
                  icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
                  iconBgClass="bg-purple-500/10"
                />
                <KpiCard
                  title="Lucro Líquido"
                  value={totals.totalNetProfit}
                  format="currency"
                  icon={<TrendingDown className="w-5 h-5 text-cyan-500" />}
                  iconBgClass="bg-cyan-500/10"
                />
          </div>
        </section>

        <section>
          <AffiliateMetricsTable
            affiliates={affiliates}
            onViewDetails={(affiliate) => {
              setSelectedAffiliate(affiliate);
            }}
          />
        </section>

        <Dialog open={!!selectedAffiliate} onOpenChange={() => setSelectedAffiliate(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="modal-affiliate-detail">
            <DialogHeader>
              <div className="flex items-center gap-3">
                {selectedAffiliate?.ranking && selectedAffiliate.ranking <= 3 && (
                  <Trophy className="w-5 h-5 text-amber-500" />
                )}
                <div className="flex-1">
                  <DialogTitle className="text-xl">{selectedAffiliate?.name}</DialogTitle>
                  <DialogDescription>Detalhes completos do afiliado</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedAffiliate && (
              <Tabs defaultValue="investment" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="investment">Investimento</TabsTrigger>
                  <TabsTrigger value="deposits">Depósitos</TabsTrigger>
                  <TabsTrigger value="ftd">FTD</TabsTrigger>
                  <TabsTrigger value="results">Resultados</TabsTrigger>
                </TabsList>

                <TabsContent value="investment" className="mt-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-4">Métricas de Investimento</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Investido</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.totalInvestment)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cadastros</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedAffiliate.registrations}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Custo por Cadastro</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.costPerRegistration)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">CPM</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.cpm)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Custo p/L link</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.costPerLink)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">CTR</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedAffiliate.ctr.toFixed(2)}%
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
                        <p className="text-sm text-muted-foreground">VM Depósito/Player</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.avgDepositValuePerPlayer)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Depósitos/Player</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedAffiliate.depositsPerPlayer.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Players que Depositaram</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedAffiliate.playersDeposited}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Depósitos</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.totalDeposits)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">VM Depósito</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.avgDepositValue)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Custo por Depósito</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.costPerDeposit)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">QTD Depósitos</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedAffiliate.depositCount}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="ftd" className="mt-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-4">Métricas de FTD</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Custo por FTD</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.costPerFtd)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">VM FTD</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.avgFtdValue)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total FTD (Valor)</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.totalFtd)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Quantidade FTDs</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {selectedAffiliate.ftdCount}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatPercentage(calculateConversionRate(selectedAffiliate.ftdCount, selectedAffiliate.registrations))}
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
                        <p className="text-sm text-muted-foreground">RL</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.rl)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">GGR</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.ggr)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">NGR</p>
                        <p className="text-lg font-semibold tabular-nums">
                          {formatCurrency(selectedAffiliate.ngr)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                        <p className={cn(
                          "text-lg font-semibold tabular-nums",
                          selectedAffiliate.netProfit > 0 ? "text-emerald-500" : 
                          selectedAffiliate.netProfit < 0 ? "text-red-500" : ""
                        )}>
                          {formatCurrency(selectedAffiliate.netProfit)}
                        </p>
                      </div>
                    </div>
                    {selectedAffiliate.totalInvestment > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">ROI</p>
                            <p className={cn(
                              "text-lg font-semibold tabular-nums",
                              selectedAffiliate.netProfit > 0 ? "text-emerald-500" : "text-red-500"
                            )}>
                              {formatPercentage(calculateROI(selectedAffiliate.netProfit, selectedAffiliate.totalInvestment))}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Margem</p>
                            <p className={cn(
                              "text-lg font-semibold tabular-nums",
                              selectedAffiliate.ggr > 0 
                                ? (calculateMargin(selectedAffiliate.netProfit, selectedAffiliate.ggr) > 0 ? "text-emerald-500" : "text-red-500")
                                : ""
                            )}>
                              {formatPercentage(calculateMargin(selectedAffiliate.netProfit, selectedAffiliate.ggr))}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
