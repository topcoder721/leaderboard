import Image from "next/image"
import type { Player } from "@/lib/mock-data-service"

interface MobilePlayerRowProps {
  player: Player
  isRealTime: boolean
}

export default function MobilePlayerRow({ player, isRealTime }: MobilePlayerRowProps) {
  const getTrophyImage = (position: number) => {
    switch (position) {
      case 1:
        return "/images/gold-trophy.png"
      case 2:
        return "/images/silver-trophy.png"
      case 3:
        return "/images/bronze-trophy.png"
      default:
        return null
    }
  }

  const getPositionBg = (position: number) => {
    if (position <= 3) return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
    if (position === 7) return "bg-green-500/20" // Highlight "Me" player
    return "bg-purple-700/30"
  }

  const trophyImage = getTrophyImage(player.position)

  return (
    <div className={`${getPositionBg(player.position)} rounded-lg p-3 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        {/* Position/Trophy */}
        <div className="w-8 h-8 flex items-center justify-center">
          {trophyImage ? (
            <Image src={trophyImage || "/placeholder.svg"} alt={`Position ${player.position}`} width={24} height={24} />
          ) : (
            <span className="text-white font-bold text-lg">{player.position}</span>
          )}
        </div>

        {/* Player Info */}
        <div>
          <div className="text-white font-semibold text-sm">{player.name}</div>
          <div className="text-purple-200 text-xs">Score: {player.score.toLocaleString()}</div>
        </div>
      </div>

      {/* Reward */}
      <div className="flex items-center gap-1">
        <Image src="/images/puzzle-pieces.png" alt="Reward" width={16} height={16} />
        <span className="text-green-400 font-bold text-sm">{player.reward}</span>
      </div>
    </div>
  )
}
