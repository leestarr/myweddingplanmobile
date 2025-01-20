/*
  # Documents Management Schema

  1. New Tables
    - `files`
      - `id` (uuid, primary key)
      - `name` (text) - File name
      - `type` (text) - File type (pdf, excel, word, image)
      - `size` (bigint) - File size in bytes
      - `path` (text) - Storage path
      - `shared` (boolean) - Whether file is shared
      - `user_id` (uuid) - Owner of the file
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `file_shares`
      - `id` (uuid, primary key)
      - `file_id` (uuid) - Reference to files table
      - `shared_with` (uuid) - User ID file is shared with
      - `created_at` (timestamptz)

    - `file_activities`
      - `id` (uuid, primary key)
      - `file_id` (uuid) - Reference to files table
      - `user_id` (uuid) - User who performed the action
      - `action` (text) - Type of action (upload, download, share, delete)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for file access and sharing
*/

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  size bigint NOT NULL,
  path text NOT NULL,
  shared boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create file_shares table
CREATE TABLE IF NOT EXISTS file_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid REFERENCES files(id) ON DELETE CASCADE,
  shared_with uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(file_id, shared_with)
);

-- Create file_activities table
CREATE TABLE IF NOT EXISTS file_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid REFERENCES files(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_activities ENABLE ROW LEVEL SECURITY;

-- Files policies
CREATE POLICY "Users can view their own files"
  ON files
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM file_shares
      WHERE file_shares.file_id = files.id
      AND file_shares.shared_with = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own files"
  ON files
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files"
  ON files
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
  ON files
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- File shares policies
CREATE POLICY "Users can view shares for their files"
  ON file_shares
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM files
      WHERE files.id = file_shares.file_id
      AND files.user_id = auth.uid()
    ) OR
    file_shares.shared_with = auth.uid()
  );

CREATE POLICY "Users can share their own files"
  ON file_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM files
      WHERE files.id = file_shares.file_id
      AND files.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove shares for their files"
  ON file_shares
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM files
      WHERE files.id = file_shares.file_id
      AND files.user_id = auth.uid()
    )
  );

-- File activities policies
CREATE POLICY "Users can view activities for their files"
  ON file_activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM files
      WHERE files.id = file_activities.file_id
      AND (
        files.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM file_shares
          WHERE file_shares.file_id = files.id
          AND file_shares.shared_with = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can insert activities for accessible files"
  ON file_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM files
      WHERE files.id = file_activities.file_id
      AND (
        files.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM file_shares
          WHERE file_shares.file_id = files.id
          AND file_shares.shared_with = auth.uid()
        )
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_shared_with ON file_shares(shared_with);
CREATE INDEX IF NOT EXISTS idx_file_activities_file_id ON file_activities(file_id);
CREATE INDEX IF NOT EXISTS idx_file_activities_user_id ON file_activities(user_id);