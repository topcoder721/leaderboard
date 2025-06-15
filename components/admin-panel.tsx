"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Users, TrendingUp, Zap } from "lucide-react"
import { mockDataService } from "./mock-data-service"

interface AdminPanelProps {
  onClose: () => void
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"create" | "simulate" | "stats">("create")
  const [isCreating, setIsCreating] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const [newLeaderboard, setNewLeaderboard] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    totalPrizePool: 0,
    status: "upcoming" as const,
  })

  const [simulationData, setSimulationData] = useState({
    leaderboardId: "1",
    playerId: "player-1-1",
    betAmount: 1000,
  })

  const handleCreateLeaderboard = async () => {
    setIsCreating(true)
    try {
      const id = await mockDataService.createLeaderboard(newLeaderboard)
      console.log("Created leaderboard with ID:", id)
      // Reset form
      setNewLeaderboard({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        totalPrizePool: 0,
        status: "upcoming",
      })
    } catch (error) {
      console.error("Failed to create leaderboard:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSimulateSpin = async () => {
    setIsSimulating(true)
    try {
      await mockDataService.recordPlayerSpin(
        simulationData.playerId,
        simulationData.leaderboardId,
        simulationData.betAmount,
      )
      console.log("Simulated spin recorded")
    } catch (error) {
      console.error("Failed to simulate spin:", error)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-white/20 overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-400" />
              Admin Panel
            </CardTitle>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Close
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setActiveTab("create")}
              variant={activeTab === "create" ? "default" : "outline"}
              size="sm"
              className={activeTab === "create" ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Leaderboard
            </Button>
            <Button
              onClick={() => setActiveTab("simulate")}
              variant={activeTab === "simulate" ? "default" : "outline"}
              size="sm"
              className={activeTab === "simulate" ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
            >
              <Zap className="h-4 w-4 mr-1" />
              Simulate Activity
            </Button>
            <Button
              onClick={() => setActiveTab("stats")}
              variant={activeTab === "stats" ? "default" : "outline"}
              size="sm"
              className={activeTab === "stats" ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Statistics
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[70vh]">
          {activeTab === "create" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Create New Leaderboard</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Tournament Name
                  </Label>
                  <Input
                    id="name"
                    value={newLeaderboard.name}
                    onChange={(e) => setNewLeaderboard({ ...newLeaderboard, name: e.target.value })}
                    placeholder="Enter tournament name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="prizePool" className="text-white">
                    Total Prize Pool ($)
                  </Label>
                  <Input
                    id="prizePool"
                    type="number"
                    value={newLeaderboard.totalPrizePool}
                    onChange={(e) => setNewLeaderboard({ ...newLeaderboard, totalPrizePool: Number(e.target.value) })}
                    placeholder="50000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="startDate" className="text-white">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={newLeaderboard.startDate}
                    onChange={(e) => setNewLeaderboard({ ...newLeaderboard, startDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="endDate" className="text-white">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={newLeaderboard.endDate}
                    onChange={(e) => setNewLeaderboard({ ...newLeaderboard, endDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newLeaderboard.description}
                  onChange={(e) => setNewLeaderboard({ ...newLeaderboard, description: e.target.value })}
                  placeholder="Tournament description"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <Button
                onClick={handleCreateLeaderboard}
                disabled={isCreating || !newLeaderboard.name}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isCreating ? "Creating..." : "Create Leaderboard"}
              </Button>
            </div>
          )}

          {activeTab === "simulate" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Simulate Player Activity</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="leaderboardId" className="text-white">
                    Leaderboard ID
                  </Label>
                  <Input
                    id="leaderboardId"
                    value={simulationData.leaderboardId}
                    onChange={(e) => setSimulationData({ ...simulationData, leaderboardId: e.target.value })}
                    placeholder="1"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="playerId" className="text-white">
                    Player ID
                  </Label>
                  <Input
                    id="playerId"
                    value={simulationData.playerId}
                    onChange={(e) => setSimulationData({ ...simulationData, playerId: e.target.value })}
                    placeholder="player-1-1"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="betAmount" className="text-white">
                    Bet Amount
                  </Label>
                  <Input
                    id="betAmount"
                    type="number"
                    value={simulationData.betAmount}
                    onChange={(e) => setSimulationData({ ...simulationData, betAmount: Number(e.target.value) })}
                    placeholder="1000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <Button
                onClick={handleSimulateSpin}
                disabled={isSimulating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSimulating ? "Simulating..." : "Simulate Player Spin"}
              </Button>

              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      // Simulate multiple random spins
                      for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                          mockDataService.recordPlayerSpin(
                            `player-1-${Math.floor(Math.random() * 10) + 1}`,
                            "1",
                            Math.floor(Math.random() * 5000) + 500,
                          )
                        }, i * 1000)
                      }
                    }}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Random Spins
                  </Button>
                  <Button
                    onClick={() => {
                      // Simulate high roller activity
                      mockDataService.recordPlayerSpin("player-2-1", "2", 25000)
                    }}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    High Roller
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">System Statistics</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">32,847</div>
                    <div className="text-sm text-blue-200">Total Players</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">1,247,892</div>
                    <div className="text-sm text-blue-200">Total Spins</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">$2.4M</div>
                    <div className="text-sm text-blue-200">Total Wagered</div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-4">Active Leaderboards Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Weekly Spin Championship</span>
                    <Badge className="bg-green-500/20 text-green-400">1,247 players</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Monthly High Roller</span>
                    <Badge className="bg-blue-500/20 text-blue-400">8,934 players</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Spring Madness</span>
                    <Badge className="bg-purple-500/20 text-purple-400">12,456 players</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
