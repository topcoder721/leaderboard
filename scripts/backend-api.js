// Backend API implementation for Gaming Leaderboard System
// This would be implemented as a Node.js + TypeScript + Express server

const express = require("express")
const { Pool } = require("pg")
const Redis = require("redis")
const WebSocket = require("ws")

// Database and Redis setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/leaderboard_db",
})

const redis = Redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
})

const app = express()
app.use(express.json())

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8080 })

// Broadcast leaderboard updates to all connected clients
function broadcastLeaderboardUpdate(leaderboardId, data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "LEADERBOARD_UPDATE",
          leaderboardId,
          data,
        }),
      )
    }
  })
}

// API Endpoints

// 1. POST /create-leaderboard - Create a new leaderboard
app.post("/create-leaderboard", async (req, res) => {
  try {
    const { name, description, startDate, endDate, totalPrizePool, rewardTiers } = req.body

    const client = await pool.connect()
    await client.query("BEGIN")

    // Create leaderboard
    const leaderboardResult = await client.query(
      `INSERT INTO leaderboards (name, description, start_date, end_date, total_prize_pool)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, description, startDate, endDate, totalPrizePool],
    )

    const leaderboardId = leaderboardResult.rows[0].id

    // Create reward tiers
    for (const tier of rewardTiers) {
      await client.query(
        `INSERT INTO reward_tiers (leaderboard_id, position_from, position_to, reward_amount)
         VALUES ($1, $2, $3, $4)`,
        [leaderboardId, tier.positionFrom, tier.positionTo, tier.rewardAmount],
      )
    }

    await client.query("COMMIT")
    client.release()

    // Clear cache
    await redis.del(`leaderboards:*`)

    res.json({ success: true, leaderboardId })
  } catch (error) {
    console.error("Error creating leaderboard:", error)
    res.status(500).json({ error: "Failed to create leaderboard" })
  }
})

// 2. POST /register-player - Register player to leaderboard
app.post("/register-player", async (req, res) => {
  try {
    const { playerId, leaderboardId } = req.body

    await pool.query(
      `INSERT INTO player_leaderboard_registrations (player_id, leaderboard_id)
       VALUES ($1, $2) ON CONFLICT (player_id, leaderboard_id) DO NOTHING`,
      [playerId, leaderboardId],
    )

    // Clear cache
    await redis.del(`leaderboard:${leaderboardId}:*`)

    res.json({ success: true })
  } catch (error) {
    console.error("Error registering player:", error)
    res.status(500).json({ error: "Failed to register player" })
  }
})

// 3. POST /player-spin - Record a player spin
app.post("/player-spin", async (req, res) => {
  try {
    const { playerId, leaderboardId, betAmount } = req.body

    const client = await pool.connect()
    await client.query("BEGIN")

    // Insert spin
    await client.query(
      `INSERT INTO player_spins (player_id, leaderboard_id, bet_amount)
       VALUES ($1, $2, $3)`,
      [playerId, leaderboardId, betAmount],
    )

    // Recalculate leaderboard positions
    await client.query("SELECT recalculate_leaderboard_positions($1)", [leaderboardId])

    await client.query("COMMIT")
    client.release()

    // Clear cache and get updated leaderboard
    await redis.del(`leaderboard:${leaderboardId}:*`)

    const updatedLeaderboard = await getLeaderboardData(leaderboardId, 50)

    // Broadcast update via WebSocket
    broadcastLeaderboardUpdate(leaderboardId, updatedLeaderboard)

    res.json({ success: true })
  } catch (error) {
    console.error("Error recording spin:", error)
    res.status(500).json({ error: "Failed to record spin" })
  }
})

// 4. GET /leaderboard/:leaderboardId - Get top N players
app.get("/leaderboard/:leaderboardId", async (req, res) => {
  try {
    const { leaderboardId } = req.params
    const limit = Number.parseInt(req.query.limit) || 50

    const cacheKey = `leaderboard:${leaderboardId}:top:${limit}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      return res.json(JSON.parse(cached))
    }

    const data = await getLeaderboardData(leaderboardId, limit)

    // Cache for 30 seconds
    await redis.setex(cacheKey, 30, JSON.stringify(data))

    res.json(data)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    res.status(500).json({ error: "Failed to fetch leaderboard" })
  }
})

// 5. GET /leaderboard/:leaderboardId/:playerId - Get player rank with context
app.get("/leaderboard/:leaderboardId/:playerId", async (req, res) => {
  try {
    const { leaderboardId, playerId } = req.params

    const cacheKey = `leaderboard:${leaderboardId}:player:${playerId}`
    const cached = await redis.get(cacheKey)

    if (cached) {
      return res.json(JSON.parse(cached))
    }

    // Get player's position
    const playerResult = await pool.query(
      `SELECT lp.position, lp.total_score, lp.reward_amount, p.name
       FROM leaderboard_positions lp
       JOIN players p ON lp.player_id = p.id
       WHERE lp.leaderboard_id = $1 AND lp.player_id = $2`,
      [leaderboardId, playerId],
    )

    if (playerResult.rows.length === 0) {
      return res.status(404).json({ error: "Player not found in leaderboard" })
    }

    const playerPosition = playerResult.rows[0].position

    // Get 5 players above and below
    const contextResult = await pool.query(
      `SELECT lp.position, lp.total_score, lp.reward_amount, p.name, p.id
       FROM leaderboard_positions lp
       JOIN players p ON lp.player_id = p.id
       WHERE lp.leaderboard_id = $1 
       AND lp.position BETWEEN $2 AND $3
       ORDER BY lp.position`,
      [leaderboardId, Math.max(1, playerPosition - 5), playerPosition + 5],
    )

    const data = {
      player: playerResult.rows[0],
      context: contextResult.rows,
    }

    // Cache for 30 seconds
    await redis.setex(cacheKey, 30, JSON.stringify(data))

    res.json(data)
  } catch (error) {
    console.error("Error fetching player rank:", error)
    res.status(500).json({ error: "Failed to fetch player rank" })
  }
})

// Helper function to get leaderboard data
async function getLeaderboardData(leaderboardId, limit) {
  const leaderboardResult = await pool.query(
    `SELECT l.*, COUNT(plr.player_id) as player_count
     FROM leaderboards l
     LEFT JOIN player_leaderboard_registrations plr ON l.id = plr.leaderboard_id
     WHERE l.id = $1
     GROUP BY l.id`,
    [leaderboardId],
  )

  const playersResult = await pool.query(
    `SELECT lp.position, lp.total_score, lp.reward_amount, p.name, p.id
     FROM leaderboard_positions lp
     JOIN players p ON lp.player_id = p.id
     WHERE lp.leaderboard_id = $1
     ORDER BY lp.position
     LIMIT $2`,
    [leaderboardId, limit],
  )

  return {
    leaderboard: leaderboardResult.rows[0],
    players: playersResult.rows,
  }
}

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Leaderboard API server running on port ${PORT}`)
})

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New WebSocket connection")

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message)
      if (data.type === "SUBSCRIBE_LEADERBOARD") {
        ws.leaderboardId = data.leaderboardId
      }
    } catch (error) {
      console.error("WebSocket message error:", error)
    }
  })

  ws.on("close", () => {
    console.log("WebSocket connection closed")
  })
})

console.log("WebSocket server running on port 8080")
