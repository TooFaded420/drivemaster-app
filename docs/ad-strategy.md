# Ad Strategy — DriveMaster (4 Weeks)

**Audience:** Illinois teens 15-17 learning to drive.
**Product:** Free gamified permit-test prep PWA (drivemaster-app.vercel.app).
**Timeline:** April 21 – May 19, 2026.
**Constraint:** Under-18 targeting rules + validation gate = organic focus until week 3 minimum.

---

## 1. Reality Check

Before a single dollar spends, three facts dominate ad planning for DriveMaster.

**COPPA and Platform Rules Are the Primary Constraint**

Meta (Facebook, Instagram) removed interest-based targeting for under-18 users in the US in January 2023. TikTok's under-18 targeting is heavily restricted. This kills the "micro-target 15-17yr olds via interest in driving-ed" plan. It's not coming back.

**Options:**
- **(A) Target parents** with parent-directed creative ("Your teen is procrastinating on the permit test again. DriveMaster makes it fun."). This works legally and targeting-wise — parents get interest-based ads, and parent reach to teen conversion is measurable.
- **(B) Target 18+ college students in Illinois** as a proxy ("Remember when you were taking the permit test? One of your friends is probably right now. DriveMaster makes their grind less painful."). Converts teens via referral, not direct ads.
- **(C) Organic-only until age-gate + parental-consent flow ships** (probably week 4-6 timeline). Once implemented, paid targeting of under-18 becomes compliant and precise. Until then, paid spend to under-18 has legal friction.

**This ad strategy uses (A) + (B) + organic aggressively.** No paid spend to 15-17yr old targeting until compliance infrastructure ships.

**One Real Illinois Teen Must Validate Retention First**

The sprint plan (2026-04-21-sprint-plan.md) gates all feature work on this: "Week 1 stabilize core loop. Week 2 recruit and observe one real teen. Ship one retention feature based on observed behavior, not wishlist." Ads before that validation is premature spend. A teen who bounces in 2 days costs the same CPA as a teen who retains. Until retention is *observed* (not assumed), ad spend teaches you nothing.

**State this rule plainly:** No paid acquisition spend scales until one real Illinois teen has signed up, completed at least 3 quizzes, and shown week-1 retention. This is not a suggestion. April/early May = observation + organic only. Paid spend unlock = mid-May if validation hits.

**No UTM Attribution Until Middleware Ships**

Ad platforms (Meta, TikTok, Google) can measure clicks and pixel fires. They cannot tell you which ads produced signups without a clear attribution chain. Today, the chain is broken. Extract `utm_source/medium/campaign/content/term` from query params, store in a 30-day cookie, pass to PostHog as user properties on signup. This is a ~4-8 hour engineering task and is a hard prerequisite for any paid spend above $500. Without it, CPA is guesswork.

**Engineering prerequisite:** UTM middleware in place before week 3 spend. Until then, count signups only via Supabase auth.users (ground truth) and assume all CPA numbers are ±2x uncertain.

**Ad Pixels Are Installed But Gated by Consent**

Meta Pixel, TikTok Pixel, and GA4 are live in `lib/providers/` and consent-gated. They load only after user opts in to analytics. For minors, consent defaults to OFF (privacy-first). This means:
- Retargeting pools for teens are sparse or empty (few teens grant consent).
- Parent-targeting campaigns can collect conversion pixels from parents normally.
- Rely on Supabase auth.users count as the single source of truth for CPA, not pixel events, until consent rates stabilize.

**Seasonality: April-May Is Mid-Season**

Illinois drivers take the permit test year-round, but demand spikes: summer break (May-August), back-to-school jitters (August-September). April-May is mid-season — not peak, not dead. Google Trends search volume for "illinois permit test" or "Illinois DMV test" will confirm this before spend. Expect 20-40% lower CPM/CPC than summer.

**Custom Domain is a Credibility Issue**

Running ads to `drivemaster-app.vercel.app` erodes trust. Parents will hesitate ("Is this a scam?"). Teens will hesitate. Competitors (Zutobi, driving-tests.org) have `.com` or `.app` custom domains. Acquire `drivemaster.app` or equivalent before week 3 paid spend. Flag this as a founder task with a 1-2 week lead time (domain + DNS).

**Free Product = Learning Spend, Not Growth Spend**

Every dollar in April and May is learning spend. There is no paywall, no conversion event after signup. The payoff is retention and referrals, both measured in weeks, not clicks. Set stakeholder expectations: "We will learn CPA and PMF, not hit DAU targets, by May 19."

---

## 2. Channel Ranked List (Top 5)

Ranked by fit for current constraints (parent-targeting, 18+ proxy, organic scale).

### Channel 1: TikTok Organic + Amplified

**CPM range:** N/A (organic). Amplification (Creator Fund, TikTok ads to 18+ retargeting): $0.30-1.50 CPM. 
**Minimum daily budget:** $10 for creator-amplified tier (test audience ~5k reach).
**Format:** 15-60 sec vertical video. Hook in first 3 sec. Music trends encouraged. Dash mascot + teen testimonial combo performs best in this space.
**Gotcha:** TikTok's organic reach is unpredictable. One video hits 100k views, the next hits 200. Budget conservatively for reach; plan for viral upside as bonus.
**Teen PMF rating:** A. This is where teens live. Organic reach avoids compliance friction. Amplification (if needed) targets 18+ or lookalikes, not under-18 direct targeting.

**Action this channel:** 5 posts in 14 days, 2-3 featuring Dash, 1-2 featuring a real teen success story (once one exists mid-May), 1 behind-the-scenes. Track view counts; if any single post exceeds 1k views, double down on that format in the following week. Creator Fund payout is bonus money; ignore it for ROI math.

