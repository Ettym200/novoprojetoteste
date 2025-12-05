import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MousePointer, Eye, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_STATUS_COLORS } from "@/lib/constants/status";
import type { Campaign } from "@/types/campaign";

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onClick }: CampaignCardProps) {

  return (
    <Card
      className="p-5 hover-elevate cursor-pointer"
      onClick={() => onClick?.(campaign)}
      data-testid={`card-campaign-${campaign.id}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h4 className="font-semibold truncate">{campaign.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{campaign.platform}</p>
        </div>
        <Badge className={cn("shrink-0", CAMPAIGN_STATUS_COLORS[campaign.status])}>
          {CAMPAIGN_STATUS_LABELS[campaign.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs">Impressões</span>
          </div>
          <p className="font-semibold tabular-nums">
            {campaign.impressions.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MousePointer className="w-3.5 h-3.5" />
            <span className="text-xs">Cliques</span>
          </div>
          <p className="font-semibold tabular-nums">
            {campaign.clicks.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">CTR</p>
          <p className="font-medium tabular-nums">{campaign.ctr.toFixed(2)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">CPC</p>
          <p className="font-medium tabular-nums">{formatCurrency(campaign.cpc)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">CPM</p>
          <p className="font-medium tabular-nums">{formatCurrency(campaign.cpm)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-xs">Investimento</span>
          </div>
          <p className="font-semibold tabular-nums">{formatCurrency(campaign.spend)}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">FTDs</span>
          </div>
          <p className="font-semibold tabular-nums">{campaign.ftds}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Custo por FTD</p>
          <p className="font-semibold tabular-nums">{formatCurrency(campaign.costPerFtd)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">ROI</p>
          <div className="flex items-center justify-end gap-1">
            {campaign.roi > 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <p
              className={cn(
                "font-bold tabular-nums",
                campaign.roi > 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {campaign.roi > 0 && "+"}
              {campaign.roi.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
