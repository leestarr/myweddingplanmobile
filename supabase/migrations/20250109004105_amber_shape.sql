-- First, drop the existing index if it exists
DROP INDEX IF EXISTS unique_user_total_budget;

-- Create a temporary table to store the latest budget IDs
CREATE TEMP TABLE latest_budgets AS
SELECT DISTINCT ON (user_id) id
FROM budgets
WHERE category = 'total'
ORDER BY user_id, created_at DESC;

-- Delete all duplicate total budgets, keeping only the latest one
DELETE FROM budgets
WHERE category = 'total'
AND id NOT IN (SELECT id FROM latest_budgets);

-- Drop the temporary table
DROP TABLE latest_budgets;

-- Create a unique index for user_id when category is 'total'
CREATE UNIQUE INDEX unique_user_total_budget 
ON budgets (user_id)
WHERE category = 'total';