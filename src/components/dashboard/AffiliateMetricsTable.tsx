"use client"

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
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
  ChevronUp,
  ChevronDown,
  Search,
  Eye,
  ArrowUpDown,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { useTableSort } from "@/hooks/useTableSort";
import { useDebounce } from "@/hooks/useDebounce";
import type { AffiliateMetrics } from "@/types/affiliate";

interface AffiliateMetricsTableProps {
  affiliates: AffiliateMetrics[];
  onViewDetails?: (affiliate: AffiliateMetrics) => void;
}

type SortField = keyof AffiliateMetrics;

export default function AffiliateMetricsTable({ affiliates, onViewDetails }: AffiliateMetricsTableProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { sortField, sortDirection, handleSort, sortData } = useTableSort<AffiliateMetrics>("ggr", "desc");

  const filteredAffiliates = useMemo(() => {
    const filtered = affiliates.filter((a) => 
      a.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    return sortData(filtered);
  }, [affiliates, debouncedSearch, sortData]);

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

  const totals = useMemo(() => filteredAffiliates.reduce(
    (acc, a) => ({
      totalInvestment: acc.totalInvestment + a.totalInvestment,
      registrations: acc.registrations + a.registrations,
      ftdCount: acc.ftdCount + a.ftdCount,
      totalFtd: acc.totalFtd + a.totalFtd,
      ggr: acc.ggr + a.ggr,
      netProfit: acc.netProfit + a.netProfit,
    }),
    {
      totalInvestment: 0,
      registrations: 0,
      ftdCount: 0,
      totalFtd: 0,
      ggr: 0,
      netProfit: 0,
    }
  ), [filteredAffiliates]);

  return (
    <Card className="p-6" data-testid="affiliate-metrics-table">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Métricas por Afiliado</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar afiliado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-affiliate-metrics"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Afiliado</TableHead>
              <TableHead><SortableHeader field="totalInvestment">Investimento</SortableHeader></TableHead>
              <TableHead><SortableHeader field="registrations">Cadastros</SortableHeader></TableHead>
              <TableHead><SortableHeader field="costPerRegistration">Custo/Cadastro</SortableHeader></TableHead>
              <TableHead><SortableHeader field="ftdCount">FTDs</SortableHeader></TableHead>
              <TableHead><SortableHeader field="costPerFtd">Custo/FTD</SortableHeader></TableHead>
              <TableHead><SortableHeader field="totalFtd">Valor FTD</SortableHeader></TableHead>
              <TableHead><SortableHeader field="ggr">GGR</SortableHeader></TableHead>
              <TableHead><SortableHeader field="netProfit">Lucro Líquido</SortableHeader></TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAffiliates.map((affiliate) => (
              <TableRow
                key={affiliate.id}
                className="hover-elevate cursor-pointer"
                onClick={() => onViewDetails?.(affiliate)}
                data-testid={`row-affiliate-metrics-${affiliate.id}`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {affiliate.ranking && affiliate.ranking <= 3 && (
                      <Trophy className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="font-medium">{affiliate.name}</span>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{formatCurrency(affiliate.totalInvestment)}</TableCell>
                <TableCell className="tabular-nums">{affiliate.registrations}</TableCell>
                <TableCell className="tabular-nums">{formatCurrency(affiliate.costPerRegistration)}</TableCell>
                <TableCell className="tabular-nums">{affiliate.ftdCount}</TableCell>
                <TableCell className="tabular-nums">{formatCurrency(affiliate.costPerFtd)}</TableCell>
                <TableCell className="tabular-nums">{formatCurrency(affiliate.totalFtd)}</TableCell>
                <TableCell className="tabular-nums">{formatCurrency(affiliate.ggr)}</TableCell>
                <TableCell className={cn(
                  "tabular-nums font-medium",
                  affiliate.netProfit > 0 ? "text-emerald-500" : affiliate.netProfit < 0 ? "text-red-500" : ""
                )}>
                  {formatCurrency(affiliate.netProfit)}
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.(affiliate);
                    }}
                    data-testid={`button-view-affiliate-metrics-${affiliate.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell>Total</TableCell>
              <TableCell className="tabular-nums">{formatCurrency(totals.totalInvestment)}</TableCell>
              <TableCell className="tabular-nums">{totals.registrations}</TableCell>
              <TableCell className="tabular-nums">—</TableCell>
              <TableCell className="tabular-nums">{totals.ftdCount}</TableCell>
              <TableCell className="tabular-nums">—</TableCell>
              <TableCell className="tabular-nums">{formatCurrency(totals.totalFtd)}</TableCell>
              <TableCell className="tabular-nums">{formatCurrency(totals.ggr)}</TableCell>
              <TableCell className={cn(
                "tabular-nums",
                totals.netProfit > 0 ? "text-emerald-500" : totals.netProfit < 0 ? "text-red-500" : ""
              )}>
                {formatCurrency(totals.netProfit)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
