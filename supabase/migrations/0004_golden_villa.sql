/*
  # Add Budget Lock Feature
  
  1. Changes
    - Add total_budget and budget_locked columns to budgets table
    - Create budget_lock_history table for tracking budget locks
    - Add RLS policies and indexes
    
  2. Security
    - Enable RLS on budget_lock_history
    - Add policies for authenticated users
*/

-- Add new columns to budgets table
DO $$ 
BEGIN
  ALTER TABLE budgets 
    ADD COLUMN IF NOT EXISTS total_budget decimal(10,2),
    ADD COLUMN IF NOT EXISTS budget_locked boolean DEFAULT false;
EXCEPTION
  WHEN undefined_table THEN
    CREATE TABLE budgets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      total_budget decimal(10,2),
      budget_locked boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
END $$;

-- Create budget lock history table
CREATE TABLE IF NOT EXISTS budget_lock_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_budget decimal(10,2) NOT NULL,
  locked_at timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE budget_lock_history ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own budget history" ON budget_lock_history;
  DROP POLICY IF EXISTS "Users can insert their own budget history" ON budget_lock_history;
  
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
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_budget_lock_history_user_id ON budget_lock_history(user_id);