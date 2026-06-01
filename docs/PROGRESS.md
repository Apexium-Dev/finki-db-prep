# Progress Log

## Current state

- **Active branch:** `main` (Phase 12 — Polish complete and merged)
- **Last completed:** Phase 12 — back nav, loading skeletons, not-found/error pages
- **NEXT STEP:** Phase 11 — ER diagram editor (React Flow) + relational schema sub-task
- **How to verify:**
  - `npm run build` passes with no errors
  - `npm run dev` → log in → dashboard shows tasks + leaderboard
  - Click a task → split-pane editor with 4 tabs (Задача / Шема / Совети / Резултат)
  - "← Задачи" link in task panel returns to dashboard
  - Go to `/task/bad-uuid` → custom not-found page

## Done

- [x] Phase 0: scaffold Next.js 14 + TypeScript, meta files (CLAUDE.md, ROADMAP, ARCHITECTURE, README)
- [x] Phase 1: Supabase client (browser + server), middleware, types, 001_initial_schema.sql
- [x] Phase 2: email/password auth — login, signup, protected routes, sign-out
- [x] Phase 3: landing page — hero, features grid, categories, CTA banner (Macedonian)
- [x] Phase 4: dashboard shell — task grid, category + difficulty filters (URL params)
- [x] Phase 5: task-solving UI — CodeMirror 6 SQL editor, split-pane layout, 4 tabs
- [x] Phase 6: DML grading engine (PGlite), ResultPanel, 5 DML tasks seeded
- [x] Phase 7: DDL aspect-based grading, DdlResultPanel, 2 DDL tasks seeded
- [x] Phase 8: Trigger state-based grading, TriggerResultPanel, 1 trigger task seeded
- [x] Phase 9: Hints panel (tiered, penalty), WalkthroughPanel, submission saving to Supabase
- [x] Phase 10: Leaderboard — profiles table + trigger, get_leaderboard RPC, leaderboard UI
- [x] fix: task panel reorganised into 4 scrollable tabs (Задача/Шема/Совети/Резултат)
- [x] Phase 12: Polish — back nav, dashboard loading skeleton, not-found pages, error boundary

## Tasks in Supabase (8 total)

| Category | Count | Difficulties |
|----------|-------|--------------|
| DML      | 5     | 1, 1, 2, 2, 3 |
| DDL      | 2     | 2, 3 |
| Trigger  | 1     | 3 |

## Blockers / notes

- **Vercel env vars**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be set in Vercel project settings
- **DATABASE_URL** is in `.env.local` for running psql migrations locally
- **Phase 11 (ER diagrams)** is a large phase — plan to break into sub-phases:
  1. React Flow setup + custom node types (Entity, Attribute, Relationship)
  2. JSON export format + grading engine (structural comparison)
  3. Relations sub-task (text input, graded like DDL)
  4. 1-2 ER tasks seeded
- Future work: server-side re-grade for leaderboard integrity (noted in ARCHITECTURE.md)
