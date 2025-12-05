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
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import type { Player } from "./PlayerTable";

interface PlayerDetailModalProps {
  player: Player | null;
  open: boolean;
  onClose: () => void;
}

interface TimelineEvent {
  id: string;
  stage: string;
  date: string;
  duration: string;
  isChurnPoint?: boolean;
  color: string;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function PlayerDetailModal({
  player,
  open,
  onClose,
}: PlayerDetailModalProps) {
  if (!player) return null;

  // todo: remove mock functionality
  const timeline: TimelineEvent[] = [
    { id: "1", stage: "Facebook", date: "15/11/2025", duration: "2 dias", color: "#1877F2" },
    { id: "2", stage: "Página", date: "17/11/2025", duration: "1 dia", color: "#6366F1" },
    { id: "3", stage: "WhatsApp", date: "18/11/2025", duration: "3 dias", color: "#25D366" },
    { id: "4", stage: "Corretora", date: "21/11/2025", duration: "1 dia", color: "#F59E0B" },
    { id: "5", stage: "Cadastro", date: "22/11/2025", duration: "2 dias", color: "#8B5CF6" },
    {
      id: "6",
      stage: "FTD",
      date: "24/11/2025",
      duration: "—",
      color: "#10B981",
      isChurnPoint: player.isChurned,
    },
  ];

  // todo: remove mock functionality
  const transactions: Transaction[] = [
    { id: "1", type: "deposit", amount: 500, date: "24/11/2025", status: "completed" },
    { id: "2", type: "deposit", amount: 250, date: "25/11/2025", status: "completed" },
    { id: "3", type: "withdrawal", amount: 100, date: "26/11/2025", status: "completed" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="modal-player-detail">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {player.isChurned && <AlertCircle className="w-5 h-5 text-red-500" />}
                {player.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{player.email}</p>
            </div>
            <Badge
              style={{ backgroundColor: player.stageColor }}
              className="text-white border-0"
            >
              {player.currentStage}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="timeline" className="mt-4">
          <TabsList>
            <TabsTrigger value="timeline" data-testid="tab-timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="financial" data-testid="tab-financial">Financeiro</TabsTrigger>
            <TabsTrigger value="info" data-testid="tab-info">Informações</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-4">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Jornada do Jogador</h4>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-4">
                  {timeline.map((event) => (
                    <div
                      key={event.id}
                      className="relative flex items-start gap-4 pl-10"
                    >
                      <div
                        className={cn(
                          "absolute left-2.5 w-3 h-3 rounded-full ring-4 ring-background",
                          event.isChurnPoint ? "bg-red-500" : ""
                        )}
                        style={{
                          backgroundColor: event.isChurnPoint ? undefined : event.color,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{event.stage}</span>
                            {event.isChurnPoint && (
                              <Badge variant="destructive" className="text-xs">
                                Churn
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tempo total no funil</span>
                  <span className="font-semibold">{player.timeInFunnel}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <ArrowDownCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Depositado</span>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {formatCurrency(player.totalDeposits)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {player.depositCount} depósito{player.depositCount !== 1 ? "s" : ""}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <ArrowUpCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Sacado</span>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {formatCurrency(player.totalWithdrawals)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {player.withdrawalCount} saque{player.withdrawalCount !== 1 ? "s" : ""}
                </p>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Histórico de Transações</h4>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {tx.type === "deposit" ? (
                        <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ArrowUpCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {tx.type === "deposit" ? "Depósito" : "Saque"}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-semibold tabular-nums",
                          tx.type === "deposit" ? "text-emerald-500" : "text-red-500"
                        )}
                      >
                        {tx.type === "deposit" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                      {tx.status === "completed" && (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Origem e Campanha</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ORIGEM</p>
                  <p className="font-medium text-base">{player.campaign}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Afiliado</p>
                  <p className="font-medium text-base">{player.affiliate}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Status e Segurança</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={player.isChurned ? "destructive" : "default"}>
                    {player.isChurned ? "Churned" : "Ativo"}
                  </Badge>
                </div>
                {player.churnDate && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Data do Churn</p>
                    <p className="font-medium">{player.churnDate}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
