-- Create guest_tables table if it doesn't exist
CREATE TABLE IF NOT EXISTS guest_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  number integer NOT NULL,
  name text,
  capacity integer DEFAULT 8,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add table_id to guests table
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS table_id uuid REFERENCES guest_tables(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE guest_tables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own tables" ON guest_tables;
    DROP POLICY IF EXISTS "Users can create their own tables" ON guest_tables;
    DROP POLICY IF EXISTS "Users can update their own tables" ON guest_tables;
    DROP POLICY IF EXISTS "Users can delete their own tables" ON guest_tables;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Create policies for guest_tables
CREATE POLICY "Users can view their own tables"
  ON guest_tables FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tables"
  ON guest_tables FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tables"
  ON guest_tables FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tables"
  ON guest_tables FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_guest_tables_user_id ON guest_tables(user_id);
CREATE INDEX IF NOT EXISTS idx_guest_tables_number ON guest_tables(number);
CREATE INDEX IF NOT EXISTS idx_guests_table_id ON guests(table_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_guest_tables_updated_at ON guest_tables;

-- Create trigger for updating timestamps
CREATE TRIGGER update_guest_tables_updated_at
  BEFORE UPDATE ON guest_tables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();