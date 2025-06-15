"use client"

import type { Leaderboard } from "@/lib/mock-data-service"
import LeaderboardCard from "./leaderboard-card"

interface LeaderboardGridProps {
  leaderboards: Leaderboard[]
  onSelectLeaderboard: (id: string) => void
}

export default function LeaderboardGrid({ leaderboards, onSelectLeaderboard }: LeaderboardGridProps) {
  return (
    <div className="px-4 space-y-3">
      {leaderboards.map((leaderboard) => (
        <LeaderboardCard
          key={leaderboard.id}
          leaderboard={leaderboard}
          onSelect={() => onSelectLeaderboard(leaderboard.id)}
        />
      ))}
    </div>
  )
}
