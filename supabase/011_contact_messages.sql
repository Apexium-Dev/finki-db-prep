CREATE TABLE public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL DEFAULT '',
  message    text NOT NULL,
  read       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert"
  ON public.contact_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can read messages"
  ON public.contact_messages FOR SELECT
  USING (auth.uid() = '81a572ca-2617-4f74-be71-96f61476593f');

CREATE POLICY "Admin can update messages"
  ON public.contact_messages FOR UPDATE
  USING (auth.uid() = '81a572ca-2617-4f74-be71-96f61476593f');
