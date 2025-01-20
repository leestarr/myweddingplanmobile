/*
  # Fix Document Upload Functionality

  1. Update Storage Policies
  - Simplify storage access rules
  - Fix user isolation
  
  2. Update Documents Table
  - Add missing columns
  - Fix constraints
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their documents" ON storage.objects;

-- Create simpler storage policies
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

CREATE POLICY "Users can update their documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

CREATE POLICY "Users can delete their documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

-- Update documents table
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS file_type text,
  ADD COLUMN IF NOT EXISTS file_size bigint,
  ADD COLUMN IF NOT EXISTS preview_url text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Create function to handle document uploads
CREATE OR REPLACE FUNCTION handle_document_upload()
RETURNS trigger AS $$
BEGIN
  -- Update last_accessed timestamp
  NEW.last_accessed = NOW();
  
  -- Increment version for updates
  IF TG_OP = 'UPDATE' THEN
    NEW.version = OLD.version + 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for document uploads
DROP TRIGGER IF EXISTS on_document_upload ON documents;
CREATE TRIGGER on_document_upload
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION handle_document_upload();