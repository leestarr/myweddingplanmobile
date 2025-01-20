/*
  # Add Guest Columns

  1. Changes
    - Add missing columns to guests table
    - Add constraints and defaults
    - Create indexes for performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add missing columns to guests table
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS name text NOT NULL,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS type text DEFAULT 'friend',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  ADD COLUMN IF NOT EXISTS meal_preference text DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS dietary_restrictions text,
  ADD COLUMN IF NOT EXISTS plus_one boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS table_number integer;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(name);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_type ON guests(type);
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_meal_preference ON guests(meal_preference);