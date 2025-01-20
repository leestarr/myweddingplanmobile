/*
  # Add Expense Categories Support
  
  1. New Tables
    - expense_categories
      - id (uuid, primary key) 
      - user_id (uuid, foreign key to auth.users)
      - name (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Changes
    - Add category_id to expenses table
    - Add foreign key constraint
    - Add indexes for performance

  3. Security
    - Enable RLS on expense_categories
    - Add policies for authenticated users
*/

-- Create expense categories table
CREATE TABLE IF NOT EXISTS expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own categories"
  ON expense_categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON expense_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON expense_categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON expense_categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for expense_categories
CREATE INDEX IF NOT EXISTS idx_expense_categories_user_id ON expense_categories(user_id);

-- Add category_id to expenses table
ALTER TABLE expenses 
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES expense_categories(id) ON DELETE SET NULL;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);

-- Create default categories for existing users
DO $$ 
DECLARE
  current_user uuid;
BEGIN
  FOR current_user IN SELECT DISTINCT user_id FROM expenses
  LOOP
    -- Create 'Other' category if it doesn't exist
    INSERT INTO expense_categories (user_id, name)
    SELECT current_user, 'Other'
    WHERE NOT EXISTS (
      SELECT 1 FROM expense_categories 
      WHERE user_id = current_user AND name = 'Other'
    );
  END LOOP;
END $$;