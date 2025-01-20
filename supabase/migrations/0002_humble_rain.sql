/*
  # Authentication and Storage Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text) - User role (admin, wedding_party, guest)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_settings`
      - `user_id` (uuid, primary key) - References auth.users
      - `email_notifications` (boolean)
      - `theme` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Storage Buckets
    - `avatars` - For user profile pictures
    - `documents` - For wedding-related files
    - `photos` - For wedding photos

  3. Security
    - Enable RLS on all tables
    - Set up storage bucket policies
    - Create user profile policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name text,
  last_name text,
  role text NOT NULL DEFAULT 'guest' CHECK (role IN ('admin', 'wedding_party', 'guest')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('documents', 'documents', false),
  ('photos', 'photos', false);

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Avatar access"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Avatar upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Document access"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (EXISTS (
      SELECT 1 FROM files
      WHERE storage.objects.name = files.path AND
      (files.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM file_shares
          WHERE file_shares.file_id = files.id
          AND file_shares.shared_with = auth.uid()
        )
      )
    ))
  );

CREATE POLICY "Document upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (new.id, '', '', 'guest');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);