"use client"

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Eye,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { useTableSort } from "@/hooks/useTableSort";
import { useDebounce } from "@/hooks/useDebounce";
import { CAMPAIGN_STATUS_COLORS, CAMPAIGN_STATUS_LABELS } from "@/lib/constants";
import type { Campaign } from "@/types/campaign";

interface CampaignTableProps {
  campaigns: Campaign[];
  onViewDetails?: (campaign: Campaign) => void;
  onNewCampaign?: () => void;
}

type SortField = keyof Campaign;

export default function CampaignTable({ campaigns, onViewDetails, onNewCampaign }: CampaignTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 300);
  const { sortField, sortDirection, handleSort, sortData } = useTableSort<Campaign>("spend", "desc");

  const filteredCampaigns = useMemo(() => {
    const filtered = campaigns.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    return sortData(filtered);
  }, [campaigns, debouncedSearch, statusFilter, sortData]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-normal hover:text-foreground whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      {children} <SortIcon field={field} />
    </Button>
  );

  const totals = useMemo(() => filteredCampaigns.reduce(
    (acc, c) => ({
      spend: acc.spend + c.spend,
      registrations: acc.registrations + c.registrations,
      ftds: acc.ftds + c.ftds,
      ggr: acc.ggr + c.ggr,
    }),
    { spend: 0, registrations: 0, ftds: 0, ggr: 0 }
  ), [filteredCampaigns]);

  return (
    <Card className="p-6" data-testid="campaign-table">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Campanhas</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-campaign"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="paused">Pausadas</SelectItem>
              <SelectItem value="ended">Finalizadas</SelectItem>
            </SelectContent>
          </Select>
          {onNewCampaign && (
            <Button onClick={onNewCampaign} data-testid="button-new-campaign">
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Campanha</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><SortableHeader field="spend">Investimento</SortableHeader></TableHead>
              <TableHead><SortableHeader field="registrations">Cadastros</SortableHeader></TableHead>
              <TableHead><SortableHeader field="costPerRegistration">Custo/Cadastro</SortableHeader></TableHead>
              <TableHead><SortableHeader field="ftds">FTDs</SortableHeader></TableHead>
              <TableHead><SortableHeader field="costPerFtd">Custo/FTD</SortableHeader></TableHead>
              <TableHead><SortableHeader field="ggr">GGR</SortableHeader></TableHead>
              <TableHead><SortableHeader field="roi">ROI</SortableHeader></TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                className="hover-elevate cursor-pointer"
                onClick={() => onViewDetails?.(campaign)}
                data-testid={`row-campaign-${campaign.id}`}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">{campaign.platform}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("shrink-0", CAMPAIGN_STATUS_COLORS[campaign.status])}>
                    {CAMPAIGN_STATUS_LABELS[campaign.status]}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums font-medium">{formatCurrency(campaign.spend)}</TableCell>
                <TableCell className="tabular-nums">{campaign.registrations}</TableCell>
                <TableCell className="tabular-nums">{formatCurrency(campaign.costPerRegistration)}</TableCell>
                <TableCell className="tabular-nums">{campaign.ftds}</TableCell>
                <TableCell className="tabular-nums">{formatCurrency(campaign.costPerFtd)}</TableCell>
                <TableCell className="tabular-nums">{formatCurrency(campaign.ggr)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "tabular-nums font-medium",
                      campaign.roi > 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {campaign.roi > 0 && "+"}
                    {campaign.roi.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.(campaign);
                    }}
                    data-testid={`button-view-campaign-${campaign.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell className="tabular-nums">{formatCurrency(totals.spend)}</TableCell>
              <TableCell className="tabular-nums">{totals.registrations}</TableCell>
              <TableCell className="tabular-nums">—</TableCell>
              <TableCell className="tabular-nums">{totals.ftds}</TableCell>
              <TableCell className="tabular-nums">—</TableCell>
              <TableCell className="tabular-nums">{formatCurrency(totals.ggr)}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
