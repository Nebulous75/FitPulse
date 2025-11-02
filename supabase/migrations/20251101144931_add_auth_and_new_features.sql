/*
  # Add Authentication and New Features

  1. New Tables
    - `workouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `mood` (text) - mood at time of workout
      - `heart_rate` (integer) - detected heart rate
      - `workout_type` (text) - type of workout recommended
      - `intensity` (text) - low, medium, high
      - `duration_minutes` (integer)
      - `music_playlist` (jsonb) - recommended music
      - `created_at` (timestamptz)
    
    - `body_scans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `image_url` (text) - stored image reference
      - `analysis` (jsonb) - AI analysis results
      - `progress_notes` (text)
      - `created_at` (timestamptz)
    
    - `heart_rate_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `heart_rate` (integer)
      - `recorded_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Workouts Table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text DEFAULT '',
  heart_rate integer,
  workout_type text DEFAULT '',
  intensity text DEFAULT 'medium',
  duration_minutes integer DEFAULT 30,
  music_playlist jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
  ON workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON workouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Body Scans Table
CREATE TABLE IF NOT EXISTS body_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text,
  analysis jsonb DEFAULT '{}'::jsonb,
  progress_notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE body_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own body scans"
  ON body_scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body scans"
  ON body_scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own body scans"
  ON body_scans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Heart Rate Logs Table
CREATE TABLE IF NOT EXISTS heart_rate_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  heart_rate integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE heart_rate_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own heart rate logs"
  ON heart_rate_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own heart rate logs"
  ON heart_rate_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update existing user_profiles to link with auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_body_scans_user_id ON body_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_heart_rate_logs_user_id ON heart_rate_logs(user_id);
