-- ============================================================
-- 008_notifications.sql
-- Adds notifications_read_at to profiles for unread tracking.
-- ============================================================
alter table public.profiles
  add column if not exists notifications_read_at timestamptz default now();
