-- ============================================================
-- 005_leaderboard.sql
-- Adds: profiles table, auto-create trigger, leaderboard RPC
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles readable by authenticated users"
  on public.profiles for select
  to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Auto-create profile on signup ────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Back-fill profiles for users who already exist
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1)
from auth.users
on conflict (id) do nothing;

-- ── Leaderboard RPC ──────────────────────────────────────────
-- Returns one row per user: rank, display_name, tasks_solved, total_score
-- "best score per task" semantics: counts MAX(score) per task per user
create or replace function public.get_leaderboard(limit_n integer default 20)
returns table (
  rank         bigint,
  user_id      uuid,
  display_name text,
  total_score  numeric,
  tasks_solved bigint
)
language sql security definer as $$
  select
    row_number() over (order by coalesce(agg.total_score, 0) desc) as rank,
    p.id                        as user_id,
    p.display_name,
    coalesce(agg.total_score, 0) as total_score,
    coalesce(agg.tasks_solved, 0) as tasks_solved
  from public.profiles p
  left join lateral (
    select
      count(distinct task_id)  as tasks_solved,
      sum(best_score)          as total_score
    from (
      select task_id, max(score) as best_score
      from public.submissions
      where user_id = p.id
      group by task_id
    ) best
  ) agg on true
  order by total_score desc
  limit limit_n;
$$;
