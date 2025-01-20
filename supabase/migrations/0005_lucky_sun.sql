/*
  # Add Budget Management Columns

  1. Changes
    - Add total_budget column to budgets table
    - Add budget_locked column to budgets table
    - Create budget_lock_history table for tracking budget locks

  2. Security
    - Enable RLS on budget_lock_history table
    - Add policies for user access control
*/

-- Add new columns to budgets table
ALTER TABLE budgets 
  ADD COLUMN IF NOT EXISTS total_budget decimal(10,2),
  ADD COLUMN IF NOT EXISTS budget_locked boolean DEFAULT false;

-- Create budget lock history table if not exists
CREATE TABLE IF NOT EXISTS budget_lock_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_budget decimal(10,2) NOT NULL,
  locked_at timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE budget_lock_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own budget history" ON budget_lock_history;
    DROP POLICY IF EXISTS "Users can insert their own budget history" ON budget_lock_history;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create policies for budget_lock_history
CREATE POLICY "Users can view their own budget history"
  ON budget_lock_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget history"
  ON budget_lock_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_budget_lock_history_user_id 
  ON budget_lock_history(user_id);