# Architecture

## Overview

The app is a Next.js 14 (App Router) project hosted on Vercel. Persistent data (users, tasks, submissions) lives in Supabase (managed Postgres + Auth). All SQL grading runs client-side inside a PGlite (WASM Postgres) instance — no grading traffic hits the server.

```
Browser
  ├── Next.js React app (Vercel)
  │     ├── CodeMirror 6 editor
  │     └── PGlite WASM instance (per grading session)
  └── Supabase JS client
        ├── Auth (session management)
        └── Postgres (tasks, submissions) via PostgREST + RLS
```

---

## Data model

### `tasks`

Stores every practice task. Schema is stable — a separate task-generator repo inserts rows here.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, `gen_random_uuid()` default |
| `category` | `text` (enum check) | `'ddl' \| 'dml' \| 'trigger' \| 'er' \| 'relations'` |
| `difficulty` | `smallint` | 1 (easiest) – 5 (hardest) |
| `title` | `text` | Short display name |
| `prompt` | `text` | Full task statement (Macedonian) |
| `setup_sql` | `text` | DDL that creates the schema the task runs against |
| `seed_sql` | `text` | INSERT statements to populate sample data |
| `reference_solution` | `text` | The correct SQL answer (or JSON for ER tasks) |
| `test_cases` | `jsonb` | Scenarios for trigger/DDL grading (see below) |
| `hints` | `jsonb` | Ordered array: `[{ level, text, score_penalty }]` |
| `walkthrough` | `jsonb` | Ordered steps: `[{ step, explanation }]` |
| `tags` | `text[]` | Free-form tags, e.g. `["JOIN", "GROUP BY"]` |
| `points` | `integer` | Max score for this task (before penalties) |
| `source` | `text` | `'manual'` or `'generated'` |
| `verified` | `boolean` | `false` for generated tasks until human-reviewed |
| `created_at` | `timestamptz` | `now()` default |

#### `test_cases` shape (jsonb)

**DDL tasks** — an array of aspect objects:
```json
[
  { "aspect": "table_exists", "table": "orders" },
  { "aspect": "column_type", "table": "orders", "column": "total", "expected_type": "numeric" },
  { "aspect": "primary_key", "table": "orders", "column": "id" },
  { "aspect": "foreign_key", "table": "orders", "column": "customer_id", "references_table": "customers" },
  { "aspect": "not_null", "table": "orders", "column": "total" }
]
```

**Trigger tasks** — an array of scenario objects:
```json
[
  {
    "description": "inserting a row triggers the audit log",
    "sql": "INSERT INTO products VALUES (1, 'Laptop', 999);",
    "expected_state": { "table": "audit_log", "row_count": 1 },
    "should_raise": false
  },
  {
    "description": "deleting a row with active orders raises an exception",
    "sql": "DELETE FROM products WHERE id = 1;",
    "should_raise": true
  }
]
```

---

### `submissions`

One row per student attempt.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK → `auth.users(id)` |
| `task_id` | `uuid` | FK → `tasks(id)` |
| `answer` | `text` | The student's submitted SQL (or JSON for ER) |
| `is_correct` | `boolean` | True if all grading checks passed |
| `score` | `numeric` | Points awarded (after hint penalties) |
| `hints_used` | `integer` | Number of hints the student revealed |
| `time_taken_seconds` | `integer` | Time from task open to submission |
| `created_at` | `timestamptz` | `now()` default |

---

## Row Level Security (RLS) policies

All tables have RLS enabled. Policies:

**`tasks`**
- `SELECT`: any authenticated user (`auth.role() = 'authenticated'`)
- No INSERT/UPDATE/DELETE for regular users (admin or service-role key only)

**`submissions`**
- `SELECT`: `auth.uid() = user_id`
- `INSERT`: `auth.uid() = user_id`
- `UPDATE`: `auth.uid() = user_id`
- No DELETE

---

## Grading engine

### Principle

All grading is **execution-based**: the student's SQL is run and its *outcome* is compared to the expected outcome. Text comparison is never used.

### DML grading (Phase 6)

1. Boot a fresh PGlite instance in the browser.
2. Execute `setup_sql` (create schema).
3. Execute `seed_sql` (insert sample data).
4. Execute the student's query → capture result set A.
5. Execute `reference_solution` → capture result set B.
6. Compare A and B: sort both by all columns, compare row by row.
   - If the reference query includes `ORDER BY`, comparison is order-sensitive.
   - Column names and types must match.
7. Score: full points if A ≅ B, otherwise 0 (DML is all-or-nothing).

### DDL grading (Phase 7)

1. Boot PGlite, execute the student's DDL.
2. Query `information_schema.tables`, `.columns`, `.table_constraints`, `.key_column_usage`, `.referential_constraints` to introspect the resulting schema.
3. Evaluate each aspect in `test_cases` — each aspect is worth `points / len(test_cases)` (partial credit).
4. Return a per-aspect breakdown plus total score.

### Trigger grading (Phase 8)

1. Boot PGlite, execute `setup_sql` + student's trigger DDL.
2. For each scenario in `test_cases`:
   - Execute the scenario's `sql`.
   - If `should_raise: true`, check that an exception was thrown.
   - If `should_raise: false`, query the `expected_state` and compare row counts / values.
3. Score: `points * (passed_scenarios / total_scenarios)`.

### Trade-off note

The reference solution and test cases are delivered to the browser with the task data, so a determined student can inspect them via DevTools. This is acceptable for a learning tool. For leaderboard integrity, a server-side re-grade of ranked submissions is planned as future work (Phase 10 note).

---

## Directory structure (planned)

```
src/
  app/
    (auth)/          # login, signup pages
    (protected)/     # dashboard, task pages — require auth
      dashboard/
      task/[id]/
    layout.tsx
    page.tsx          # landing page (public)
  components/         # shared UI components
  lib/
    supabase/         # client + server Supabase helpers
    grading/          # PGlite grading engine (dml.ts, ddl.ts, triggers.ts)
  types/              # shared TypeScript types (Task, Submission, etc.)
docs/
  ARCHITECTURE.md
  PROGRESS.md
  ROADMAP.md
```
