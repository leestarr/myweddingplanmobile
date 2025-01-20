/*
  # Update Guest Table Structure and Policies

  1. Changes
    - Add table_number column
    - Create index for table_number
  
  2. Notes
    - Skips policy creation if they already exist
    - Maintains data consistency
*/

-- Add table_number column if it doesn't exist
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS table_number integer;

-- Create index for table_number
CREATE INDEX IF NOT EXISTS idx_guests_table_number ON guests(table_number);

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own guests" ON guests;
    DROP POLICY IF EXISTS "Users can create their own guests" ON guests;
    DROP POLICY IF EXISTS "Users can update their own guests" ON guests;
    DROP POLICY IF EXISTS "Users can delete their own guests" ON guests;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create policies only if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'guests' AND policyname = 'Users can view their own guests'
    ) THEN
        CREATE POLICY "Users can view their own guests"
          ON guests FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'guests' AND policyname = 'Users can create their own guests'
    ) THEN
        CREATE POLICY "Users can create their own guests"
          ON guests FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'guests' AND policyname = 'Users can update their own guests'
    ) THEN
        CREATE POLICY "Users can update their own guests"
          ON guests FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'guests' AND policyname = 'Users can delete their own guests'
    ) THEN
        CREATE POLICY "Users can delete their own guests"
          ON guests FOR DELETE
          TO authenticated
          USING (auth.uid() = user_id);
    END IF;
END $$;