"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockDataService } from "@/lib/mock-data-service"

export default function CreateLeaderboard() {
  const [isCreating, setIsCreating] = useState(false)
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

  return (
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
  )
}
