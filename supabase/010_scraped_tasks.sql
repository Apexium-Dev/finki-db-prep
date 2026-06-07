-- 010_scraped_tasks.sql
-- Allows scraped tasks from dbLearnStar to be inserted alongside manual/generated tasks.
-- Run in Supabase SQL Editor before running the transfer script.

-- 1. Allow 'scraped' as a valid source value
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_source_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_source_check
  CHECK (source IN ('manual', 'generated', 'scraped'));

-- 2. Add external_task_id (links to dbLearnStar task ID)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS
  external_task_id INTEGER;

CREATE INDEX IF NOT EXISTS tasks_external_task_id_idx ON public.tasks(external_task_id);

-- 3. Hide unverified tasks from regular users (verified=false means not yet reviewed)
DROP POLICY IF EXISTS "Authenticated users can read tasks" ON public.tasks;

CREATE POLICY "Authenticated users can read tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (verified = true);
