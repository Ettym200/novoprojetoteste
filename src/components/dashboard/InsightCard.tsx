import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, TrendingDown, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export type InsightType = "warning" | "success" | "danger" | "info" | "tip";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  metric?: string;
  metricValue?: string;
}

interface InsightCardProps {
  insight: Insight;
  onClick?: (insight: Insight) => void;
}

const iconMap = {
  warning: AlertTriangle,
  success: TrendingUp,
  danger: TrendingDown,
  info: Info,
  tip: Lightbulb,
};

const styleMap = {
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "text-amber-500",
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-500",
  },
  danger: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "text-red-500",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-500",
  },
  tip: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    icon: "text-primary",
  },
};

export default function InsightCard({ insight, onClick }: InsightCardProps) {
  const Icon = iconMap[insight.type];
  const styles = styleMap[insight.type];

  return (
    <Card
      className={cn(
        "p-4 hover-elevate cursor-pointer border",
        styles.bg,
        styles.border
      )}
      onClick={() => onClick?.(insight)}
      data-testid={`card-insight-${insight.id}`}
    >
      <div className="flex items-start gap-3">
        <div className={cn("shrink-0 mt-0.5", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{insight.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
          {insight.metric && insight.metricValue && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">{insight.metric}:</span>
              <span className={cn("text-sm font-semibold", styles.icon)}>
                {insight.metricValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
