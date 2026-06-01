# FINKI DB Prep

Practice platform for the **Databases 1 practical exam** at FINKI (Faculty of Computer Science and Engineering, Skopje, North Macedonia).

Students log in, pick SQL tasks sorted by difficulty, solve them in an in-browser editor, and get instant feedback. The platform covers every topic on the practical exam: DML queries, DDL schema design, triggers, ER diagram drawing, and writing the relational schema.

## How it works

- **Tasks** are authored by instructors and stored in Supabase.
- **Grading** runs entirely in the browser using [PGlite](https://github.com/electric-sql/pglite) — Postgres compiled to WebAssembly. No student SQL ever leaves the browser. Correctness is checked by *executing* the SQL and comparing results, never by text comparison.
- **Hints** are tiered (conceptual → structural → skeleton); each one used reduces the maximum score for that attempt, so there's an incentive to think before looking.
- **Walkthroughs** teach the logical procedure step by step, revealed after the attempt.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14, App Router, TypeScript |
| Styling | CSS Modules |
| Database / Auth | Supabase (Postgres + Auth + RLS) |
| Grading sandbox | PGlite (WASM Postgres, runs in browser) |
| SQL editor | CodeMirror 6 |
| Hosting | Vercel |

## Running locally

**Prerequisites:** Node.js 18+, a Supabase project.

```bash
git clone https://github.com/YOUR_USERNAME/finki-db-prep.git
cd finki-db-prep
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Add the two Supabase env vars in Vercel's project settings.
4. Deploy. Vercel auto-detects Next.js and handles everything else.

## Project structure

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full data model, grading engine design, and directory layout.

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the build order and phase descriptions.

## Development workflow

See [`CLAUDE.md`](CLAUDE.md) for the git workflow, coding conventions, and how to resume a session.
