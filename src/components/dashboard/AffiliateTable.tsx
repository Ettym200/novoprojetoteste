"use client"

import { useState } from "react";
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
  ChevronUp,
  ChevronDown,
  Search,
  Trophy,
  TrendingDown,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableSort } from "@/hooks/useTableSort";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils/format";
import type { Affiliate } from "@/types/affiliate";

interface AffiliateTableProps {
  affiliates: Affiliate[];
  onViewDetails?: (affiliate: Affiliate) => void;
}

export default function AffiliateTable({ affiliates, onViewDetails }: AffiliateTableProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { sortField, sortDirection, handleSort, sortData } = useTableSort<Affiliate>("ggr", "desc");

  const filteredAffiliates = sortData(
    affiliates.filter(
      (a) =>
        a.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  );

  const SortIcon = ({ field }: { field: keyof Affiliate }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" />
    );
  };

  const getRankingBadge = (affiliate: Affiliate) => {
    if (affiliate.ranking && affiliate.ranking <= 3) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
          <Trophy className="w-3 h-3 mr-1" />
          Top {affiliate.ranking}
        </Badge>
      );
    }
    if (affiliate.status === "below") {
      return (
        <Badge variant="destructive" className="gap-1">
          <TrendingDown className="w-3 h-3" />
          Abaixo
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="p-6" data-testid="affiliate-table">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Afiliados</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar afiliado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-affiliate"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Afiliado</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal hover:text-foreground"
                  onClick={() => handleSort("totalInvestment")}
                >
                  Investimento <SortIcon field="totalInvestment" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal hover:text-foreground"
                  onClick={() => handleSort("registrations")}
                >
                  Cadastros <SortIcon field="registrations" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal hover:text-foreground"
                  onClick={() => handleSort("ftds")}
                >
                  FTDs <SortIcon field="ftds" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal hover:text-foreground"
                  onClick={() => handleSort("ggr")}
                >
                  GGR <SortIcon field="ggr" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal hover:text-foreground"
                  onClick={() => handleSort("ngr")}
                >
                  NGR <SortIcon field="ngr" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal hover:text-foreground"
                  onClick={() => handleSort("roi")}
                >
                  ROI <SortIcon field="roi" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAffiliates.map((affiliate) => (
              <TableRow
                key={affiliate.id}
                className="hover-elevate cursor-pointer"
                onClick={() => onViewDetails?.(affiliate)}
                data-testid={`row-affiliate-${affiliate.id}`}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{affiliate.name}</p>
                    <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(affiliate.totalInvestment)}
                </TableCell>
                <TableCell className="tabular-nums">{affiliate.registrations}</TableCell>
                <TableCell className="tabular-nums">{affiliate.ftds}</TableCell>
                <TableCell className="tabular-nums font-medium">
                  {formatCurrency(affiliate.ggr)}
                </TableCell>
                <TableCell className="tabular-nums">{formatCurrency(affiliate.ngr)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "tabular-nums font-medium",
                      affiliate.roi > 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {affiliate.roi > 0 && "+"}
                    {affiliate.roi.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell>{getRankingBadge(affiliate)}</TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.(affiliate);
                    }}
                    data-testid={`button-view-affiliate-${affiliate.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
