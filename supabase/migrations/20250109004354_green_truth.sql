-- Simplify tasks table structure
ALTER TABLE tasks
  DROP COLUMN IF EXISTS completed_at,
  ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- Add check constraint for status
ALTER TABLE tasks
  DROP CONSTRAINT IF EXISTS tasks_status_check,
  ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('pending', 'completed'));

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_tasks_user_order 
ON tasks(user_id, order_index);

-- Add function to maintain order
CREATE OR REPLACE FUNCTION maintain_task_order()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Set order_index to max + 1 for new tasks
    SELECT COALESCE(MAX(order_index) + 1, 0)
    INTO NEW.order_index
    FROM tasks
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order maintenance
DROP TRIGGER IF EXISTS task_order_trigger ON tasks;
CREATE TRIGGER task_order_trigger
  BEFORE INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION maintain_task_order();