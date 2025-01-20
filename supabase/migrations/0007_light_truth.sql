/*
  # Update Budgets Table Schema

  1. Changes
    - Make category column optional for total budget tracking
    - Add default category for total budget entries
    
  2. Security
    - Maintain existing RLS policies
*/

-- Make category column optional and add default
ALTER TABLE budgets 
  ALTER COLUMN category DROP NOT NULL,
  ALTER COLUMN category SET DEFAULT 'total';

-- Update any existing records without a category
UPDATE budgets 
SET category = 'total' 
WHERE category IS NULL;