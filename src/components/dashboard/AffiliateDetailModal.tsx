"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { safeDivide } from "@/lib/utils/format";
import type { Affiliate } from "./AffiliateTable";

interface AffiliateDetailModalProps {
  affiliate: Affiliate | null;
  open: boolean;
  onClose: () => void;
}

export default function AffiliateDetailModal({
  affiliate,
  open,
  onClose,
}: AffiliateDetailModalProps) {
  if (!affiliate) return null;

  const funnelData = [
    { stage: "Facebook", value: 12500, color: "#1877F2" },
    { stage: "Página", value: 8750, color: "#6366F1" },
    { stage: "WhatsApp", value: 5200, color: "#25D366" },
    { stage: "Corretora", value: 2100, color: "#F59E0B" },
    { stage: "Cadastro", value: affiliate.registrations, color: "#8B5CF6" },
    { stage: "FTD", value: affiliate.ftds, color: "#10B981" },
    { stage: "Redepósito", value: Math.floor(affiliate.ftds * 0.45), color: "#06B6D4" },
  ];

  const maxFunnel = Math.max(...funnelData.map((d) => d.value));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="modal-affiliate-detail">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">{affiliate.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{affiliate.email}</p>
            </div>
            {affiliate.ranking && affiliate.ranking <= 3 && (
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
                <Trophy className="w-3 h-3 mr-1" />
                Top {affiliate.ranking}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="funnel" data-testid="tab-funnel">Funil</TabsTrigger>
            <TabsTrigger value="metrics" data-testid="tab-metrics">Métricas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs">Investimento</span>
                </div>
                <p className="text-xl font-bold tabular-nums">
                  {formatCurrency(affiliate.totalInvestment)}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Cadastros</span>
                </div>
                <p className="text-xl font-bold tabular-nums">{affiliate.registrations}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-xs">FTDs</span>
                </div>
                <p className="text-xl font-bold tabular-nums">{affiliate.ftds}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs">ROI</span>
                </div>
                <div className="flex items-center gap-1">
                  {affiliate.roi > 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <p
                    className={cn(
                      "text-xl font-bold tabular-nums",
                      affiliate.roi > 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {affiliate.roi > 0 && "+"}
                    {affiliate.roi.toFixed(2)}%
                  </p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-3">Receitas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">GGR</span>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(affiliate.ggr)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">NGR</span>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(affiliate.ngr)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Depósitos</span>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(affiliate.deposits)}
                    </span>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-3">Eficiência</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversão</span>
                    <span className="font-semibold tabular-nums">
                      {affiliate.conversionRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">CPA</span>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(safeDivide(affiliate.totalInvestment, affiliate.ftds))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ticket Médio</span>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(safeDivide(affiliate.deposits, affiliate.ftds))}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="mt-4">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Funil do Afiliado</h4>
              <div className="space-y-3">
                {funnelData.map((stage, index) => {
                  const prevValue = index > 0 ? funnelData[index - 1].value : stage.value;
                  const conversion = ((stage.value / prevValue) * 100).toFixed(1);
                  return (
                    <div key={stage.stage} className="flex items-center gap-3">
                      <div className="w-24 text-sm font-medium">{stage.stage}</div>
                      <div className="flex-1 h-8 bg-muted/50 rounded overflow-hidden">
                        <div
                          className="h-full flex items-center justify-end pr-2 transition-all duration-500"
                          style={{
                            width: `${(stage.value / maxFunnel) * 100}%`,
                            backgroundColor: stage.color,
                          }}
                        >
                          <span className="text-xs font-semibold text-white">
                            {stage.value.toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <div className="w-16 text-right text-xs text-muted-foreground">
                        {index > 0 ? `${conversion}%` : "100%"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="mt-4">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Métricas Detalhadas</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Custo por Cadastro</p>
                  <p className="text-lg font-semibold tabular-nums">
                    {formatCurrency(safeDivide(affiliate.totalInvestment, affiliate.registrations))}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Custo por FTD</p>
                  <p className="text-lg font-semibold tabular-nums">
                    {formatCurrency(safeDivide(affiliate.totalInvestment, affiliate.ftds))}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                  <p className="text-lg font-semibold tabular-nums">
                    {(safeDivide(affiliate.ftds, affiliate.registrations) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Valor por Jogador</p>
                  <p className="text-lg font-semibold tabular-nums">
                    {formatCurrency(safeDivide(affiliate.ggr, affiliate.ftds))}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
