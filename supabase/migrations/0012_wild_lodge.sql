-- Add name column to expenses table
ALTER TABLE expenses 
  ADD COLUMN IF NOT EXISTS name text;

-- Create index for name column
CREATE INDEX IF NOT EXISTS idx_expenses_name ON expenses(name);