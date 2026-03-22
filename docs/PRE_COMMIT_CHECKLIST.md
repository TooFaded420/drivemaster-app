# Pre-Commit Checklist

Use this checklist before every commit to keep DriveMaster production-ready.

## ✅ Code Quality
- [ ] `npm run lint` passes locally
- [ ] TypeScript builds cleanly
- [ ] No unused imports, dead code, or TODOs without Jira follow-up
- [ ] No `any` types introduced without explicit TODO
- [ ] No ES2021+ APIs added unless verified by runtime target

## ✅ Build & Runtime
- [ ] `npm run build` passes
- [ ] `.env.local` contains all required variables (see `scripts/validate-env.ts`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- [ ] No secrets are hard-coded in docs or source files

## ✅ Security & Access
- [ ] RLS policies exist for any new tables
- [ ] API routes enforce authentication and authorization
- [ ] Admin routes do **not** rely solely on a shared secret header

## ✅ Database Hygiene
- [ ] Any schema changes are committed as migrations in `supabase/migrations`
- [ ] Supabase types updated after new tables/columns
- [ ] `types/database.ts` reflects latest migrations

## ✅ UX / PWA
- [ ] Offline experience tested (visit `/offline` without network)
- [ ] Service worker cache updated intentionally
- [ ] No authenticated pages pre-cached

## ✅ Documentation
- [ ] README and architecture docs match actual versions
- [ ] Any new env vars are documented

---

If any item is not satisfied, create a follow-up task before merging.
