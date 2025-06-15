"use client"

import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Image from "next/image"
import type { LeaderboardData } from "@/lib/mock-data-service"

interface MobileLeaderboardHeaderProps {
  data: LeaderboardData
  isRealTime: boolean
  onToggleRealTime: () => void
}

export default function MobileLeaderboardHeader({ data, isRealTime, onToggleRealTime }: MobileLeaderboardHeaderProps) {
  return (
    <div className="px-4 pb-4">
      {/* Trophy Image */}
      <div className="text-center mb-4">
        <Image src="/images/trophy-hero.png" alt="Leaderboard Trophy" width={150} height={90} className="mx-auto" />
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <div className="bg-green-500 text-black font-bold py-2 px-6 rounded-full inline-block mb-2">LEADERBOARD</div>
        <div className="flex items-center justify-center gap-2 text-white">
          <span className="text-sm">PRIZE POOL</span>
          <Image src="/images/puzzle-pieces.png" alt="Prize" width={16} height={16} />
          <span className="text-green-400 font-bold">{data.totalPrizePool}</span>
        </div>
      </div>

      {/* Live Toggle */}
      <div className="text-center mb-4">
        <Button
          onClick={onToggleRealTime}
          variant={isRealTime ? "default" : "outline"}
          size="sm"
          className={
            isRealTime
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "border-green-400 text-green-400 hover:bg-green-400/10"
          }
        >
          <Zap className="h-4 w-4 mr-1" />
          {isRealTime ? "LIVE" : "GO LIVE"}
        </Button>
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className="bg-purple-700/50 rounded-full px-4 py-2 inline-block">
          <span className="text-white font-mono">{data.timeLeft}</span>
        </div>
      </div>
    </div>
  )
}
