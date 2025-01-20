-- Delete all but the latest total budget for each user
DELETE FROM budgets b1
WHERE category = 'total'
AND created_at < (
  SELECT created_at 
  FROM budgets b2
  WHERE b2.user_id = b1.user_id
  AND b2.category = 'total'
  ORDER BY created_at DESC
  LIMIT 1
);

-- Now that we have only one total budget per user, create the unique index
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_total_budget 
ON budgets (user_id)
WHERE category = 'total';