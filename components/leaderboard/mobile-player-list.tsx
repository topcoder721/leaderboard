import type { Player } from "@/lib/mock-data-service"
import MobilePlayerRow from "./mobile-player-row"

interface MobilePlayerListProps {
  players: Player[]
  isRealTime: boolean
}

export default function MobilePlayerList({ players, isRealTime }: MobilePlayerListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <div className="space-y-2">
        {players.slice(0, 10).map((player, index) => (
          <MobilePlayerRow key={player.id} player={player} isRealTime={isRealTime} />
        ))}
      </div>
    </div>
  )
}
