import { useState } from "react";
import PlayerTable, { type Player } from "../dashboard/PlayerTable";
import PlayerDetailModal from "../dashboard/PlayerDetailModal";

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
];

export default function PlayerTableExample() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <div className="p-4">
      <PlayerTable
        players={mockPlayers}
        onViewDetails={(player) => {
          setSelectedPlayer(player);
          // Exemplo: ação ao visualizar detalhes do jogador
        }}
      />
      <PlayerDetailModal
        player={selectedPlayer}
        open={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
}
