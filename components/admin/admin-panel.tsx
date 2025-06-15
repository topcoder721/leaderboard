"use client"

import { useState } from "react"
import { X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockDataService } from "@/lib/mock-data-service"

interface AdminPanelProps {
  onClose: () => void
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
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

  const handleCreateLeaderboard = async () => {
    setIsCreating(true)
    try {
      const id = await mockDataService.createLeaderboard(newLeaderboard)
      console.log("Created leaderboard with ID:", id)
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

  const handleSimulateActivity = async () => {
    setIsSimulating(true)
    try {
      // Simulate random player activity
      await mockDataService.simulatePlayerSpin("player-1-1", "1", Math.floor(Math.random() * 10) + 1)
      console.log("Simulated player activity")
    } catch (error) {
      console.error("Failed to simulate activity:", error)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50">
      <div className="max-w-md mx-auto h-full bg-gradient-to-b from-purple-900 via-purple-800 to-black overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-green-400" />
              Admin Panel
            </h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white/70 hover:text-white p-2">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Create Tournament Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Create Tournament</h3>

              <div>
                <Label htmlFor="name" className="text-white text-sm">
                  Tournament Name
                </Label>
                <Input
                  id="name"
                  value={newLeaderboard.name}
                  onChange={(e) => setNewLeaderboard({ ...newLeaderboard, name: e.target.value })}
                  placeholder="Enter tournament name"
                  className="bg-purple-700/30 border-purple-600 text-white placeholder:text-purple-300"
                />
              </div>

              <div>
                <Label htmlFor="prizePool" className="text-white text-sm">
                  Prize Pool
                </Label>
                <Input
                  id="prizePool"
                  type="number"
                  value={newLeaderboard.totalPrizePool}
                  onChange={(e) => setNewLeaderboard({ ...newLeaderboard, totalPrizePool: Number(e.target.value) })}
                  placeholder="400"
                  className="bg-purple-700/30 border-purple-600 text-white placeholder:text-purple-300"
                />
              </div>

              <Button
                onClick={handleCreateLeaderboard}
                disabled={isCreating || !newLeaderboard.name}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold"
              >
                {isCreating ? "Creating..." : "Create Tournament"}
              </Button>
            </div>

            {/* Simulate Activity Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Simulate Activity</h3>

              <Button
                onClick={handleSimulateActivity}
                disabled={isSimulating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                {isSimulating ? "Simulating..." : "Simulate Player Activity"}
              </Button>
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">System Stats</h3>

              <div className="bg-purple-700/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-white">
                  <span>Total Players:</span>
                  <span className="text-green-400">32,847</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Active Tournaments:</span>
                  <span className="text-green-400">4</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total Prize Pool:</span>
                  <span className="text-green-400">3,577</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
