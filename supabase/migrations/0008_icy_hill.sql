/*
  # Update Budgets Table Schema for Amount Handling

  1. Changes
    - Make amount column optional for total budget entries
    - Add amount column default
    - Update column constraints
    
  2. Security
    - Maintain existing RLS policies
*/

-- Modify amount column to be optional with default
ALTER TABLE budgets 
  ALTER COLUMN amount DROP NOT NULL,
  ALTER COLUMN amount SET DEFAULT 0;

-- Add check constraint to ensure either amount or total_budget is set
ALTER TABLE budgets
  ADD CONSTRAINT budget_amount_check 
  CHECK (
    (category = 'total' AND total_budget IS NOT NULL) OR
    (category != 'total' AND amount IS NOT NULL)
  );

-- Update existing total budget records
UPDATE budgets 
SET amount = 0 
WHERE category = 'total' AND amount IS NULL;