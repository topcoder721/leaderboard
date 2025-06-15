"use client"

export interface Player {
  id: string
  name: string
  position: number
  score: number
  reward: number
  avatar?: string
}

export interface Leaderboard {
  id: string
  name: string
  startDate: string
  endDate: string
  totalPrizePool: number
  playerCount: number
  status: "active" | "upcoming" | "ended"
}

export interface LeaderboardData {
  id: string
  name: string
  totalPrizePool: number
  playerCount: number
  timeLeft: string
  players: Player[]
}

class MockDataService {
  private static instance: MockDataService
  private leaderboards: Map<string, Leaderboard> = new Map()
  private leaderboardPlayers: Map<string, Player[]> = new Map()

  private constructor() {
    this.initializeMockData()
  }

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService()
    }
    return MockDataService.instance
  }

  private initializeMockData() {
    const mockLeaderboards: Leaderboard[] = [
      {
        id: "1",
        name: "Weekly Puzzle Championship",
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-01-22T23:59:59Z",
        totalPrizePool: 400,
        playerCount: 1247,
        status: "active",
      },
      {
        id: "2",
        name: "Monthly Brain Challenge",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-31T23:59:59Z",
        totalPrizePool: 1500,
        playerCount: 8934,
        status: "active",
      },
      {
        id: "3",
        name: "Speed Puzzle Blitz",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-07T23:59:59Z",
        totalPrizePool: 800,
        playerCount: 5621,
        status: "ended",
      },
      {
        id: "4",
        name: "Valentine's Puzzle Special",
        startDate: "2024-02-14T00:00:00Z",
        endDate: "2024-02-21T23:59:59Z",
        totalPrizePool: 600,
        playerCount: 0,
        status: "upcoming",
      },
      {
        id: "5",
        name: "Spring Mind Games",
        startDate: "2024-03-01T00:00:00Z",
        endDate: "2024-03-31T23:59:59Z",
        totalPrizePool: 1200,
        playerCount: 12456,
        status: "active",
      },
      {
        id: "6",
        name: "Lucky 7s Puzzle Tournament",
        startDate: "2024-01-20T00:00:00Z",
        endDate: "2024-01-27T23:59:59Z",
        totalPrizePool: 777,
        playerCount: 3421,
        status: "active",
      },
    ]

    mockLeaderboards.forEach((lb) => {
      this.leaderboards.set(lb.id, lb)
      this.leaderboardPlayers.set(lb.id, this.generatePlayersForLeaderboard(lb.id))
    })
  }

  private generatePlayersForLeaderboard(leaderboardId: string): Player[] {
    const names = [
      "Dan K.",
      "On D.",
      "Adam S.",
      "Sharon O.",
      "Danielle Z.",
      "James I.",
      "Me",
      "Alex M.",
      "Sarah L.",
      "Mike R.",
      "Emma T.",
      "Chris P.",
      "Lisa W.",
      "Ryan B.",
      "Maya C.",
      "Tom H.",
      "Nina F.",
      "Jake S.",
      "Amy R.",
      "Ben L.",
    ]

    return names.map((name, index) => ({
      id: `player-${leaderboardId}-${index + 1}`,
      name,
      position: index + 1,
      score: Math.floor(Math.random() * 50) + 10 + (20 - index),
      reward: this.calculateReward(index + 1, leaderboardId),
    }))
  }

  private calculateReward(position: number, leaderboardId: string): number {
    const rewardStructures = {
      "1": [100, 50, 30, 20, 15, 10, 10, 5, 5, 5], // Weekly Championship
      "2": [200, 150, 100, 75, 50, 40, 30, 25, 20, 15], // Monthly Challenge
      "3": [80, 60, 40, 25, 20, 15, 10, 10, 5, 5], // Speed Blitz
      "4": [75, 50, 35, 25, 20, 15, 10, 10, 5, 5], // Valentine's Special
      "5": [150, 100, 75, 50, 40, 30, 25, 20, 15, 10], // Spring Games
      "6": [77, 55, 33, 22, 11, 7, 7, 5, 3, 1], // Lucky 7s
    }

    const rewards = rewardStructures[leaderboardId as keyof typeof rewardStructures] || [
      50, 30, 20, 10, 5, 5, 5, 5, 5, 5,
    ]
    return position <= rewards.length ? rewards[position - 1] : 0
  }

  public async getLeaderboards(): Promise<Leaderboard[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return Array.from(this.leaderboards.values())
  }

  public async getLeaderboardData(leaderboardId: string, limit = 50): Promise<LeaderboardData | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const leaderboard = this.leaderboards.get(leaderboardId)
    const players = this.leaderboardPlayers.get(leaderboardId)

    if (!leaderboard || !players) return null

    return {
      id: leaderboard.id,
      name: leaderboard.name,
      totalPrizePool: leaderboard.totalPrizePool,
      playerCount: leaderboard.playerCount,
      timeLeft: this.calculateTimeLeft(leaderboard.endDate, leaderboard.status),
      players: players.slice(0, limit),
    }
  }

  private calculateTimeLeft(endDate: string, status: string): string {
    if (status === "ended") return "Ended"
    if (status === "upcoming") {
      const start = new Date(endDate)
      const now = new Date()
      const diff = start.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      return `Starts in ${days}d`
    }

    // For active tournaments, show a countdown timer
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    // Return formatted time like "04:01:10"
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:10`
  }

  public subscribeToLeaderboardUpdates(leaderboardId: string, callback: (data: LeaderboardData) => void) {
    const interval = setInterval(async () => {
      const data = await this.getLeaderboardData(leaderboardId)
      if (data) {
        // Simulate score changes
        data.players.forEach((player) => {
          if (Math.random() < 0.1) {
            player.score += Math.floor(Math.random() * 5) + 1
          }
        })

        // Re-sort players by score
        data.players.sort((a, b) => b.score - a.score)
        data.players.forEach((player, index) => {
          player.position = index + 1
          player.reward = this.calculateReward(player.position, leaderboardId)
        })

        callback(data)
      }
    }, 3000)

    return () => clearInterval(interval)
  }

  public async createLeaderboard(data: Omit<Leaderboard, "id">): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const id = (this.leaderboards.size + 1).toString()
    const leaderboard: Leaderboard = { ...data, id }
    this.leaderboards.set(id, leaderboard)
    this.leaderboardPlayers.set(id, this.generatePlayersForLeaderboard(id))
    return id
  }

  public async simulatePlayerSpin(playerId: string, leaderboardId: string, betAmount: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const players = this.leaderboardPlayers.get(leaderboardId)
    if (players) {
      const player = players.find((p) => p.id === playerId)
      if (player) {
        player.score += betAmount
        // Re-sort and update positions
        players.sort((a, b) => b.score - a.score)
        players.forEach((p, index) => {
          p.position = index + 1
          p.reward = this.calculateReward(p.position, leaderboardId)
        })
      }
    }

    return true
  }
}

export const mockDataService = MockDataService.getInstance()
