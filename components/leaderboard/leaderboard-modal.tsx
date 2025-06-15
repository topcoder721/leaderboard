"use client"

import { useState, useEffect } from "react"
import { mockDataService, type LeaderboardData } from "@/lib/mock-data-service"
import ModalWrapper from "@/components/ui/modal-wrapper"
import LeaderboardHeader from "./leaderboard-header"
import PlayerList from "./player-list"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface LeaderboardModalProps {
  leaderboardId: string
  onClose: () => void
}

export default function LeaderboardModal({ leaderboardId, onClose }: LeaderboardModalProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

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
        setLastUpdate(new Date())
      })
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [leaderboardId, isRealTime])

  if (loading) {
    return (
      <ModalWrapper onClose={onClose}>
        <LoadingSpinner message="Loading leaderboard..." />
      </ModalWrapper>
    )
  }

  if (!leaderboardData) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="text-center py-20">
          <p className="text-white">Leaderboard not found</p>
        </div>
      </ModalWrapper>
    )
  }

  return (
    <ModalWrapper onClose={onClose}>
      <LeaderboardHeader
        data={leaderboardData}
        isRealTime={isRealTime}
        lastUpdate={lastUpdate}
        onToggleRealTime={() => setIsRealTime(!isRealTime)}
        onClose={onClose}
      />
      <PlayerList players={leaderboardData.players} isRealTime={isRealTime} />
    </ModalWrapper>
  )
}
