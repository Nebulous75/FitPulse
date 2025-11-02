/*
  # FitPulse Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `goals` (text array) - fitness goals (lose weight, gain weight, etc.)
      - `lifestyle` (text) - active, moderate, sedentary
      - `region` (text) - user's country/region
      - `age` (integer) - user's age
      - `sex` (text) - male, female, other
      - `weight` (numeric) - weight value
      - `weight_unit` (text) - kg, lbs
      - `height` (numeric) - height value
      - `height_unit` (text) - cm, ft/in
      - `bmi` (numeric) - calculated BMI
      - `daily_calorie_limit` (integer) - calculated daily calorie target
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `meals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `name` (text) - meal name
      - `calories` (integer) - total calories
      - `ingredients` (jsonb) - list of ingredients with amounts and calories
      - `recipe` (text) - preparation instructions
      - `cuisine` (text) - cuisine type
      - `mood` (text) - mood when meal was suggested
      - `video_url` (text, optional) - link to recipe video
      - `created_at` (timestamptz)
    
    - `badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `name` (text) - badge name
      - `description` (text) - badge description
      - `xp_points` (integer) - points earned
      - `earned_at` (timestamptz)
    
    - `mood_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `mood` (text) - happy, tired, stressed, energetic
      - `logged_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goals text[] DEFAULT '{}',
  lifestyle text DEFAULT '',
  region text DEFAULT '',
  age integer,
  sex text DEFAULT '',
  weight numeric,
  weight_unit text DEFAULT 'kg',
  height numeric,
  height_unit text DEFAULT 'cm',
  bmi numeric,
  daily_calorie_limit integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Meals Table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  calories integer DEFAULT 0,
  ingredients jsonb DEFAULT '[]'::jsonb,
  recipe text DEFAULT '',
  cuisine text DEFAULT '',
  mood text DEFAULT '',
  video_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  xp_points integer DEFAULT 0,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Mood Logs Table
CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  mood text NOT NULL,
  logged_at timestamptz DEFAULT now()
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mood logs"
  ON mood_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood logs"
  ON mood_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id);
