# Roadmap

Each phase lives on its own branch and is merged to `main` only when complete and tested.

## Phase 0 — Scaffold + meta files ✅
Next.js 14 + TypeScript + App Router skeleton. `CLAUDE.md`, `PROGRESS.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `README.md`. Deployable "hello world" to confirm Vercel works early.

## Phase 1 — Supabase + data model
Create `tasks` and `submissions` tables with the full schema. Enable Row Level Security with correct policies. Wire up the Supabase client (`@supabase/ssr`). Seed nothing real yet — just verify the client connects.

## Phase 2 — Auth
Email/password signup + login + magic-link option. Protected routes (redirect to login if unauthenticated). Session persistence via Supabase SSR helpers and Next.js middleware.

## Phase 3 — Landing page
Public-facing page: what the tool is, how it works, CTA to sign up. Responsive layout, CSS Modules, no placeholder copy.

## Phase 4 — Dashboard shell
Authenticated view: list tasks fetched from Supabase. Filter by category (DDL / DML / Trigger / ER / Relations) and difficulty (1–5). Empty-state friendly. No grading yet.

## Phase 5 — Task-solving UI (SQL)
Open a task: show prompt, provided schema, and a CodeMirror 6 SQL editor. "Check" button placeholder. No grading logic yet — just the UI shell.

## Phase 6 — Grading engine v1 — DML
Boot PGlite in the browser. On "Check": run `setup_sql` + `seed_sql`, execute the student query and the reference solution, compare result sets order-insensitively (or with ORDER BY if the reference uses it). Save the submission to Supabase. Add 3–5 hand-written DML tasks to test end to end.

## Phase 7 — Grading — DDL (aspect-based)
Run the student's DDL. Introspect `information_schema` to check each expected aspect (table exists, column + type, PRIMARY KEY, FOREIGN KEY, constraints). Award partial credit per aspect. Add 2 DDL tasks.

## Phase 8 — Grading — Triggers (state-based)
Apply student's schema + trigger. Run a scripted INSERT/UPDATE/DELETE sequence. Compare resulting table state to expected; include both should-succeed and should-raise-error scenarios. Add 1 trigger task.

## Phase 9 — Hints + walkthrough + scoring
Tiered hints: conceptual → structural → skeleton, each with a `score_penalty`. Step-by-step walkthrough revealed progressively. Persist final score (after penalties) to `submissions`. UI to show score and walkthrough.

## Phase 10 — Leaderboard
Aggregate scores and streaks from `submissions`. Display a ranked leaderboard on the dashboard. Note: optional server-side re-grade for ranked submissions is future work.

## Phase 11 — ER diagram + relations (hardest)
Structured ER editor built with React Flow. Outputs a JSON graph (entities, attributes with PK/multivalued/derived flags, relationships with cardinalities, weak entities, ISA hierarchies). Graded by structural comparison to a reference JSON. "Write the relations" sub-task is text, graded like DDL. Break into a sub-roadmap in this file when the phase is ready to start.

## Phase 12 — Polish
Global error handling, loading states, responsive layout, accessibility pass, empty states everywhere.