---

### Channel 2: Google Search (Parent + Teen Hybrid)

**CPM/CPC range:** $0.80-2.50 CPC (permit-test keywords are education vertical, moderate competition). 
**Minimum daily budget:** $20 (5-10 clicks/day at $2 CPC).
**Format:** Search ads (responsive), landing page optimized for CTR on "free illinois permit test" + "illinois DMV practice test" queries.
**Gotcha:** Search demand is seasonal (peaks summer). April-May volume is 40% of July. Bid strategy matters: Target CPA of $40-60 per signup (test budget) or $30-40 (serious budget). Google's Smart Bidding will optimize toward that ceiling.
**Teen PMF rating:** A-. Teens and parents both search "illinois permit test" the week before the appointment. High intent. Low CPM/CPC relative to other channels.

**Action this channel:** Launch 3-5 ad group clusters: parent-targeting ("Your teen is procrastinating again"), teen-targeting ("Free, no ads, just you and Dash"), and broad ("Illinois permit test"). A/B test landing pages (see section 4). Start with $200 budget spread across 2 weeks; scale if CPA < $50.

---

### Channel 3: Meta (Facebook/Instagram) Parent Targeting

**CPM range:** $1.50-4.00 CPM (targeting parents 35-50 in IL, interest: family, education, parenting).
**Minimum daily budget:** $15 (200-400 impressions/day).
**Format:** Carousel ads (3-5 assets), static image ads, or video (15-30 sec). Parent-centric copy ("Is your teen procrastinating on the permit test?"). Dash in supporting role (credibility, not lead). Before/after tone: stressed parent → confident teen.
**Gotcha:** Meta's audience overlap with Google is high. Meta's cost-per-click is 2-3x Google's. Expect CPC of $3-6. Meta excels at retargeting (traffic from landing pages), not cold acquisition. Pair Meta spend with Google spend; use Meta to retarget Google clickers who didn't convert.
**Teen PMF rating:** B. Parents convert better than teens on Meta, but parents are a proxy, not the user. Conversion to active teen usage may have friction.

**Action this channel:** Launch a $300 test campaign, week 2. Target: parents 35-55 in Illinois, interests in family/education. Use two ad sets: (1) cold audience, (2) warm audience (website visitors from organic sources). Run for 10 days; kill if CPA > $75 or CTR < 1%.

---

### Channel 4: Reddit (r/Illinois, r/teenagers, r/driving)

**CPM/CPC range:** N/A (organic). Paid Reddit ads (if later): $0.50-2.00 CPC. 
**Minimum daily budget:** $0 (organic seed). $10-20 if buying ads later.
**Format:** Organic post (honest, casual). Paid ads (same format). Community engagement required (comment on existing posts, answer questions).
**Gotcha:** Reddit audiences are suspicious of ads. Organic posts that sound like ads get downvoted. Post as a human ("Hey I'm building a free permit-test app for Illinois teens, would love feedback"), not as a brand. Paid Reddit ads have low CTR (~0.3%) unless the creative is native/meme-quality.
**Teen PMF rating:** A-. r/teenagers and r/Illinois are populated by the exact target audience. High authenticity, low spam perception. Retention risk: Reddit users expect functionality to match effort. Deliver a polished core loop or credibility dies fast.

**Action this channel:** Seed 2-3 organic posts in r/Illinois, r/teenagers, and r/driving (if relevant) in week 1-2. Answer questions honestly. Mention the $20 Venmo for testing (if doing validation recruitment). Track upvotes/comments as signal of interest. Do not launch paid Reddit ads until week 3 minimum (need data to justify budget).

---

### Channel 5: Direct Email (Parent Seeding)

**CPM/CPC range:** N/A (owned channel). Owned audience = $0 CAC if used well.
**Minimum daily budget:** $0. Effort-based: 15 min / day to find and email 5-10 prospects.
**Format:** Short email (~100 words). Copy: "I'm building a free permit-test app for Illinois teens. Your teen might be procrastinating. Want to try it? [drivemaster.app link]"
**Gotcha:** Email list is cold (no list yet). Expect 5-15% open rate, 0.5-2% click rate, 10-20% signup rate from clickers. Subject line determines everything.
**Teen PMF rating:** B. Email is indirect. Effectiveness depends on relationship warmth and subject-line credibility.

**Action this channel:** Build a manual list of 20-30 email addresses: parents in your network, local Illinois driver's ed instructors, school administrators. Send a warm, short email (not templated) in week 1 and week 2. Measure open + click rates; track conversions. If subject line "Your teen is procrastinating on the permit test again" gets >15% open rate, invest in a Mailchimp template and scale to 100+ emails.

---

## 3. Creative Concepts (15 Total, 5 Per Top-3 Channel)

All copy in Dash hype-beast tone: casual, one emoji max, max 3 sentences, never condescending.

### TikTok Organic (5 Concepts)

**Concept 1: "Dash Walks You Through It"**
- Hook (0-3 sec): Dash on screen, spinning, hype. "Yo, permit test stressing you?"
- Payoff: Cut to a teen breezing through 5 quiz questions in 20 seconds, Dash celebrating each one.
- CTA: "Try DriveMaster — free, no BS, just you and Dash."
- Production: Voiceover + screen record + Dash animation (easy, 30 min).
- Emoji: 🔥

