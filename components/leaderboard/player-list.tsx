import type { Player } from "@/lib/mock-data-service"
import PlayerRow from "./player-row"

interface PlayerListProps {
  players: Player[]
  isRealTime: boolean
}

export default function PlayerList({ players, isRealTime }: PlayerListProps) {
  return (
    <div className="overflow-y-auto max-h-[60vh] space-y-2">
      {players.map((player, index) => (
        <PlayerRow key={player.id} player={player} isRealTime={isRealTime} showLiveBadge={index < 10} />
      ))}
    </div>
  )
}
