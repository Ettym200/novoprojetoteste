import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils/format";

export interface KpiCardProps {
  title: string;
  value: number | string; // Aceita número ou string (para compatibilidade)
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconBgClass?: string;
  format?: "currency" | "percentage" | "number";
}

export default function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBgClass = "bg-primary/10",
  format = "currency",
}: KpiCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  // Formata o valor baseado no tipo
  const formattedValue = typeof value === "number" 
    ? format === "currency" 
      ? formatCurrency(value)
      : format === "percentage"
      ? formatPercentage(value)
      : formatNumber(value)
    : value; // Se já for string, mantém como está (compatibilidade)

  return (
    <Card className="p-3 md:p-5 hover-elevate" data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-start justify-between gap-2 md:gap-3">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-xs md:text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-lg md:text-2xl font-bold mt-1 tabular-nums break-words overflow-hidden">{formattedValue}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 md:gap-1.5 mt-1.5 md:mt-2 flex-wrap">
              {isPositive && (
                <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-500 shrink-0" />
              )}
              {isNegative && (
                <TrendingDown className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500 shrink-0" />
              )}
              {isNeutral && (
                <Minus className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground shrink-0" />
              )}
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium tabular-nums whitespace-nowrap",
                  isPositive && "text-emerald-500",
                  isNegative && "text-red-500",
                  isNeutral && "text-muted-foreground"
                )}
              >
                {isPositive && "+"}
                {change.toFixed(2)}%
              </span>
              {changeLabel && (
                <span className="text-[10px] md:text-xs text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg shrink-0",
              iconBgClass
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
