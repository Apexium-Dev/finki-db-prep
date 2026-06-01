-- ============================================================
-- 001_initial_schema.sql
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Task category enum
create type task_category as enum ('ddl', 'dml', 'trigger', 'er', 'relations');

-- ----------------------------------------------------------------
-- tasks
-- ----------------------------------------------------------------
create table public.tasks (
  id                 uuid primary key default gen_random_uuid(),
  category           task_category not null,
  difficulty         smallint not null check (difficulty between 1 and 5),
  title              text not null,
  prompt             text not null,
  setup_sql          text not null default '',
  seed_sql           text not null default '',
  reference_solution text not null default '',
  test_cases         jsonb,
  hints              jsonb,
  walkthrough        jsonb,
  tags               text[] not null default '{}',
  points             integer not null default 100,
  source             text not null default 'manual' check (source in ('manual', 'generated')),
  verified           boolean not null default true,
  created_at         timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- submissions
-- ----------------------------------------------------------------
create table public.submissions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  task_id              uuid not null references public.tasks(id) on delete cascade,
  answer               text not null,
  is_correct           boolean not null default false,
  score                numeric not null default 0,
  hints_used           integer not null default 0,
  time_taken_seconds   integer,
  created_at           timestamptz not null default now()
);

create index submissions_user_id_idx on public.submissions(user_id);
create index submissions_task_id_idx on public.submissions(task_id);

-- ----------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------
alter table public.tasks enable row level security;
alter table public.submissions enable row level security;

-- tasks: any authenticated user can read; only service role can write
create policy "Authenticated users can read tasks"
  on public.tasks for select
  to authenticated
  using (true);

-- submissions: users can only see and write their own rows
create policy "Users can read own submissions"
  on public.submissions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own submissions"
  on public.submissions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
