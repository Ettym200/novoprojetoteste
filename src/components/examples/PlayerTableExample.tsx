import { useState } from "react";
import PlayerTable, { type Player } from "../dashboard/PlayerTable";
import PlayerDetailModal from "../dashboard/PlayerDetailModal";

export default function PlayerTableExample() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <div className="p-4">
      <PlayerTable
        players={[]}
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
