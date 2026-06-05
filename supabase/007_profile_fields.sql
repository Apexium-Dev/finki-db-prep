-- ============================================================
-- 007_profile_fields.sql
-- Adds full_name, username, avatar_url to profiles.
-- Creates the avatars storage bucket with per-user RLS.
-- ============================================================

alter table public.profiles
  add column if not exists full_name   text,
  add column if not exists username    text,
  add column if not exists avatar_url  text;

-- Username must be unique when set
create unique index if not exists profiles_username_key
  on public.profiles (username)
  where username is not null;

-- ── Storage bucket ───────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Users can upload/update/delete only their own avatar
create policy "Users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Anyone authenticated can read avatars (public bucket handles anonymous reads too)
create policy "Avatars are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');
