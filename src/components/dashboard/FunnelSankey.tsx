"use client"

import { useMemo } from "react";
import { Card } from "@/components/ui/card";

export interface FunnelStage {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface FunnelSankeyProps {
  stages: FunnelStage[];
  title?: string;
}

export default function FunnelSankey({ stages, title = "Funil de Conversão" }: FunnelSankeyProps) {
  // Calcular maxValue antes do early return (hooks devem ser chamados sempre)
  const maxValue = useMemo(() => {
    if (!stages || stages.length === 0) return 0;
    return Math.max(...stages.map((s) => s.value));
  }, [stages]);

  // Validar se stages existe e tem elementos
  if (!stages || stages.length === 0) {
    return (
      <Card className="p-3 md:p-6" data-testid="funnel-sankey">
        <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">{title}</h3>
        <div className="text-center text-muted-foreground py-6 md:py-8 text-sm md:text-base">
          Nenhum dado disponível
        </div>
      </Card>
    );
  }

  const getConversionRate = (index: number) => {
    if (index === 0) return 100;
    if (!stages[index] || !stages[index - 1] || stages[index - 1].value === 0) return 0;
    return ((stages[index].value / stages[index - 1].value) * 100);
  };

  const getDropoffRate = (index: number) => {
    if (index === 0) return 0;
    return 100 - getConversionRate(index);
  };

  return (
    <Card className="p-3 md:p-6" data-testid="funnel-sankey">
      <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">{title}</h3>
      <div className="space-y-2 md:space-y-3">
        {stages.map((stage, index) => {
          const conversionRate = getConversionRate(index);
          const dropoffRate = getDropoffRate(index);

          return (
            <div key={stage.id} className="relative">
              {index > 0 && (
                <div className="absolute -top-1 md:-top-2 left-0 right-0 flex items-center justify-center">
                  <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs flex-wrap justify-center">
                    <span className="text-muted-foreground">
                      Conv: <span className="text-emerald-500 font-medium">{conversionRate.toFixed(1)}%</span>
                    </span>
                    <span className="text-muted-foreground">
                      Drop: <span className="text-red-500 font-medium">{dropoffRate.toFixed(1)}%</span>
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 md:gap-4 py-2">
                <div className="text-sm md:text-base font-medium">
                  <span className="text-foreground">{stage.name}:</span>
                  <span className="ml-2 text-muted-foreground font-semibold">
                    ({stage.value.toLocaleString("pt-BR")})
                  </span>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground tabular-nums">
                    {stages[0] && stages[0].value > 0 
                      ? ((stage.value / stages[0].value) * 100).toFixed(1)
                      : '0.0'}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {stages.length > 0 && stages[0] && stages[stages.length - 1] && stages[0].value > 0 && (
        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Taxa de conversão total</span>
            <span className="font-semibold text-emerald-500">
              {((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
