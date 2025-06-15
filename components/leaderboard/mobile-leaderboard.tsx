"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockDataService, type LeaderboardData } from "@/lib/mock-data-service"
import LeaderboardHeader from "./mobile-leaderboard-header"
import PlayerList from "./mobile-player-list"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface MobileLeaderboardProps {
  leaderboardId: string
  onClose: () => void
}

export default function MobileLeaderboard({ leaderboardId, onClose }: MobileLeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRealTime, setIsRealTime] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const data = await mockDataService.getLeaderboardData(leaderboardId, 50)
      setLeaderboardData(data)
      setLoading(false)
    }

    loadData()

    let unsubscribe: (() => void) | null = null

    if (isRealTime) {
      unsubscribe = mockDataService.subscribeToLeaderboardUpdates(leaderboardId, (data) => {
        setLeaderboardData(data)
      })
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [leaderboardId, isRealTime])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <LoadingSpinner message="Loading leaderboard..." />
        </div>
      </div>
    )
  }

  if (!leaderboardData) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Leaderboard not found</p>
          <Button onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-black z-50">
      <div className="max-w-md mx-auto h-full flex flex-col">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <LeaderboardHeader
          data={leaderboardData}
          isRealTime={isRealTime}
          onToggleRealTime={() => setIsRealTime(!isRealTime)}
        />

        <PlayerList players={leaderboardData.players} isRealTime={isRealTime} />
      </div>
    </div>
  )
}
