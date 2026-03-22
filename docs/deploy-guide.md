# Deploy Guide

Step-by-step guide to deploy DriveMaster to production.

## Prerequisites

You'll need accounts on:
1. **Supabase** (free tier) — [supabase.com](https://supabase.com)
2. **Vercel** (free tier) — [vercel.com](https://vercel.com)
3. **Resend** (free tier, optional) — [resend.com](https://resend.com) — only for parent email digests

## Step 1: Supabase Setup

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Choose a region close to your users (e.g., `us-east-1` for Illinois)
3. Save your project URL and anon key from Settings > API

### Database Migrations

Run these SQL statements in the Supabase SQL Editor (Dashboard > SQL Editor):

The existing migration file is at `supabase/migrations/001_create_questions_tables.sql`. Run it first.

Then run these additional migrations for Phase 2-3 features:

```sql
-- AI Explanation Cache
CREATE TABLE IF NOT EXISTS ai_explanations (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  wrong_answer_index INT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, wrong_answer_index)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  seed TEXT NOT NULL,
  question_ids INT[] NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_results (
  id SERIAL PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  score INT NOT NULL,
  correct_count INT NOT NULL,
  total_questions INT NOT NULL,
  time_taken_seconds INT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Parent Links
CREATE TABLE IF NOT EXISTS parent_links (
  id SERIAL PRIMARY KEY,
  teen_user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  parent_user_id UUID REFERENCES auth.users(id),
  invite_code TEXT NOT NULL,
  invite_expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  linked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE ai_explanations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI explanations are readable by everyone" ON ai_explanations FOR SELECT USING (true);
CREATE POLICY "AI explanations insertable by authenticated" ON ai_explanations FOR INSERT WITH CHECK (true);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges readable by everyone" ON challenges FOR SELECT USING (true);
CREATE POLICY "Challenges created by authenticated" ON challenges FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Challenges updatable by system" ON challenges FOR UPDATE USING (true);

ALTER TABLE challenge_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Results readable by everyone" ON challenge_results FOR SELECT USING (true);
CREATE POLICY "Results created by authenticated" ON challenge_results FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE parent_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parent links readable by linked users" ON parent_links FOR SELECT USING (auth.uid() = teen_user_id OR auth.uid() = parent_user_id);
CREATE POLICY "Parent links created by teens" ON parent_links FOR INSERT WITH CHECK (auth.uid() = teen_user_id);
CREATE POLICY "Parent links updated by parents" ON parent_links FOR UPDATE USING (auth.uid() = parent_user_id OR auth.uid() = teen_user_id);
```

### Seed Questions

Run the question seeding script or manually insert from `lib/data/questions/illinois-dmv-questions.ts`.

## Step 2: Vercel Deployment

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `drivemaster-app` GitHub repo
3. Set environment variables (Settings > Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

CRON_SECRET=generate-a-random-string
ADMIN_API_KEY=generate-another-random-string

# Enable features one at a time:
NEXT_PUBLIC_FEATURE_COUNTDOWN=true
NEXT_PUBLIC_FEATURE_SHARING=true
NEXT_PUBLIC_FEATURE_AI_EXPLANATIONS=false  # Enable after setting SYNTHETIC_API_KEY
NEXT_PUBLIC_FEATURE_CHALLENGES=true
NEXT_PUBLIC_FEATURE_PARENT_NOTIFICATIONS=false  # Enable after setting RESEND_API_KEY
NEXT_PUBLIC_FEATURE_I18N=true

# Optional — enable when ready:
# SYNTHETIC_API_KEY=your-synthetic-new-api-key
# RESEND_API_KEY=your-resend-api-key
# SENTRY_DSN=your-sentry-dsn
```

4. Deploy! Vercel auto-deploys on every push to your branch.

## Step 3: Vercel Cron (for weekly digest)

Add to `vercel.json` in the repo root:

```json
{
  "crons": [
    {
      "path": "/api/cron/digest",
      "schedule": "0 14 * * 0"
    }
  ]
}
```

This runs the parent digest every Sunday at 2pm UTC (9am CT).

The cron endpoint is protected by `CRON_SECRET` — Vercel automatically sends the `Authorization: Bearer {CRON_SECRET}` header.

## Step 4: Domain (Optional)

1. Buy a domain (e.g., `drivemaster.app` on Namecheap/Cloudflare)
2. Add it in Vercel: Settings > Domains
3. Update DNS records as Vercel instructs
4. Update `NEXT_PUBLIC_APP_URL` env var
5. Update `public/robots.txt` sitemap URL

## Step 5: Verify

After deployment, check:
- [ ] Homepage loads
- [ ] Sign up flow works (Supabase Auth)
- [ ] Quiz loads questions
- [ ] PWA install prompt appears (on mobile)
- [ ] Offline fallback page works
- [ ] Feature flags toggle features on/off correctly

## Troubleshooting

**Build fails with "Required variable not set"**
→ You're missing Supabase env vars. Add them in Vercel Settings > Environment Variables.

**Questions don't load**
→ Run the database migrations and seed the question data.

**Auth doesn't work**
→ Check Supabase Auth settings. Enable Email provider. Add your Vercel URL to the redirect whitelist.

**Share cards show blank**
→ The `/api/og` route uses Vercel Edge Runtime. Make sure your Vercel plan supports Edge Functions (all plans do).
