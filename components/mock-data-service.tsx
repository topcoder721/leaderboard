"use client"

// Mock Data Service for Gaming Leaderboard System
// This simulates the backend API responses with realistic data

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

export interface PlayerSpinData {
  playerId: string
  leaderboardId: string
  betAmount: number
  timestamp: string
}

class MockDataService {
  private static instance: MockDataService
  private leaderboards: Map<string, Leaderboard> = new Map()
  private leaderboardPlayers: Map<string, Player[]> = new Map()
  private playerSpins: PlayerSpinData[] = []

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
    // Initialize leaderboards
    const mockLeaderboards: Leaderboard[] = [
      {
        id: "1",
        name: "Weekly Spin Championship",
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-01-22T23:59:59Z",
        totalPrizePool: 50000,
        playerCount: 1247,
        status: "active",
      },
      {
        id: "2",
        name: "Monthly High Roller",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-31T23:59:59Z",
        totalPrizePool: 250000,
        playerCount: 8934,
        status: "active",
      },
      {
        id: "3",
        name: "New Year Blitz",
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-07T23:59:59Z",
        totalPrizePool: 100000,
        playerCount: 5621,
        status: "ended",
      },
      {
        id: "4",
        name: "Valentine's Special",
        startDate: "2024-02-14T00:00:00Z",
        endDate: "2024-02-21T23:59:59Z",
        totalPrizePool: 75000,
        playerCount: 0,
        status: "upcoming",
      },
      {
        id: "5",
        name: "Spring Madness",
        startDate: "2024-03-01T00:00:00Z",
        endDate: "2024-03-31T23:59:59Z",
        totalPrizePool: 180000,
        playerCount: 12456,
        status: "active",
      },
      {
        id: "6",
        name: "Lucky 7s Tournament",
        startDate: "2024-01-20T00:00:00Z",
        endDate: "2024-01-27T23:59:59Z",
        totalPrizePool: 77777,
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
    const firstNames = [
      "Alex",
      "Jordan",
      "Casey",
      "Morgan",
      "Taylor",
      "Riley",
      "Avery",
      "Quinn",
      "Sage",
      "River",
      "Phoenix",
      "Skyler",
      "Cameron",
      "Blake",
      "Drew",
      "Emery",
      "Finley",
      "Harper",
      "Indigo",
      "Kai",
      "Logan",
      "Marley",
      "Nova",
      "Ocean",
      "Parker",
      "Rowan",
      "Storm",
      "Tatum",
      "Vale",
      "Wren",
      "Zion",
      "Aria",
      "Blaze",
      "Cove",
      "Delta",
      "Echo",
      "Frost",
      "Grove",
      "Haven",
      "Iris",
      "Jade",
      "Knox",
      "Luna",
      "Mist",
      "Nyx",
      "Onyx",
      "Paz",
      "Quest",
      "Rain",
      "Sol",
    ]

    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
      "Lee",
      "Perez",
      "Thompson",
      "White",
      "Harris",
      "Sanchez",
      "Clark",
      "Ramirez",
      "Lewis",
      "Robinson",
      "Walker",
      "Young",
      "Allen",
      "King",
      "Wright",
      "Scott",
      "Torres",
      "Nguyen",
      "Hill",
      "Flores",
      "Green",
      "Adams",
      "Nelson",
      "Baker",
      "Hall",
      "Rivera",
      "Campbell",
      "Mitchell",
      "Carter",
      "Roberts",
    ]

    const rewardStructures = {
      "1": [10000, 7500, 5000, 3000, 2000, 1500, 1000, 750, 500, 250], // Weekly Championship
      "2": [50000, 35000, 25000, 15000, 15000, 10000, 10000, 10000, 10000, 10000], // Monthly High Roller
      "3": [20000, 15000, 10000, 7500, 5000, 3000, 2000, 1500, 1000, 500], // New Year Blitz
      "4": [15000, 10000, 7500, 5000, 3000, 2000, 1500, 1000, 750, 500], // Valentine's Special
      "5": [35000, 25000, 18000, 12000, 10000, 8000, 6000, 4000, 3000, 2000], // Spring Madness
      "6": [7777, 5555, 3333, 2222, 1111, 777, 555, 333, 222, 111], // Lucky 7s
    }

    return Array.from({ length: 50 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

      // Create realistic score distribution
      let baseScore = 200000 - i * 3000 // Top players have higher scores
      baseScore += Math.floor(Math.random() * 8000) - 4000 // Add randomness

      // Get reward based on leaderboard and position
      const rewards = rewardStructures[leaderboardId as keyof typeof rewardStructures] || []
      let reward = 0

      if (i < rewards.length) {
        reward = rewards[i]
      } else if (i < 20) {
        reward = leaderboardId === "2" ? 5000 : leaderboardId === "5" ? 1000 : 100
      } else if (i < 50) {
        reward = leaderboardId === "2" ? 1000 : leaderboardId === "5" ? 500 : 50
      }

      return {
        id: `player-${leaderboardId}-${i + 1}`,
        name: `${firstName} ${lastName}`,
        position: i + 1,
        score: Math.max(baseScore, 1000),
        reward: reward,
      }
    })
  }

