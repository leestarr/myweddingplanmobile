/*
  # Add RLS Policies for Guests Table

  1. Security
    - Enable RLS on guests table
    - Add policies for CRUD operations
    - Ensure users can only access their own guests
*/

-- Enable RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own guests" ON guests;
DROP POLICY IF EXISTS "Users can create their own guests" ON guests;
DROP POLICY IF EXISTS "Users can update their own guests" ON guests;
DROP POLICY IF EXISTS "Users can delete their own guests" ON guests;

-- Create policies
CREATE POLICY "Users can view their own guests"
  ON guests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guests"
  ON guests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guests"
  ON guests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guests"
  ON guests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);