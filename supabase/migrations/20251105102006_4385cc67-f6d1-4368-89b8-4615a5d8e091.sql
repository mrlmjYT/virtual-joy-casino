-- Now add constraints (exploited data has been cleaned up)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'balance_non_negative') THEN
    ALTER TABLE profiles ADD CONSTRAINT balance_non_negative CHECK (balance >= 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'balance_max_reasonable') THEN
    ALTER TABLE profiles ADD CONSTRAINT balance_max_reasonable CHECK (balance <= 999999999);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'coins_max_reasonable') THEN
    ALTER TABLE profiles ADD CONSTRAINT coins_max_reasonable CHECK (coins <= 999999999);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experience_reasonable') THEN
    ALTER TABLE profiles ADD CONSTRAINT experience_reasonable CHECK (experience >= 0 AND experience <= 99999999);
  END IF;
END $$;

-- Create audit table
CREATE TABLE IF NOT EXISTS game_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_type text NOT NULL,
  bet_amount bigint NOT NULL,
  win_amount bigint NOT NULL,
  game_data jsonb,
  balance_before bigint NOT NULL,
  balance_after bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own game history" ON game_history;
CREATE POLICY "Users can view own game history"
ON game_history FOR SELECT
USING (auth.uid() = user_id);

-- Create public_profiles view
CREATE OR REPLACE VIEW public_profiles AS 
SELECT id, username, avatar_url, created_at 
FROM profiles;

-- Update RLS policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Users can view all profiles"
ON profiles FOR SELECT
USING (true);