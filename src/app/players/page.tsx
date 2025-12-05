"use client"

import { useState } from "react";
import PlayerTable, { type Player } from "@/components/dashboard/PlayerTable";
import PlayerDetailModal from "@/components/dashboard/PlayerDetailModal";
import KpiCard from "@/components/dashboard/KpiCard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Users, UserCheck, AlertTriangle, Clock } from "lucide-react";

// todo: remove mock functionality
const mockPlayers: Player[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    currentStage: "FTD",
    stageColor: "#10B981",
    timeInFunnel: "9 dias",
    totalDeposits: 750.00,
    depositCount: 2,
    totalWithdrawals: 100.00,
    withdrawalCount: 1,
    affiliate: "Raman",
    campaign: "Black Friday 2025",
    isChurned: false,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    currentStage: "Redepósito",
    stageColor: "#06B6D4",
    timeInFunnel: "15 dias",
    totalDeposits: 1250.00,
    depositCount: 4,
    totalWithdrawals: 300.00,
    withdrawalCount: 2,
    affiliate: "Cordeiro",
    campaign: "Natal Especial",
    isChurned: false,
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    currentStage: "WhatsApp",
    stageColor: "#25D366",
    timeInFunnel: "3 dias",
    totalDeposits: 0,
    depositCount: 0,
    totalWithdrawals: 0,
    withdrawalCount: 0,
    affiliate: "Naor",
    campaign: "Leads Premium",
    isChurned: false,
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    currentStage: "Cadastro",
    stageColor: "#8B5CF6",
    timeInFunnel: "12 dias",
    totalDeposits: 0,
    depositCount: 0,
    totalWithdrawals: 0,
    withdrawalCount: 0,
    affiliate: "Bruno",
    campaign: "Tráfego Direto",
    churnDate: "25/11/2025",
    isChurned: true,
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    currentStage: "FTD",
    stageColor: "#10B981",
    timeInFunnel: "7 dias",
    totalDeposits: 500.00,
    depositCount: 1,
    totalWithdrawals: 0,
    withdrawalCount: 0,
    affiliate: "Valter",
    campaign: "Afiliados VIP",
    churnDate: "20/11/2025",
    isChurned: true,
  },
  {
    id: "6",
    name: "Lucia Mendes",
    email: "lucia.mendes@email.com",
    currentStage: "Corretora",
    stageColor: "#F59E0B",
    timeInFunnel: "5 dias",
    totalDeposits: 0,
    depositCount: 0,
    totalWithdrawals: 0,
    withdrawalCount: 0,
    affiliate: "Raman",
    campaign: "Black Friday 2025",
    isChurned: false,
  },
  {
    id: "7",
    name: "Roberto Lima",
    email: "roberto.lima@email.com",
    currentStage: "Página",
    stageColor: "#6366F1",
    timeInFunnel: "1 dia",
    totalDeposits: 0,
    depositCount: 0,
    totalWithdrawals: 0,
    withdrawalCount: 0,
    affiliate: "Cordeiro",
    campaign: "Natal Especial",
    isChurned: false,
  },
  {
    id: "8",
    name: "Fernanda Alves",
    email: "fernanda.alves@email.com",
    currentStage: "Redepósito",
    stageColor: "#06B6D4",
    timeInFunnel: "22 dias",
    totalDeposits: 2500.00,
    depositCount: 6,
    totalWithdrawals: 800.00,
    withdrawalCount: 3,
    affiliate: "Naor",
    campaign: "Leads Premium",
    isChurned: false,
  },
];

export default function Players() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const totalPlayers = mockPlayers.length;
  const activePlayers = mockPlayers.filter((p) => !p.isChurned).length;
  const churnedPlayers = mockPlayers.filter((p) => p.isChurned).length;
  const churnRate = ((churnedPlayers / totalPlayers) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Jogadores"
        subtitle="Gestão e acompanhamento de players"
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              title="Total de Jogadores"
              value={totalPlayers.toString()}
              icon={<Users className="w-5 h-5 text-primary" />}
              iconBgClass="bg-primary/10"
            />
            <KpiCard
              title="Jogadores Ativos"
              value={activePlayers.toString()}
              icon={<UserCheck className="w-5 h-5 text-emerald-500" />}
              iconBgClass="bg-emerald-500/10"
            />
            <KpiCard
              title="Churned"
              value={churnedPlayers.toString()}
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              iconBgClass="bg-red-500/10"
            />
            <KpiCard
              title="Taxa de Churn"
              value={`${churnRate}%`}
              icon={<Clock className="w-5 h-5 text-amber-500" />}
              iconBgClass="bg-amber-500/10"
            />
          </div>
        </section>

        <section>
          <PlayerTable
            players={mockPlayers}
            onViewDetails={(player) => {
              setSelectedPlayer(player);
            }}
          />
        </section>

        <PlayerDetailModal
          player={selectedPlayer}
          open={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      </div>
    </div>
  );
}
