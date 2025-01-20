/*
  # Add Vendor Column to Expenses
  
  1. Changes
    - Add vendor column to expenses table
    - Make it optional (nullable)
    - Add index for performance
*/

-- Add vendor column to expenses table
ALTER TABLE expenses 
  ADD COLUMN IF NOT EXISTS vendor text;

-- Create index for vendor column
CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON expenses(vendor);