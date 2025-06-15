import { Badge } from "@/components/ui/badge"
import { Crown, Medal, Award } from "lucide-react"
import type { Player } from "@/lib/mock-data-service"

interface PlayerRowProps {
  player: Player
  isRealTime: boolean
  showLiveBadge: boolean
}

export default function PlayerRow({ player, isRealTime, showLiveBadge }: PlayerRowProps) {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-white w-6 text-center">#{position}</span>
    }
  }

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/30"
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30"
      case 3:
        return "bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/30"
      default:
        return "bg-white/5 border-white/10"
    }
  }

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${getPositionBg(player.position)} backdrop-blur-sm transition-all duration-300 ${
        isRealTime ? "hover:scale-[1.02]" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10">{getPositionIcon(player.position)}</div>

        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {player.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>

        <div>
          <div className="font-semibold text-white">{player.name}</div>
          <div className="text-sm text-blue-200 flex items-center gap-2">
            <span>Score: {player.score.toLocaleString()}</span>
            {isRealTime && showLiveBadge && (
              <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                Live
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="text-right">
        {player.reward > 0 && (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30 mb-1">
            ${player.reward.toLocaleString()}
          </Badge>
        )}
        <div className="text-sm text-blue-200">Position #{player.position}</div>
      </div>
    </div>
  )
}
