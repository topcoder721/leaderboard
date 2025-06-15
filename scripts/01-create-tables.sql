-- Create database schema for gaming leaderboard system

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_prize_pool INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player registrations for leaderboards
CREATE TABLE IF NOT EXISTS player_leaderboard_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, leaderboard_id)
);

-- Player spins (bets)
CREATE TABLE IF NOT EXISTS player_spins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
    bet_amount INTEGER NOT NULL CHECK (bet_amount > 0),
    spin_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard positions (cached rankings)
CREATE TABLE IF NOT EXISTS leaderboard_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,
    reward_amount INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(leaderboard_id, player_id),
    UNIQUE(leaderboard_id, position)
);

-- Reward tiers for leaderboards
CREATE TABLE IF NOT EXISTS reward_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
    position_from INTEGER NOT NULL,
    position_to INTEGER NOT NULL,
    reward_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (position_from <= position_to),
    CHECK (position_from > 0)
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_player_spins_leaderboard_player ON player_spins(leaderboard_id, player_id);
CREATE INDEX IF NOT EXISTS idx_player_spins_time ON player_spins(spin_time);
CREATE INDEX IF NOT EXISTS idx_leaderboard_positions_leaderboard ON leaderboard_positions(leaderboard_id, position);
CREATE INDEX IF NOT EXISTS idx_leaderboards_dates ON leaderboards(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);

-- Function to update leaderboard status based on dates
CREATE OR REPLACE FUNCTION update_leaderboard_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE leaderboards 
    SET status = CASE 
        WHEN NOW() < start_date THEN 'upcoming'
        WHEN NOW() BETWEEN start_date AND end_date THEN 'active'
        ELSE 'ended'
    END
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update leaderboard status
CREATE TRIGGER trigger_update_leaderboard_status
    AFTER INSERT OR UPDATE ON leaderboards
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_status();

-- Function to recalculate leaderboard positions
CREATE OR REPLACE FUNCTION recalculate_leaderboard_positions(leaderboard_uuid UUID)
RETURNS VOID AS $$
DECLARE
    player_record RECORD;
    position_counter INTEGER := 1;
BEGIN
    -- Delete existing positions for this leaderboard
    DELETE FROM leaderboard_positions WHERE leaderboard_id = leaderboard_uuid;
    
    -- Calculate new positions based on total bet amounts
    FOR player_record IN
        SELECT 
            ps.player_id,
            SUM(ps.bet_amount) as total_score
        FROM player_spins ps
        INNER JOIN leaderboards l ON ps.leaderboard_id = l.id
        WHERE ps.leaderboard_id = leaderboard_uuid
        AND ps.spin_time BETWEEN l.start_date AND l.end_date
        GROUP BY ps.player_id
        ORDER BY SUM(ps.bet_amount) DESC
    LOOP
        -- Calculate reward based on position
        INSERT INTO leaderboard_positions (
            leaderboard_id, 
            player_id, 
            position, 
            total_score, 
            reward_amount
        )
        SELECT 
            leaderboard_uuid,
            player_record.player_id,
            position_counter,
            player_record.total_score,
            COALESCE(rt.reward_amount, 0)
        FROM reward_tiers rt
        WHERE rt.leaderboard_id = leaderboard_uuid
        AND position_counter BETWEEN rt.position_from AND rt.position_to
        UNION ALL
        SELECT 
            leaderboard_uuid,
            player_record.player_id,
            position_counter,
            player_record.total_score,
            0
        WHERE NOT EXISTS (
            SELECT 1 FROM reward_tiers rt
            WHERE rt.leaderboard_id = leaderboard_uuid
            AND position_counter BETWEEN rt.position_from AND rt.position_to
        )
        LIMIT 1;
        
        position_counter := position_counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