  // API Methods
  public async getLeaderboards(): Promise<Leaderboard[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return Array.from(this.leaderboards.values())
  }

  public async getLeaderboardData(leaderboardId: string, limit = 50): Promise<LeaderboardData | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const leaderboard = this.leaderboards.get(leaderboardId)
    const players = this.leaderboardPlayers.get(leaderboardId)

    if (!leaderboard || !players) return null

    const timeLeft = this.calculateTimeLeft(leaderboard.endDate, leaderboard.status)

    return {
      id: leaderboard.id,
      name: leaderboard.name,
      totalPrizePool: leaderboard.totalPrizePool,
      playerCount: leaderboard.playerCount,
      timeLeft,
      players: players.slice(0, limit),
    }
  }

  public async getPlayerRank(
    leaderboardId: string,
    playerId: string,
  ): Promise<{
    player: Player
    context: Player[]
  } | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const players = this.leaderboardPlayers.get(leaderboardId)
    if (!players) return null

    const player = players.find((p) => p.id === playerId)
    if (!player) return null

    // Get 5 players above and below
    const startIndex = Math.max(0, player.position - 6)
    const endIndex = Math.min(players.length, player.position + 5)
    const context = players.slice(startIndex, endIndex)

    return { player, context }
  }

  public async recordPlayerSpin(playerId: string, leaderboardId: string, betAmount: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Record the spin
    this.playerSpins.push({
      playerId,
      leaderboardId,
      betAmount,
      timestamp: new Date().toISOString(),
    })

    // Update player scores (simplified)
    const players = this.leaderboardPlayers.get(leaderboardId)
    if (players) {
      const player = players.find((p) => p.id === playerId)
      if (player) {
        player.score += betAmount
        // Re-sort and update positions
        players.sort((a, b) => b.score - a.score)
        players.forEach((p, index) => {
          p.position = index + 1
        })
      }
    }

    return true
  }

  public async createLeaderboard(data: Omit<Leaderboard, "id">): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const id = (this.leaderboards.size + 1).toString()
    const leaderboard: Leaderboard = { ...data, id }

    this.leaderboards.set(id, leaderboard)
    this.leaderboardPlayers.set(id, this.generatePlayersForLeaderboard(id))

    return id
  }

  public async registerPlayer(playerId: string, leaderboardId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    // In a real implementation, this would add the player to the leaderboard
    // For now, we'll just return success
    return true
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

    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  // WebSocket simulation
  public subscribeToLeaderboardUpdates(leaderboardId: string, callback: (data: LeaderboardData) => void) {
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(async () => {
      const data = await this.getLeaderboardData(leaderboardId)
      if (data) {
        // Simulate small score changes
        data.players.forEach((player) => {
          if (Math.random() < 0.1) {
            // 10% chance of score change
            player.score += Math.floor(Math.random() * 1000)
          }
        })

        // Re-sort players
        data.players.sort((a, b) => b.score - a.score)
        data.players.forEach((player, index) => {
          player.position = index + 1
        })

        callback(data)
      }
    }, 10000)

    return () => clearInterval(interval)
  }
}

export const mockDataService = MockDataService.getInstance()