**Concept 2: "Real Teen, Real Results"**
- Hook: A teen on their phone, stressed, scrolling. "Me the day before my permit test..."
- Payoff: Same teen, now using DriveMaster, smiling, finishing a quiz. "Me after DriveMaster."
- CTA: "Free app, takes 10 min a day. Download now."
- Production: User-generated video or actor, no special effects (15 min).
- Emoji: 🎮

**Concept 3: "Your Procrastination is About to Get Worse (JK)"**
- Hook: Comedic pause, teen looking at calendar. "Your permit test is in 2 weeks..."
- Payoff: "And you haven't studied. But DriveMaster makes it actually fun. No cap."
- CTA: "Download, study, pass."
- Production: Text overlay + music trend (10 min).
- Emoji: ⏰

**Concept 4: "Dash's Hype Speeches Are Unmatched"**
- Hook: Dash on screen, hyping up a missed quiz question. "Nah fam, close but—"
- Payoff: Dash explains the rule in 1 sentence. Teen gets the next one. Both celebrate.
- CTA: "Get a mascot that actually cares. Free."
- Production: Screen record + Dash voice (30 min).
- Emoji: 💪

**Concept 5: "From 'Ugh' to 'Yo, I Passed'"**
- Hook: Montage of a teen's reaction over 3 days: Day 1 (ugh), Day 2 (okay), Day 3 (YOOO).
- Payoff: Share card of their score.
- CTA: "Your turn. DriveMaster."
- Production: UGC with clips, music trend (30 min).
- Emoji: ✨

---

### Google Search (5 Concepts)

