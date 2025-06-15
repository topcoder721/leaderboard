"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import Image from "next/image"
import type { Leaderboard } from "@/lib/mock-data-service"

interface LeaderboardCardProps {
  leaderboard: Leaderboard
  onSelect: () => void
}

export default function LeaderboardCard({ leaderboard, onSelect }: LeaderboardCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "ended":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTimeLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h left`
  }

  return (
    <Card
      className="bg-gradient-to-r from-purple-800/50 to-purple-700/50 border-purple-600/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-green-400/50"
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-lg">{leaderboard.name}</h3>
          <Badge className={`${getStatusColor(leaderboard.status)} text-white border-0 text-xs`}>
            {leaderboard.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image src="/images/puzzle-pieces.png" alt="Prize" width={20} height={20} />
            <span className="text-green-400 font-bold">{leaderboard.totalPrizePool}</span>
          </div>
          <div className="flex items-center gap-1 text-purple-200 text-sm">
            <Users className="h-4 w-4" />
            <span>{leaderboard.playerCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-purple-200 text-sm">
          <Clock className="h-4 w-4" />
          <span>{getTimeLeft(leaderboard.endDate)}</span>
        </div>
      </div>
    </Card>
  )
}
