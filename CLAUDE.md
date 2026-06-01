# CLAUDE.md — FINKI DB Prep

## Project overview

This is a web platform that helps FINKI (Faculty of Computer Science and Engineering, Skopje) students practice for the practical part of the Databases 1 exam. The exam covers DDL, DML, triggers, ER diagram drawing, and writing the relational schema. Students log in, pick tasks by difficulty, solve them in an in-browser SQL editor, and receive instant auto-graded feedback. Tiered hints and step-by-step walkthroughs teach the reasoning process without giving away the answer. All grading runs client-side via PGlite (Postgres compiled to WASM) — no server cost, fully sandboxed.

## Tech stack (fixed — do not change without asking)

- **Next.js 14, App Router, TypeScript**
- **CSS Modules** for styling (not Tailwind, not styled-components)
- **Supabase**: Postgres + Auth + Row Level Security (app data: users, tasks, submissions)
- **PGlite** (WASM Postgres) in the browser — grading sandbox
- **CodeMirror 6** — SQL editor
- **Vercel** — hosting
- SQL dialect: **PostgreSQL**

## Git workflow (strict)

- `main` is always stable and builds. Never commit WIP to `main`.
- One feature = one branch: `feat/scaffold`, `feat/auth`, `feat/dashboard`, etc.
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `style:`. Imperative mood, under 72 chars.
- Commit in small logical units within a branch. Merge to `main` only when the feature is complete and tested.
- Never commit secrets. `.env.local` is gitignored. Keep `.env.example` with placeholder keys.
- Push to GitHub after every merge so nothing is lost.

## Build loop (per unit)

1. Implement the smallest meaningful slice.
2. Verify: `npm run build` passes, lint passes, behaviour works.
3. If it works → commit. If not → diagnose, fix, re-test. Never move on with a broken unit.
4. Update `docs/PROGRESS.md` and commit the update.
5. Move to the next unit.

## Coding conventions

- TypeScript everywhere — no `any` unless truly unavoidable.
- CSS Modules for all component styles (`Component.module.css`).
- Clear, self-explanatory names. Comments only where the *why* is non-obvious.
- No over-engineering: no premature abstractions, no unused generics, no defensive code for impossible states.
- No half-finished implementations committed to `main`.

## How to resume a session

1. Read this file (`CLAUDE.md`).
2. Read `docs/PROGRESS.md` — note the Active branch and NEXT STEP.
3. Run `git branch` to confirm you're on the right branch (or create/checkout it).
4. Continue from the NEXT STEP listed in PROGRESS.md.
