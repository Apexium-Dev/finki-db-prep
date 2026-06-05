-- ============================================================
-- 009_feedback.sql
-- Adds: feedback table for student bug reports and suggestions
-- ============================================================

CREATE TABLE public.feedback (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  type       text NOT NULL CHECK (type IN ('bug', 'suggestion')),
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON public.feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = '81a572ca-2617-4f74-be71-96f61476593f');

CREATE POLICY "Admins can update feedback status"
  ON public.feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() = '81a572ca-2617-4f74-be71-96f61476593f');
