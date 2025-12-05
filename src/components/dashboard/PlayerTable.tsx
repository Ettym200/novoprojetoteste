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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";

export interface Player {
  id: string;
  name: string;
  email: string;
  currentStage: string;
  stageColor: string;
  timeInFunnel: string;
  totalDeposits: number;
  depositCount: number;
  totalWithdrawals: number;
  withdrawalCount: number;
  affiliate: string;
  campaign: string;
  churnDate?: string;
  isChurned: boolean;
}

interface PlayerTableProps {
  players: Player[];
  onViewDetails?: (player: Player) => void;
}

const stages = [
  { value: "all", label: "Todas as etapas" },
  { value: "facebook", label: "Facebook" },
  { value: "landing", label: "Página" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "broker", label: "Corretora" },
  { value: "registered", label: "Cadastrado" },
  { value: "ftd", label: "FTD" },
  { value: "redeposit", label: "Redepósito" },
];

export default function PlayerTable({ players, onViewDetails }: PlayerTableProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [churnFilter, setChurnFilter] = useState("all");

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchesStage =
      stageFilter === "all" || p.currentStage.toLowerCase() === stageFilter;
    const matchesChurn =
      churnFilter === "all" ||
      (churnFilter === "churned" && p.isChurned) ||
      (churnFilter === "active" && !p.isChurned);
    return matchesSearch && matchesStage && matchesChurn;
  });

  return (
    <Card className="p-6" data-testid="player-table">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Jogadores</h3>
          <span className="text-sm text-muted-foreground">
            {filteredPlayers.length} jogadores
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar jogador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-player"
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-stage-filter">
              <SelectValue placeholder="Etapa do funil" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={churnFilter} onValueChange={setChurnFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-churn-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="churned">Churn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Jogador</TableHead>
              <TableHead>Etapa Atual</TableHead>
              <TableHead>Tempo no Funil</TableHead>
              <TableHead>Depósitos</TableHead>
              <TableHead>Saques</TableHead>
              <TableHead>Afiliado</TableHead>
              <TableHead>Campanha</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow
                key={player.id}
                className={cn(
                  "hover-elevate cursor-pointer",
                  player.isChurned && "opacity-60"
                )}
                onClick={() => onViewDetails?.(player)}
                data-testid={`row-player-${player.id}`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {player.isChurned && (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    style={{ backgroundColor: player.stageColor }}
                    className="text-white border-0"
                  >
                    {player.currentStage}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {player.timeInFunnel}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium tabular-nums">
                      {formatCurrency(player.totalDeposits)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {player.depositCount} depósito{player.depositCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium tabular-nums">
                      {formatCurrency(player.totalWithdrawals)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {player.withdrawalCount} saque{player.withdrawalCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{player.affiliate}</TableCell>
                <TableCell className="text-muted-foreground truncate max-w-[150px]">
                  {player.campaign}
                </TableCell>
                <TableCell>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.(player);
                    }}
                    data-testid={`button-view-player-${player.id}`}
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
