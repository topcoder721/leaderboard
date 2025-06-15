"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Crown, Coins, Clock, Users, Zap } from "lucide-react"
import { mockDataService, type LeaderboardData } from "./mock-data-service"

interface RealTimeLeaderboardProps {
  leaderboardId: string
  onClose: () => void
}

export default function RealTimeLeaderboard({ leaderboardId, onClose }: RealTimeLeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Initial data load
    const loadData = async () => {
      const data = await mockDataService.getLeaderboardData(leaderboardId, 50)
      setLeaderboardData(data)
      setLoading(false)
    }

    loadData()

    // Setup real-time updates
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-white/20">
          <CardContent className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading leaderboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!leaderboardData) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-white/20">
          <CardContent className="text-center py-20">
            <p className="text-white">Leaderboard not found</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-white/20 overflow-hidden">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              {leaderboardData.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsRealTime(!isRealTime)}
                variant={isRealTime ? "default" : "outline"}
                size="sm"
                className={
                  isRealTime ? "bg-green-600 hover:bg-green-700" : "border-white/20 text-white hover:bg-white/10"
                }
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

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Coins className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">${leaderboardData.totalPrizePool.toLocaleString()}</div>
              <div className="text-xs text-blue-200">Total Prize Pool</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{leaderboardData.playerCount.toLocaleString()}</div>
              <div className="text-xs text-blue-200">Players</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Clock className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{leaderboardData.timeLeft}</div>
              <div className="text-xs text-blue-200">Time Left</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Zap className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">
                {isRealTime ? lastUpdate.toLocaleTimeString() : "Static"}
              </div>
              <div className="text-xs text-blue-200">Last Update</div>
            </div>
          </div>
        </CardHeader>

        {/* Leaderboard */}
        <CardContent className="overflow-y-auto max-h-[60vh] space-y-2">
          {leaderboardData.players.map((player, index) => (
            <div
              key={player.id}
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
                    {isRealTime && index < 10 && (
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
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
