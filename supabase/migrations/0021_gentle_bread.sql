-- Add color column to task_categories if it doesn't exist
ALTER TABLE task_categories
  ADD COLUMN IF NOT EXISTS color text DEFAULT '#4f46e5';

-- Create unique constraint for user_id and name combination
ALTER TABLE task_categories
  ADD CONSTRAINT task_categories_user_id_name_key UNIQUE (user_id, name);

-- Create default categories function
CREATE OR REPLACE FUNCTION create_default_task_categories(user_uuid uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO task_categories (user_id, name, color)
  VALUES
    (user_uuid, 'Venue', '#ef4444'),
    (user_uuid, 'Attire', '#f59e0b'),
    (user_uuid, 'Catering', '#10b981'),
    (user_uuid, 'Decor', '#8b5cf6'),
    (user_uuid, 'Music', '#ec4899')
  ON CONFLICT (user_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for new users
CREATE OR REPLACE FUNCTION handle_new_user_task_categories()
RETURNS trigger AS $$
BEGIN
  PERFORM create_default_task_categories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created_task_categories ON auth.users;
CREATE TRIGGER on_auth_user_created_task_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_task_categories();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_task_categories_name_user ON task_categories(name, user_id);

-- Create default categories for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM create_default_task_categories(user_record.id);
  END LOOP;
END $$;