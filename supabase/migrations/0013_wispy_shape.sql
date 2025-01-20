/*
  # Guest Management Schema Update

  1. New Tables
    - guest_tables: For seating arrangements
    - guest_relationships: For tracking couples/families
    - guest_dietary_restrictions: For detailed dietary needs
    - guest_groups: For organizing guests by type/category
    
  2. Updates to guests table
    - Add new columns for enhanced tracking
    - Add proper relationships and constraints
    
  3. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Update guests table with new columns
ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS meal_preference text DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS dietary_restrictions text,
  ADD COLUMN IF NOT EXISTS plus_one boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS guest_type text DEFAULT 'friend',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS table_number integer,
  ADD COLUMN IF NOT EXISTS import_id uuid,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'
  CHECK (status IN ('pending', 'confirmed', 'declined'));

-- Create guest tables for seating arrangement
CREATE TABLE IF NOT EXISTS guest_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  number integer NOT NULL,
  name text,
  capacity integer DEFAULT 8,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guest relationships table
CREATE TABLE IF NOT EXISTS guest_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE,
  related_guest_id uuid REFERENCES guests(id) ON DELETE CASCADE,
  relationship_type text NOT NULL CHECK (relationship_type IN ('partner', 'family', 'friend', 'conflict')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(guest_id, related_guest_id)
);

-- Create guest table assignments
CREATE TABLE IF NOT EXISTS guest_table_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE,
  table_id uuid REFERENCES guest_tables(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(guest_id)
);

-- Create import history table
CREATE TABLE IF NOT EXISTS guest_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  total_records integer NOT NULL,
  successful_records integer NOT NULL,
  failed_records integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE guest_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_table_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_imports ENABLE ROW LEVEL SECURITY;

-- Policies for guest_tables
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

-- Policies for guest_relationships
CREATE POLICY "Users can view relationships for their guests"
  ON guest_relationships FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_relationships.guest_id
      AND guests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage relationships for their guests"
  ON guest_relationships FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_relationships.guest_id
      AND guests.user_id = auth.uid()
    )
  );

-- Policies for guest_table_assignments
CREATE POLICY "Users can view their guests' table assignments"
  ON guest_table_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_table_assignments.guest_id
      AND guests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their guests' table assignments"
  ON guest_table_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guests
      WHERE guests.id = guest_table_assignments.guest_id
      AND guests.user_id = auth.uid()
    )
  );

-- Policies for guest_imports
CREATE POLICY "Users can view their own imports"
  ON guest_imports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own imports"
  ON guest_imports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_meal_preference ON guests(meal_preference);
CREATE INDEX IF NOT EXISTS idx_guests_guest_type ON guests(guest_type);
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_table_number ON guests(table_number);
CREATE INDEX IF NOT EXISTS idx_guest_tables_user_id ON guest_tables(user_id);
CREATE INDEX IF NOT EXISTS idx_guest_relationships_guest_id ON guest_relationships(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_table_assignments_guest_id ON guest_table_assignments(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_table_assignments_table_id ON guest_table_assignments(table_id);
CREATE INDEX IF NOT EXISTS idx_guest_imports_user_id ON guest_imports(user_id);