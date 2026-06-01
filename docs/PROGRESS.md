# Progress Log

## Current state

- **Active branch:** `main` (Phase 0 complete and merged)
- **Last completed:** Phase 0 — scaffold, meta files, hello-world page
- **NEXT STEP:** Phase 1 — create `feat/supabase` branch, set up Supabase tables + RLS + client
- **How to verify current state:**
  - `npm run build` should pass with no errors
  - `npm run dev` → open http://localhost:3000 → see "FINKI DB Prep — coming soon"
  - `git log --oneline` → should show Phase 0 commits merged to main

## Done

- [x] Phase 0: scaffold Next.js 14 + TypeScript app, clean `.gitignore`, `.env.example`
- [x] Phase 0: created `CLAUDE.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md`, `docs/ARCHITECTURE.md`, `README.md`
- [x] Phase 0: replaced default Next.js page with a clean hello-world
- [x] Phase 0: committed on `feat/scaffold`, merged to `main`

## Blockers / notes (manual steps required)

1. **GitHub remote** — create a new repo at github.com and run:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/finki-db-prep.git
   git push -u origin main
   ```

2. **Supabase project** — needed before Phase 1:
   - Go to https://supabase.com → New project → note the Project URL and anon key
   - Copy `.env.example` to `.env.local` and fill in:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Vercel deploy** — connect the GitHub repo at https://vercel.com/new; it will auto-detect Next.js. Add the Supabase env vars in the Vercel project settings before Phase 1.