**Concept 1: "Illinois Permit Test Practice — Free, No Ads, Just Questions"**
- Headline 1: "Illinois Permit Test Practice"
- Headline 2: "Free, Gamified, 3000+ Questions"
- Headline 3: "Study Today, Pass Tomorrow"
- Description: "DriveMaster: Free permit-test prep for Illinois teens. Gamified learning, Dash mascot coaching, zero paywalls. Start now."
- Landing page: `/illinois-permit-test` (parent-friendly, reassuring, honest).
- Production: Text only (5 min).
- Emoji: None (search ads don't use emoji).

**Concept 2: "Free DMV Practice Test Illinois"**
- Headline 1: "Free Illinois DMV Practice Test"
- Headline 2: "3000+ Official Questions"
- Headline 3: "Gamified Learning, Real Results"
- Description: "Practice the exact Illinois DMV test. Free app, no accounts, no data selling. Study wherever, whenever."
- Landing page: `/free-illinois-dmv-practice-test` (SEO-optimized landing).
- Production: Text only (5 min).
- Emoji: None.

**Concept 3: "Illinois Teen Permit Test — Study with Dash"**
- Headline 1: "Illinois Teen Permit Test"
- Headline 2: "Procrastination-Proof App"
- Headline 3: "Dash Mascot Coaching Included"
- Description: "DriveMaster makes permit-test prep fun. AI explanations, gamified streaks, share your score. Free for Illinois teens."
- Landing page: `/illinois-teen-permit-15-years-old` (age/location explicit, reassuring to parents).
- Production: Text only (5 min).
- Emoji: None.

**Concept 4: "Parent: Your Teen's Permit Test Is Soon"**
- Headline 1: "Your Teen's Permit Test Is Coming"
- Headline 2: "Free Study App, No Fluff"
- Headline 3: "Gamified Prep They'll Actually Use"
- Description: "DriveMaster: Free permit-test prep for Illinois teens. Gamified, AI-coached, mascot-led. Parents: Give them a real shot at passing."
- Landing page: `/illinois-permit-test` (parent-centric framing).
- Production: Text only (5 min).
- Emoji: None.

**Concept 5: "Illinois Permit Test — Start Free"**
- Headline 1: "Illinois Permit Test"
- Headline 2: "Free Prep, No Paywall"
- Headline 3: "3000+ Practice Questions"
- Description: "Study for the Illinois permit test free. Gamified, fun, built for teens. No upsells, no data selling."
- Landing page: Homepage `/` (simple, entry-level).
- Production: Text only (5 min).
- Emoji: None.

---

### Meta (Facebook/Instagram) (5 Concepts)

**Concept 1: "Is Your Teen Procrastinating on the Permit Test Again?"**
- Visual: Split image — stressed teen at desk on left, same teen on phone smiling on right (Dash visible).
- Copy: "DriveMaster turns the permit test into a game. Free. Gamified. Your teen will actually study. Download now."
- CTA: "Learn More" or "Download App"
- Production: Stock photo + text overlay (10 min).
- Emoji: 📚

**Concept 2: "Every Illinois Teen Procrastinates. Make It Less Painful."**
- Visual: Dash mascot, confident, pointing at camera.
- Copy: "Free permit-test prep that's actually fun. Gamified. No BS. Your teen finishes quizzes in 10 min, not all night."
- CTA: "Download Free"
- Production: Illustration or animation (30 min).
- Emoji: 🎯

**Concept 3: "One App. 3000 Questions. 0 Paywall."**
- Visual: Phone screenshot of DriveMaster dashboard, colorful, stats visible.
- Copy: "Illinois parents: Your teen deserves better than boring practice tests. DriveMaster is free, gamified, and works."
- CTA: "Try Free"
- Production: Screenshot + text (5 min).
- Emoji: 🏆

**Concept 4: "Your Teen Passed Their Permit Test. What's Their Secret?"**
- Visual: Teen holding their new permit, smiling (or stock photo), Dash mascot in corner.
- Copy: "DriveMaster: The free permit-test prep Illinois teens trust. Gamified, mascot-coached, zero upsells. Start now."
- CTA: "Download"
- Production: Video testimonial or stock photo (20 min).
- Emoji: ✅

**Concept 5: "Dash's XP System Makes Permit-Test Prep Addictive"**
- Visual: Animated GIF of XP counter, streaks, leaderboard (Dash celebrating).
- Copy: "Studying for the permit test sucks. Unless you're using DriveMaster. Gamified, free, built for procrastinators."
- CTA: "Play Now"
- Production: Animated GIF or video (45 min).
- Emoji: 🔥

---

## 4. Landing Page Strategy

Today, DriveMaster has one landing page (homepage). Ad funnel will fragment if every ad sends to the same URL. Create 4 landing pages, A/B them, measure conversion to signup.

**Option A: Four Distinct Landing Pages**

1. **`/illinois-permit-test`** (parent-targeting, Google Search for "illinois permit test")
   - Hero: "Illinois Permit Test Prep That Actually Works"
   - Subheader: "Free. Gamified. No paywalls. For teens 15-17."
   - Social proof: Unverified for now (replace with real review once one teen uses it). Placeholder: "Trusted by Illinois families."
   - CTA: "Start Free" (button)
   - Design: Cabinet Grotesk hero, DM Sans body, Blue CTA, Orange accents on feature cards.

2. **`/free-illinois-dmv-practice-test`** (SEO-optimized, Google Search for "free illinois DMV practice test")
   - Hero: "Free Illinois DMV Practice Test — 3000+ Official Questions"
   - Subheader: "Learn the rules, pass the test, drive free."
   - Emphasis: "Free" appears 4+ times in above-the-fold.
   - Social proof: "3000+ practice questions" (factual), "Learn with Dash, an AI coach" (factual).
   - CTA: "Practice Now" (button)
   - Design: Cabinet Grotesk for numbers, DM Sans for explainers, Green accents (test-passing theme).

3. **`/illinois-teen-permit-15-years-old`** (explicit age framing, reassures parents and teens)
   - Hero: "For Illinois Teens (15-17): Free Permit-Test Prep That Doesn't Suck"
   - Subheader: "Pass the test. Get your license. Stop procrastinating."
   - Tone: Dash speaks in testimonial ("Yo, I gotchu"). Mascot front-and-center.
   - Social proof: "Designed for your age. Coaches explain things you'll actually understand."
   - CTA: "Let's Go" (button)
   - Design: Dash-forward visual, TikTok-native colors, Orange > Blue priority.

4. **Homepage `/`** (broad, all traffic, existing)
   - Status: Keep as-is for organic/direct. Update "unverified claims" (10,000+ drivers, 95% pass rate, 4.9 rating) to honest, factual claims only (or remove if not yet validated).
   - CTA: "Study Free"

**A/B Test Plan:**

With sub-$500 budgets, statistical significance is not reachable. Instead, treat landing pages as qualitative signal.

- **Week 2 (before paid spend):** Route all organic traffic to all four pages (rotate in round-robin). Measure: qual feedback from Reddit seeders, email responses, and organic visitors. Which landing page gets the most positive comments?
- **Week 3 (if $500+ budget approved):** Route paid traffic (Google, Meta) to the top-2 landing pages. Measure: CTR, signup rate, bounce rate. Run for 7 days. If one page has >10% better signup rate, reallocate 70% of budget to that page for week 4.

**Flag:** At <$500 total budget and <50 signups, these are qualitative signals, not statistical proofs. Make calls based on founder intuition + data, not data alone.

---

## 5. Funnel Targets (Numeric)

All metrics start at zero. This section defines the baseline to beat.

**Impression → Click (CTR)**

| Channel | Expected CTR | Notes |
|---------|--------------|-------|
| TikTok Organic | N/A | Organic posts measure views, not CTR. Amplified posts: expect 2-5% CTR. |
| Google Search | 3-8% | Vary by keyword (high intent). "Illinois permit test" = higher end. Brand search = lower. |
| Meta (Facebook/Instagram) | 0.8-2% | Depends on audience relevance. Parent targeting: expect 1.2-2%. Cold audience: 0.8-1%. |
| Reddit Organic | N/A | Organic posts measure upvotes/comments. Paid ads: 0.3-0.8% CTR (low engagement platform). |
| Email | 2-5% | Depends on list warmth. Cold email: 2%. Warm list: 5-10%. |

**Source of truth for clicks:** Ad platform reporting (Meta Ads Manager, Google Ads, Reddit Ads). Verify with PostHog event `landing_page_view` or GA4 event (if loaded).

---

**Click → Signup (Conversion Rate)**

| Channel | Expected Conversion Rate | Notes |
|---------|--------------------------|-------|
| TikTok | 8-15% | App link directly in bio or link-in-bio. Frictionless (native). |
| Google Search | 12-20% | High intent. Landing page optimized for signup form. |
| Meta | 8-12% | Medium intent. Landing page is key variable. |
| Reddit | 15-25% | High intent (self-selected audience). Community trust is asset. |
| Email | 10-20% | Depends on list warmth. Parent email: expect 12-15%. |

**Source of truth for signups:** Supabase `auth.users` table count. PostHog event `signup_completed` (if consent granted, rare for minors). UTM middleware cookie + PostHog property (once built).

---

**Signup → Activation (First Quiz)**

| Target | Expected Rate | Baseline | Notes |
|--------|----------------|----------|-------|
| Sign up → First quiz start | 50-70% | Week 1-2: TBD (onboarding friction unknown). Week 3+: expect 60%+. | Onboarding is the biggest funnel cliff. Fix nav + UI bugs in sprint week 1. |
| Quiz start → Quiz completion | 80-95% | Week 1-2: measure. Expect high (8 questions, 5 min). | Measure via PostHog event `quiz_completed`. |

**Source of truth:** PostHog events `first_quiz_started` and `quiz_completed`. Fallback (if PostHog consent is low): Manual count from Supabase `quiz_sessions` table.

---

**Activation → Day-7 Retention**

| Metric | Target | Notes |
|--------|--------|-------|
| Signup → Day-7 active (1+ quiz attempt) | 25-40% | Critical gate for ad scaling. If <25%, paid spend is broken; pause and fix product. |
| Day-7 active → Day-30 active | 50-70% | Implies strong retention loop. If achieved, monetization and feature work unlock. |

**Source of truth:** Supabase query: `SELECT user_id, MAX(created_at) as last_quiz_date FROM quiz_sessions WHERE created_at BETWEEN now()-7 days AND now() GROUP BY user_id` Count distinct users. Divide by signups 7 days ago = day-7 retention rate.

---

**CPA (Cost Per Acquisition = Signup)**

| Budget Scenario | CPA Ceiling | Total Signups Expected | Notes |
|-----------------|-------------|------------------------|-------|
| $500 learning budget | $40-50 | 10-12 | Spread across 4 weeks. Kill/scale gates weekly. |
| $2000 serious test budget | $30-40 | 50-60 | Sufficient for statistical significance. Run for 4 weeks, measure day-7 retention. |

**Calculation:** Total spend / signups = CPA. If CPA > ceiling for 3+ days, pause channel and investigate (wrong audience, wrong landing page, or ad fatigue).

---

## 6. Budget Plan (4 Weeks)

**Scenario A: $500 Learning Budget**

| Week | Allocation | Channels | Goal | Kill Gate |
|------|-----------|----------|------|-----------|
| Week 1 (Apr 21-27) | $0 (organic only) | TikTok, Reddit, Email | Recruit one teen, seed organic posts, no spend. | N/A. Organic baseline to beat. |
| Week 2 (Apr 28-May 4) | $100 | Google Search ($50), Meta ($30), Email lists ($20 effort) | 2-3 signups from paid (proof of concept). Measure CPA. | If CPA > $75 on any channel, kill that channel. |
| Week 3 (May 5-11) | $200 | Google Search ($120, scale if CPA < $50), Meta ($50, test retargeting), TikTok amplified ($30). | 5-8 signups. Observe day-7 retention on week 2 signups. | If day-7 retention < 15%, pause all spend and fix product friction. If any channel CPA > $60, cut by 50%. |
| Week 4 (May 12-19) | $200 | Winner channels only (reallocate to highest-converting 2 channels). Hold budget steady. | 8-12 signups total by end of week 4. Measure cumulative day-7 retention. | If cumulative day-7 retention < 20%, conclude: "Paid spend is not the bottleneck; product is. Pause ads, focus on retention loops." |

**Scenario B: $2000 Serious Test Budget**

| Week | Allocation | Channels | Goal | Kill Gate |
|------|-----------|----------|------|-----------|
| Week 1 (Apr 21-27) | $0 (organic + validation) | TikTok, Reddit, Email, founder outreach | Recruit one real teen for week 2 observation. Establish organic baseline. | Fail if: No teen recruited by end of week. |
| Week 2 (Apr 28-May 4) | $300 | Google Search ($150), Meta ($100), Reddit ads ($50). | 8-12 signups. Observe day-7 retention on prior week's cohort. | If CTR < 2% on any channel after 1k impressions, kill that channel. If CPA > $50, reduce budget. |
| Week 3 (May 5-11) | $700 | Scale top-2 channels by 60%. Experiment with TikTok amplification ($100). Test landing page A/B (rotate traffic). | 25-35 signups. Measure day-7 retention on weeks 1-2 cohorts. | If day-7 retention < 20%, pause all new spend until product friction is fixed. Keep budget in reserve. |
| Week 4 (May 12-19) | $1000 | Pour remaining budget into highest-converting 2 channels (if day-7 retention > 20%). Prepare for week 5 scaling or pivot. | 40-60 signups total by end of week 4. Measure cumulative day-7 and day-30 retention. | If cumulative CPA > $40, conduct channel audit (wrong audience, landing page mismatch, ad fatigue). If day-7 retention < 25%, hold budget and fix product. |

**Key Budget Rules:**

- **Kill decision:** If CPA exceeds ceiling for 3 consecutive days (72 hours), pause that channel. Investigate before restart.
- **Scale decision:** If CTR > 5% and CPA < $30, increase daily budget by 30-50%.
- **Hold decision:** If metrics are in-range but not improving, keep budget steady. Do not double down unless engagement is rising week-over-week.
- **Reserve rule:** Hold 15-20% of budget in reserve for late-week pivots. Do not commit the full budget week 1.

---

## 7. Attribution Plan

**UTM Middleware (Engineering Prerequisite)**

Before any paid spend > $500, implement the following in Next.js middleware:

```typescript
// lib/middleware/utm.ts — pseudocode, not production-ready
export function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const utm = {
    source: searchParams.get('utm_source'),       // e.g. 'google', 'facebook', 'tiktok'
    medium: searchParams.get('utm_medium'),       // e.g. 'cpc', 'social', 'organic'
    campaign: searchParams.get('utm_campaign'),   // e.g. '2026-04-permit-test'
    content: searchParams.get('utm_content'),     // e.g. 'concept-1-dash-walks-you'
    term: searchParams.get('utm_term'),          // e.g. 'illinois+permit+test' (search)
  };
  
  if (Object.values(utm).some(v => v !== null)) {
    // Set 30-day cookie
    const response = NextResponse.next();
    response.cookies.set('utm_data', JSON.stringify(utm), { maxAge: 2592000 });
    return response;
  }
  
  return NextResponse.next();
}
```

**On Signup (Auth Callback):**

Extract `utm_data` cookie, pass to PostHog:

```typescript
// app/api/auth/callback/route.ts
const utmCookie = request.cookies.get('utm_data');
const utmData = utmCookie ? JSON.parse(utmCookie.value) : {};

posthog.capture({
  distinctId: user.id,
  event: 'signup_completed',
  properties: {
    utm_source: utmData.source,
    utm_medium: utmData.medium,
    utm_campaign: utmData.campaign,
    utm_content: utmData.content,
    utm_term: utmData.term,
  },
});
```

**Ad Platform Pixel Events:**

- **Meta Pixel:** Fire `Purchase` event on signup (value: $0, for retargeting pool). Fire `ViewContent` on first quiz.
- **TikTok Pixel:** Fire `CompleteRegistration` on signup. Fire `CustomEvent` on quiz completion.
- **GA4:** Fire `sign_up` event on signup, `engagement` event on quiz completion.

**Fraud Detection Thresholds:**

- **Bot threshold:** If >30% of clicks from a single source yield zero PostHog events (no landing-page-view, no signup), pause that traffic source. Investigate: wrong landing page, ad copy mismatch, or bot traffic.
- **Pixel discrepancy:** If ad platform reports 50 conversions but Supabase auth.users shows only 20 signups in the same period, investigate pixel misconfiguration or double-counting.
- **Conversion delay:** If signups from source X are clustered within 5 minutes (bot-like), flag as suspicious and limit daily spend on that source.

**Monthly Attribution Report (template):**

| Channel | Impressions | Clicks | CTR | Signups | CPA | Day-7 Retention | Notes |
|---------|-----------|--------|-----|---------|-----|-----------------|-------|
| Google | 5k | 350 | 7% | 45 | $33 | 28% | Strong, scale. |
| Meta | 8k | 120 | 1.5% | 10 | $60 | 20% | Low CTR, investigate. |
| TikTok Organic | 0 | 0 | - | 5 | $0 | 40% | Organic baseline. |
| Reddit | 2k | 200 | 10% | 30 | $20 | 35% | Best performer, scale. |

---

## 8. Organic Moats to Run in Parallel

Paid channels are temporary (budget ends, effectiveness diminishes). Organic channels compound over time. Run these 5 in parallel with any paid spend.

**1. TikTok Organic Cadence**

- **Frequency:** 5 posts in 14 days (roughly 3-4 days apart).
- **Rule:** If any single post exceeds 1,000 views, analyze why and double down on that format in the next post.
- **Content mix:** 2-3 Dash-focused (mascot emotion, hype speeches), 1 teen-testimonial (once available mid-May), 1 behind-the-scenes (founder's process, real questions, product updates), 1 trend-participation (sound/challenge trend relevant to teens or driving).
- **Metrics:** Track views, likes, shares, saves, comment sentiment. Do not optimize for follower count; optimize for click-through to DriveMaster.

---

**2. Reddit Seeding**

- **Communities:** r/Illinois (large state sub, 500k+ members), r/teenagers (1M+ members, high traffic), r/driving (niche, 100k+ members), r/ACT and r/SAT (test-prep adjacency, can mention "same prep principles").
- **Cadence:** 1 post per community per week, week 1-4. 4 total posts in 14 days.
- **Tone:** Authentic founder voice, not brand marketing. "Hey r/Illinois, I'm building a free permit-test app. Would love feedback. You can DM me or try it here [link]."
- **Engagement:** Respond to every comment for 72 hours. Answer questions. Be genuinely helpful. Do not defend the product; listen and iterate.
- **Metrics:** Upvotes, comments, CTR, signup attribution (track `utm_source=reddit` in UTM). Success = 1+ post per subreddit breaks 100+ upvotes and 20+ comments, with high sentiment.

---

**3. SEO Content Velocity (5 New Landing Pages)**

- **Goal:** Land organic Google traffic on target keywords ("illinois permit test", "free illinois DMV practice test", "how to pass illinois permit test").
- **Content:** Build 5 pages with 800-1500 word posts, internal links, and meta tags:
  1. `/blog/illinois-permit-test-study-guide` (guide, 1200 words)
  2. `/blog/how-to-pass-illinois-dmv-test` (how-to, 1000 words)
  3. `/blog/best-free-illinois-permit-test-prep` (best-of, 1000 words, can list competitors honestly)
  4. `/blog/illinois-driving-rules-you-need-to-know` (rules explainer, 1500 words, can be auto-generated from questions DB)
  5. `/blog/how-long-to-study-for-illinois-permit-test` (psychology/tips, 800 words)
- **Timeline:** Write in batch (week 1, outsource if possible). Publish 1 per week starting week 1. Use each as a landing page for organic search traffic.
- **Metrics:** Track organic traffic, bounce rate, time-on-page, CTR to signup. Success = 5+ organic visitors per page per day by end of week 4 (cumulative 350+ visits/month by May 19).

---

**4. Referral Loop Stub**

- **Mechanics:** Once a teen passes a quiz, show a share card (already designed, OG Image). Add a "Send to a friend" CTA. Track `referral_source=user_[id]` in UTM.
- **Incentive (optional):** "Share this and unlock a bonus category" (not yet built, flag for week 3). Without incentive, expect 2-5% of share-card viewers to actually refer.
- **Metrics:** Track referral signups (UTM source = user ID). If >10% of week 2-3 signups come from referrals, prioritize the referral incentive feature for week 3.

---

**5. Driver's Ed Partnership Outreach**

- **List:** 10-20 Illinois-based driver's ed instructors (search "driver's ed near me" in Illinois, scrape from Google Maps or Yelp, find email/phone).
- **Outreach:** Short, genuine email: "Hi, I'm building a free permit-test prep app for Illinois teens. Would you recommend it to students as a study tool? [link to app, link to partner info page]" (create `/partners` page if needed).
- **Cadence:** Email 5 instructors per week, starting week 2. Follow up after 1 week. Schedule 15-min calls with any who express interest.
- **Metrics:** Instructor adoption (how many add a link to their website?), referral traffic from partner sites, email click-through rate. Success = 3+ instructors linking to DriveMaster by end of week 4, driving 20+ signups.

---

## 9. Red Flags / Kill Switches

Tripwires that trigger an immediate decision: kill, pause, or investigate.

| Flag | Threshold | Action |
|------|-----------|--------|
| **CPA exceeds ceiling for 3 days** | CPA > $X (see budget plan) for 72 hours | Pause channel. Investigate (wrong audience, landing page mismatch, ad fatigue). Do not restart until root cause identified. |
| **CTR below 1% after 1k impressions** | Any channel, CTR < 1% after 1000 impressions | Kill that channel. Either audience is wrong or ad creative is off. Rotate creative or audience, then retest. |
| **Day-7 retention < 15%** | Cohort of 10+ signups, <15% active on day 7 | Pause paid spend immediately. Fix product friction (onboarding, core loop, navigation bugs). Paid spend is wasting money if product doesn't retain. |
| **Ad quality score drops below 6** | Meta Ad Account, Google Ads quality score | Audit ads for compliance issues. If under-18 targeting is detected, pause and revert to parent/18+ targeting only. |
| **Bot traffic threshold breach** | >30% of clicks yield zero PostHog events | Pause traffic source. Review ad placement (context, bot farms). Investigate with ad platform support. |
| **Unverified claims on landing page** | Any landing page claims "95% pass rate", "10,000+ users", "4.9 stars" without evidence | Remove all unverified claims. Replace with factual, honest claims ("Free", "3000+ questions", "Made for Illinois teens"). Legal + credibility issue. |
| **Zero organic traction after 2 weeks** | TikTok: 0 posts exceed 500 views. Reddit: 0 posts exceed 50 upvotes. | Pivot content strategy. Analyze what competitors' organic content looks like. Rotate format or frequency. |
| **Compliance notice from Meta or TikTok** | Ad account warning or suspension | Immediately stop spend. Review account for under-18 targeting violations. Revert to parent/18+ targeting or organic-only. This is a legal issue. |

---

## 10. Next 14 Days — Concrete Checklist

**Week 1 (Apr 21-27): Validation + Organic Foundation**

| Day | Item | Owner | Est. Hours | Output |
|-----|------|-------|-----------|--------|
| 1 | Text 2 people to find one Illinois teen for 20-min Zoom usability test + Venmo $20. (This is item #1 because it's the gate.) | Founder | 0.5 | At least 1 "yes" or 1 warm lead in motion. |
| 2 | Remove unverified landing page claims ("10,000+ users", "95% pass rate", "4.9 rating"). Replace with factual claims or placeholder. | Founder | 1 | Updated `/app/page.tsx`. Commit. |
| 3 | Implement UTM middleware in `lib/middleware/utm.ts`. Extract `utm_*` query params, store in 30-day cookie. Test locally. | Founder (or eng) | 4 | Middleware module, tested. Commit. Flag for Vercel env var setup if any. |
| 4 | Set up PostHog free tier. Create account, get API key, install SDK in `lib/providers/posthog.ts`. Instrument: `signup_completed`, `first_quiz_started`, `quiz_completed`. | Founder | 3 | PostHog client configured, 3 events instrumented, deployed. Verify events fire in dev. |
| 5 | Seed organic TikTok post #1 ("Dash Walks You Through It" concept). Screen-record, add voiceover, post. (15-60 sec, natural, no edits required.) | Founder | 0.5 | 1 TikTok post live. Track views. |
| 6 | Seed Reddit post #1: r/Illinois. "Hey, building a free permit-test app for Illinois teens, would love feedback." Monitor for 48 hours, respond to all comments. | Founder | 1 | Reddit post live, 10+ comments, 1+ constructive feedback incorporated. |
| 7 | Send batch 1 of warm email outreach: 5-10 parents/instructors in your network. Short, genuine pitch. Track open rate (if using Gmail). | Founder | 1 | 5-10 emails sent, 1+ interest signals. Document responses. |

**Week 2 (Apr 28-May 4): Observation + Early Paid Test**

| Day | Item | Owner | Est. Hours | Output |
|-----|------|-------|-----------|--------|
| 8 | Conduct 20-min moderated Zoom usability session with recruited teen. Record via Clarity + video. Silent observation. | Founder | 1 | Video recording of teen using app end-to-end (signup → quiz → results). Notes on where they hesitated, smiled, or got confused. |
| 9 | Analyze recorded session. Document: 3 moments where UX was confusing, 3 moments where UX delighted. Pick ONE feature to ship week 3 based on observed friction. | Founder | 2 | 1-page analysis doc. 1 feature recommendation for week 3. Commit to backlog. |
| 10 | Set up Google Ads account. Create 3 ad groups for "illinois permit test", "free illinois DMV practice test", "illinois teen permit". Budget: $50 for 1 week. | Founder | 2 | Google Ads campaign live, $50/week budget, tracking enabled, UTM links in ads. Monitor daily. |
| 11 | Set up Meta Ads account (or Business Manager). Create 2 ad sets: cold audience (parents 35-55 in IL), warm audience (website visitors). Budget: $30. | Founder | 2 | Meta campaign live, $30/week budget, pixel firing, UTM links in ads. Monitor daily. |
| 12 | Send TikTok organic post #2 (Dash hype speech concept). | Founder | 0.5 | 1 TikTok post live. |
| 13 | Send Reddit post #2: r/teenagers. "A permit-test app for people your age. Made it free because cramming sucks." Monitor for upvotes/comments. | Founder | 1 | Reddit post live, respond to comments. Track upvote count. |
| 14 | Email batch 2: 5-10 more parent/instructor outreach. Personalize based on batch 1 feedback. | Founder | 0.5 | 5-10 emails sent. Document open rates if trackable. |

**Week 3+ Contingent (May 5+): Scale or Fix**

- **If day-7 retention from week 2 signups ≥ 20%:** Scale week 2 successful channels by 50%. Add TikTok amplification ($30/day). Test landing page A/B. Budget: $200-300 for week 3.
- **If day-7 retention < 15%:** Pause paid spend. Fix product friction (onboarding, core loop bugs, nav shell). Resume ads only after fix is deployed and verified by another teen session.

---

## What This Doc Is NOT

**Not a substitute for real user validation.** This plan assumes one real Illinois teen will validate retention by mid-May. If that validation doesn't happen, every CPA estimate in this doc is guesswork. Paid spend before validation is burning money to learn nothing.

**Not licensed legal or compliance advice for minor-targeting.** COPPA, BIPA (Illinois), and platform policies (Meta, TikTok, Google) are real constraints. This doc reflects April 2026 platform rules. Rules change. Consult a lawyer if spending >$5k on ads to under-18 audiences. Age-gate + parental consent are hard prerequisites for compliant paid targeting of under-18 in most verticals.

**Budget numbers are benchmarks, not guarantees.** CPA can be wrong by 2-3x in either direction for a niche vertical like Illinois permit-test prep. Factors that shift CPA: seasonality (summer higher), landing page design (poor design = 2x worse CPA), audience match (wrong list = infinite CPA), and product retention (broken product = wasted CPA). Real numbers only come from week 2-3 test spend.

**Any channel CPA estimate can be wrong.** CPM/CPC ranges are from 2025-2026 education vertical. Illinois-specific driving-test vertical may have different economics. Test small first ($20-50 per channel), measure, then scale.

---

## Key Findings & Recommendations

**3 Highest-Confidence Recommendations:**

1. **Validate one real teen's retention before paid scaling (week 1-2 gate).** This is the biggest risk in any ad strategy for a pre-product-market-fit app. Running ads before retention is proven turns ad spend into expensive learning. The sprint plan is right: observation first, ads second. Enforce this as a hard rule.

2. **Target parents on Meta/Google + broad "driving education" audiences, not under-18 directly.** COPPA killed under-18 interest-targeting in 2023. Parent-targeting (Meta + Google) works legally and converts well. Pair with organic TikTok reach for under-18 direct exposure. This sidesteps compliance friction and scales faster.

3. **Google Search is the highest-ROI entry channel.** Searchers for "illinois permit test" have immediate intent. Expected CPA: $30-40. CPM is lower than Meta. Start here for week 2-3 test spend. TikTok organic is the long-term moat; Google is the quick feedback loop.

**1 Thing I'm Least Confident About:**

**Day-7 retention baseline.** The plan assumes 20-30% of signups will be active on day 7. This is aspirational for a free education app (Duolingo is ~30%, driving-tests.org is unknown). DriveMaster has heavy competitors. If real day-7 retention lands at 5-10%, the entire ad plan inverts: organic-only until retention loops improve, then paid scales. The spec for testing this is strong (week 2 observation), but the actual number is a blind spot.

**Open Questions Needing Founder Input Before Execution:**

1. **Custom domain priority:** Acquiring `drivemaster.app` (or `drivemaster.co`) is a 1-2 week task with $50-200 cost and DNS setup. Should this ship before week 3 paid spend? (Recommendation: yes, if budget allows. Credibility matters for parent conversion.)

2. **Age-gating and parental consent:** The sprint plan mentions this is a week 4-6 feature. If it ships earlier, paid targeting of under-18 becomes compliant and precise. Should this be prioritized for week 2 instead of the retention feature? (Trade-off: slower week-2 retention observation, faster week-3 scaling of paid under-18 targeting.)

3. **Email list building:** The plan assumes warm parent email exists (friends with kids, instructors). How many addresses are actually available day 1? If <10, should budget email outreach as a longer-term channel? (Recommendation: start with what exists, build list as organic traffic arrives.)

4. **Seasonality verification:** "April-May is mid-season" is assumed based on IL DMV test patterns, not measured. Should the founder run a quick Google Trends check on "illinois permit test" search volume (week 1) to confirm, or accept the assumption and proceed? (Recommendation: 15-min check in week 1. If volume is actually 50% of July, adjust budget down. If volume is 90% of July, budget can be more aggressive.)

5. **Reddit moderation risk:** r/teenagers and r/Illinois have strict rules on self-promotion. Posts can be auto-removed. Should seeding include a backup plan (Discord communities, niche forums) if Reddit is hostile? (Recommendation: yes. Have a 5-community fallback list ready by week 1.)

---

**Commit message:** `docs(ads): 4-week ad strategy + attribution plan + 14-day founder checklist`
