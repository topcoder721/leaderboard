"use client"

import { Button } from "@/components/ui/button"
import { Trophy, Coins, Users, Clock, Zap } from "lucide-react"
import type { LeaderboardData } from "@/lib/mock-data-service"

interface LeaderboardHeaderProps {
  data: LeaderboardData
  isRealTime: boolean
  lastUpdate: Date
  onToggleRealTime: () => void
  onClose: () => void
}

export default function LeaderboardHeader({
  data,
  isRealTime,
  lastUpdate,
  onToggleRealTime,
  onClose,
}: LeaderboardHeaderProps) {
  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          {data.name}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={onToggleRealTime}
            variant={isRealTime ? "default" : "outline"}
            size="sm"
            className={isRealTime ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white hover:bg-white/10"}
          >
            <Zap className="h-4 w-4 mr-1" />
            {isRealTime ? "Live" : "Enable Live"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Coins className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">${data.totalPrizePool.toLocaleString()}</div>
          <div className="text-xs text-blue-200">Total Prize Pool</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{data.playerCount.toLocaleString()}</div>
          <div className="text-xs text-blue-200">Players</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Clock className="h-5 w-5 text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{data.timeLeft}</div>
          <div className="text-xs text-blue-200">Time Left</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <Zap className="h-5 w-5 text-purple-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{isRealTime ? lastUpdate.toLocaleTimeString() : "Static"}</div>
          <div className="text-xs text-blue-200">Last Update</div>
        </div>
      </div>
    </div>
  )
}
