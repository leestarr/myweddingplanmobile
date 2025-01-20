/*
  # Fix Documents Storage and Policies

  1. Update Documents Table
  - Add missing columns
  - Fix constraints
  
  2. Update Storage Policies
  - Fix bucket policies
  - Add proper user isolation
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their documents" ON storage.objects;

-- Recreate storage policies with proper user isolation
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update documents table
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS mime_type text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS shared boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_accessed timestamptz,
  ADD COLUMN IF NOT EXISTS version integer DEFAULT 1;

-- Add proper indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id_name ON documents(user_id, name);
CREATE INDEX IF NOT EXISTS idx_documents_storage_path_user ON documents(storage_path, user_id);
CREATE INDEX IF NOT EXISTS idx_documents_parent_user ON documents(parent_id, user_id);