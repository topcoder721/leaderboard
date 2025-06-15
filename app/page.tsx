"use client"

import { useState, useEffect } from "react"
import { mockDataService, type Leaderboard } from "@/lib/mock-data-service"
import Header from "@/components/layout/header"
import LeaderboardGrid from "@/components/leaderboard/leaderboard-grid"
import MobileLeaderboard from "@/components/leaderboard/mobile-leaderboard"
import AdminPanel from "@/components/admin/admin-panel"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function Home() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([])
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    const loadLeaderboards = async () => {
      try {
        const data = await mockDataService.getLeaderboards()
        setLeaderboards(data)
      } catch (error) {
        console.error("Failed to load leaderboards:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboards()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black p-4">
        <div className="max-w-md mx-auto">
          <LoadingSpinner message="Loading leaderboards..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black">
      <div className="max-w-md mx-auto">
        <Header onShowAdmin={() => setShowAdminPanel(true)} />
        <LeaderboardGrid leaderboards={leaderboards} onSelectLeaderboard={setSelectedLeaderboard} />
      </div>

      {selectedLeaderboard && (
        <MobileLeaderboard leaderboardId={selectedLeaderboard} onClose={() => setSelectedLeaderboard(null)} />
      )}

      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </div>
  )
}
