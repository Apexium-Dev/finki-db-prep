# Progress Log

## Current state

- **Active branch:** `main` (Phase 1 complete and merged)
- **Last completed:** Phase 1 — Supabase client, types, middleware, schema + RLS applied
- **NEXT STEP:** Phase 2 — create `feat/auth` branch, build email/password signup + login + protected routes
- **How to verify current state:**
  - `npm run build` passes with no errors
  - Supabase dashboard → Table Editor → `tasks` and `submissions` tables exist with RLS enabled
  - `psql $DATABASE_URL -c "\dt public.*"` → shows both tables

## Done

- [x] Phase 0: scaffold Next.js 14 + TypeScript app, clean `.gitignore`, `.env.example`
- [x] Phase 0: created `CLAUDE.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md`, `docs/ARCHITECTURE.md`, `README.md`
- [x] Phase 0: replaced default Next.js page with a clean hello-world
- [x] Phase 0: committed on `feat/scaffold`, merged to `main`
- [x] Phase 1: installed `@supabase/supabase-js` + `@supabase/ssr`
- [x] Phase 1: `src/lib/supabase/client.ts` — browser client
- [x] Phase 1: `src/lib/supabase/server.ts` — server client with cookie handling
- [x] Phase 1: `src/middleware.ts` — session refresh on every request
- [x] Phase 1: `src/types/database.ts` — typed Task, Submission, Database interfaces
- [x] Phase 1: `supabase/001_initial_schema.sql` — tasks + submissions tables, RLS policies
- [x] Phase 1: migration applied to Supabase via psql; tables + policies confirmed live
- [x] Phase 1: committed on `feat/supabase`, merged to `main`

## Notes

- DB password and DATABASE_URL are in `.env.local` (gitignored). To run future migrations:
  ```
  psql $DATABASE_URL -f supabase/00X_migration_name.sql
  ```
- Future migrations follow the pattern `supabase/00X_description.sql` and are committed to the repo.
- Vercel env vars: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project settings before deploying Phase 2.
