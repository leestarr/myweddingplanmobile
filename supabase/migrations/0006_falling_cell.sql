/*
  # Add Budget Table Policies

  1. Changes
    - Add RLS policies for budgets table to allow users to manage their own budgets
    
  2. Security
    - Enable RLS on budgets table if not already enabled
    - Add policies for CRUD operations on budgets
*/

-- Enable RLS on budgets table
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own budgets" ON budgets;
    DROP POLICY IF EXISTS "Users can insert their own budgets" ON budgets;
    DROP POLICY IF EXISTS "Users can update their own budgets" ON budgets;
    DROP POLICY IF EXISTS "Users can delete their own budgets" ON budgets;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create policies for budgets table
CREATE POLICY "Users can view their own budgets"
  ON budgets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON budgets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON budgets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);