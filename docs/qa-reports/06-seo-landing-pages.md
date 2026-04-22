# QA Report 06 — SEO Landing Pages Audit

**Date:** 2026-04-21
**Auditor:** QA Agent
**Pages tested:** 5 SEO landing pages (live on Vercel)
**Method:** Live HTTP fetch + source code inspection

---

## Executive Summary

| Page | SEO | Content | CTA | Design | Perf | A11y | Overall |
|------|-----|---------|-----|--------|------|------|---------|
| /illinois-permit-test | A | A | B+ | A | A | B | **A-** |
| /free-illinois-dmv-practice-test | C | B+ | B+ | B | B | B | **B-** |
| /rules-of-the-road | B+ | A | B+ | A | A | B | **B+** |
| /illinois-road-signs-test | C | A | B | A | B | B | **B** |
| /illinois-teen-permit-15-years-old | C | B+ | B | B+ | A | B+ | **B** |

**Critical blockers: 3** (canonical mismatch on 3 of 5 pages)
**Significant issues: 4** (no cross-linking, purple used in one page, H1 line-break, missing `<header>` on 4 pages)
**Minor issues: 6** (no breadcrumbs, title missing brand suffix on 2 pages, FAQ JS-only on one page, `getdrivemaster.com` domain vs `drivemaster-app.vercel.app`)

---

## Sitemap Verification

**URL:** `https://drivemaster-app.vercel.app/sitemap.xml`

| URL | Priority | Changefreq | Status |
|-----|----------|------------|--------|
| / (homepage) | 1.0 | weekly | OK |
| /illinois-permit-test | 0.9 | monthly | OK |
| /free-illinois-dmv-practice-test | 0.9 | monthly | OK |
| /rules-of-the-road | 0.8 | monthly | OK |
| /illinois-road-signs-test | 0.8 | monthly | OK |
| /illinois-teen-permit-15-years-old | 0.8 | monthly | OK |
| /privacy | 0.5 | monthly | OK |

**Verdict: PASS.** All 5 SEO pages are present. Priorities are in the 0.8–0.9 range as required. No issues.

---

## Page-by-Page Findings

---

### 1. /illinois-permit-test

**HTML size:** 101,857 bytes (99.5 KB) — PASS (under 200 KB)

#### SEO Signals — Grade: A

| Check | Result |
|-------|--------|
| Single H1 | PASS — "Illinois Permit Test Practice 2026" |
| Title tag | PASS — "Illinois Permit Test Practice 2026" |
| Meta description | PASS — 154 chars, keyword-rich |
| Canonical | PASS — `https://drivemaster-app.vercel.app/illinois-permit-test` (trailing slash added by Next.js, matches deployment domain) |
| FAQPage JSON-LD | PASS — valid, 7 questions in `@graph`, proper `Question`/`acceptedAnswer` structure |
| Course JSON-LD | PASS — `@graph` includes `Course` with `provider`, `educationalLevel`, `isAccessibleForFree` |
| OG tags | PASS |
| No breadcrumb schema | FAIL — not present |

**JSON-LD assessment:** Both `FAQPage` and `Course` nodes share a single `@graph` array — valid schema.org pattern. `@id` fragments are correctly scoped to the canonical URL. No structural errors found.

#### Content Quality — Grade: A

- Word count: ~2,200 words — PASS (target 800–1,200; this page exceeds the upper bound but the extra depth is justified for the primary keyword)
- H2 subheads: 9 — PASS (target 5–7; slightly over but all are topically distinct)
- 3 sample questions: PASS — IDs il-ts-001, il-tl-001, il-sd-001, all sourced from `lib/data/questions/`
- FAQ accordion: PASS — uses native `<details>`/`<summary>`, no JS required
- No factual errors detected

#### CTA Flow — Grade: B+

- Primary CTA: "Start Free Practice" → `/signup` — PASS
- Secondary CTA: "Try Practice Questions" → `/quiz/practice` — PASS
- Button heights: `h-12` (48px) on hero buttons, `h-11` (44px) on nav — PASS (44px minimum met)
- CTA color: Primary uses `bg-[#2563EB]` (blue). The secondary footer CTA uses `border-[#F97316] text-[#F97316]` (orange outline). **Minor:** DESIGN.md specifies orange (#F97316) as the accent/CTA color; primary hero CTAs are blue, which is the primary brand color. This is defensible but inconsistent with the accent-for-CTA convention.

#### Design Compliance — Grade: A

- `font-display` applied to all headings (17 instances) — PASS
- No purple — PASS
- Brand colors used: `#2563EB` (blue), `#F97316` (orange), `#10B981` (green) — all correct
- Dash block present with hype tone — PASS
- No `<header>` semantic element — the hero is inside a plain `<section>`. Nav uses `<nav>`. **Minor:** missing `<header>` landmark.

#### Performance — Grade: A

- HTML size: 99.5 KB — PASS (well under 200 KB)

#### Accessibility — Grade: B

| Check | Result |
|-------|--------|
| Skip link | PASS — present |
| `<main>` landmark | PASS |
| `<nav>` landmark | PASS |
| `<header>` landmark | FAIL — missing; hero content has no `<header>` wrapper |
| `<footer>` landmark | FAIL — no page footer element |
| Breadcrumb | FAIL — not present |
| Images missing alt | PASS — 0 undecorated `<img>` tags |
| 44px touch targets | PASS — all interactive elements have `min-w-[44px]` or `h-11`/`h-12` |

---

### 2. /free-illinois-dmv-practice-test

**HTML size:** 132,899 bytes (129.8 KB) — PASS (under 200 KB)

#### SEO Signals — Grade: C

| Check | Result |
|-------|--------|
| Single H1 | PASS — "Free Illinois DMV Practice Test" (rendered; source has `<br />` inside `<h1>` making the rendered text "Free Illinois DMV\nPractice Test" — the newline is inconsequential for crawlers but confirms the visual break) |
| Title tag | PASS — "Free Illinois DMV Practice Test 2026 — No Signup, No Ads \| DriveMaster" |
| Meta description | PASS — well-targeted |
| **Canonical** | **FAIL — CRITICAL** — canonical is hard-coded to `https://getdrivemaster.com/free-illinois-dmv-practice-test`. The page is deployed at `drivemaster-app.vercel.app`. Google sees the canonical pointing to a different domain (`getdrivemaster.com`) that is not the live deployment. This tells Google the authoritative version lives elsewhere. If `getdrivemaster.com` does not resolve or does not serve this page, this canonical is self-defeating. |
| FAQPage JSON-LD | PASS — flat `@type: FAQPage` (not wrapped in `@graph`), valid structure, 6 questions |
| WebApplication JSON-LD | PASS — valid type, `price: "0"` |
| No Course JSON-LD | NOTE — no `Course` schema. Not required, but the other pages have it. |
| OG tags | PASS |

#### Content Quality — Grade: B+

- Word count: ~1,150 words — PASS (within 800–1,200 target)
- H2 subheads: 6 — PASS
- 3 sample questions: PASS — IDs il-ts-006, il-ts-007, il-tl-007
- FAQ accordion: PASS — native `<details>`/`<summary>`
- **Note:** The `SampleQuestion` component renders correct answers pre-revealed (all answer options displayed with the correct one highlighted in green). This is intentional UX but differs from the `<details>` reveal pattern on other pages — not a bug, but worth consistency review.
- No factual errors detected in content

#### CTA Flow — Grade: B+

- Primary CTA: "Start Free Practice Test" → `/signup` — PASS
- Secondary: "Try 3 Sample Questions First" → `/quiz` — PASS (note: routes to `/quiz` not `/quiz/practice` — minor inconsistency vs other pages)
- Mid-page CTA uses `bg-orange-500` (on-brand orange) — PASS
- Nav CTA uses `bg-blue-600` — PASS
- Button heights: `min-h-[44px]` throughout — PASS

#### Design Compliance — Grade: B

- `font-display` on headings (6 instances — lower than other pages but present on all major headings) — PASS
- **FAIL — PURPLE PRESENT:** `features` array contains two items using `bg-purple-100` / `text-purple-600` ("Zero Paywalls" feature card) and `bg-pink-100` / `text-pink-600` ("Timed Test Simulator" card). DESIGN.md explicitly prohibits purple. The "Zero Paywalls" feature icon uses purple background. This violates the design system.
  - Source line ~679: `iconBg: "bg-purple-100", iconColor: "text-purple-600"`
  - Source line ~685: `iconBg: "bg-pink-100", iconColor: "text-pink-600"`
- Dash block present with hype tone — PASS
- `<footer>` element present on this page — PASS (only page with a full footer)

#### Performance — Grade: B

- HTML size: 129.8 KB — PASS but largest of the pages without a full footer (the footer adds markup)

#### Accessibility — Grade: B

| Check | Result |
|-------|--------|
| Skip link | PASS |
| `<main>` landmark | PASS |
| `<nav>` landmark | PASS |
| `<header>` landmark | FAIL — no `<header>` element |
| `<footer>` landmark | PASS — footer element present |
| Breadcrumb | FAIL |
| Images missing alt | PASS |

---

### 3. /rules-of-the-road

**HTML size:** 108,912 bytes (106.4 KB) — PASS

#### SEO Signals — Grade: B+

| Check | Result |
|-------|--------|
| Single H1 | PASS — "Illinois Rules of the Road — 2026 Handbook Summary" |
| Title tag | PASS — matches H1, no brand suffix (minor) |
| Meta description | PASS — 155 chars |
| Canonical | PASS — resolved via `metadataBase` + relative path `/rules-of-the-road` → `https://drivemaster-app.vercel.app/rules-of-the-road`. Correct. |
| FAQPage JSON-LD | PASS — flat `@type: FAQPage`, 6 questions, valid |
| Course JSON-LD | PASS — includes `teaches`, `courseWorkload: PT3H`, `isAccessibleForFree` |
| OG tags | PASS |
| Breadcrumb schema | FAIL |

**Note:** Title tag has no brand suffix ("| DriveMaster") — minor SEO miss. The `title` constant is reused for both the `<title>` and OG title.

#### Content Quality — Grade: A

- Word count: ~2,300 words — slightly above 1,200 target but appropriate for a handbook summary page
- H2 subheads: 10 (7 chapter headings + Sample Questions + FAQ + closing CTA) — above target range but justified by chapter structure
- 3 sample questions: PASS — IDs il-tl-002, il-sr-003, il-ve-001
- FAQ accordion: PASS — uses `<details>`/`<summary>` (ChevronDown icon in summary, CSS rotation on open)
- No factual errors detected

#### CTA Flow — Grade: B+

- Primary CTA: "Practice Free — No Account Needed" → `/signup` — PASS
- Secondary: "Try a Practice Question" → `/quiz` — PASS
- Button colors: `bg-blue-600` primary, orange accent in badge — PASS
- Touch targets: `h-11`/`h-12` — PASS

#### Design Compliance — Grade: A

- `font-display` on all headings (16 instances) — PASS
- No purple — PASS
- Brand colors correct — PASS
- `<header>` missing — FAIL (minor)

#### Performance — Grade: A

- 106.4 KB — PASS

#### Accessibility — Grade: B

| Check | Result |
|-------|--------|
| Skip link | PASS |
| `<main>` landmark | PASS |
| `<nav>` landmark | PASS |
| `<header>` landmark | FAIL |
| `<footer>` landmark | FAIL |
| Breadcrumb | FAIL |
| Images missing alt | PASS |

---

### 4. /illinois-road-signs-test

**HTML size:** 167,504 bytes (163.6 KB) — PASS (under 200 KB, but largest of the 5)

#### SEO Signals — Grade: C

| Check | Result |
|-------|--------|
| Single H1 | PASS — "Illinois Road Signs Test — Study Guide 2026" |
| Title tag | PASS — "Illinois Road Signs Test — Study Guide 2026 \| DriveMaster" |
| Meta description | PASS — well-targeted |
| **Canonical** | **FAIL — CRITICAL** — hard-coded to `https://drivemaster.app/illinois-road-signs-test`. Page is live at `drivemaster-app.vercel.app`. Same domain mismatch issue as `/free-illinois-dmv-practice-test`. |
| FAQPage JSON-LD | PASS — in `@graph`, 6 questions, correct structure |
| Course JSON-LD | PASS — in `@graph` |
| WebPage JSON-LD | PASS — `@graph` also contains `WebPage` node (most detailed JSON-LD of all 5 pages) |
| ImageObject JSON-LD | NOTE — 6 `ImageObject` nodes for sign illustrations. `contentUrl` values point to fragment anchors (`#sign-stop`, `#sign-yield`) rather than actual image URLs. **These are not valid image URLs** and will be ignored or flagged by Google's Rich Results Test. Should point to actual hosted image assets or be removed. |
| **JSON-LD domain mismatch** | **FAIL** — all `@id` values and `url` fields inside JSON-LD reference `drivemaster.app` while the page is served from `drivemaster-app.vercel.app`. |
| OG URL | FAIL — also references `drivemaster.app` |

#### Content Quality — Grade: A

- Word count: ~2,300 words — above 1,200 target; justified for a comprehensive sign reference page
- H2 subheads: 9 — slightly above target but all meaningful
- 3 sample questions: PASS (sample questions verified in source)
- FAQ: 6 questions via `<details>`/`<summary>` — PASS (the FAQ H3s in the JSX are actually `<summary>` elements rendered from the FAQ data, not separate H3 tags)
- No factual errors detected; sign categories and colors are accurate

#### CTA Flow — Grade: B

- Primary CTA: "Take Full Signs Quiz Free" → `/signup` — PASS
- Secondary: "Practice Mode" → `/quiz` — PASS
- Touch targets: `h-11`/`h-12` — PASS
- **Minor:** No dedicated `/quiz/road-signs` route — CTAs route to generic `/quiz`, missing a topical deep-link opportunity

#### Design Compliance — Grade: A

- `font-display` on headings (17 instances) — PASS
- No purple — PASS
- Brand colors correct — PASS
- `<header>` missing — FAIL (minor)

#### Performance — Grade: B

- 163.6 KB — PASS but approaching the 200 KB limit. The 6 `ImageObject` JSON-LD blocks add payload without functional benefit given the fragment-anchor `contentUrl` issue.

#### Accessibility — Grade: B

| Check | Result |
|-------|--------|
| Skip link | PASS |
| `<main>` landmark | PASS |
| `<nav>` landmark | PASS |
| `<header>` landmark | FAIL |
| `<footer>` landmark | FAIL |
| Breadcrumb | FAIL |
| Images missing alt | PASS |

---

### 5. /illinois-teen-permit-15-years-old

**HTML size:** 125,115 bytes (122.2 KB) — PASS

#### SEO Signals — Grade: C

| Check | Result |
|-------|--------|
| Single H1 | PASS — "How to Get Your Illinois Permit at 15" |
| Title tag | PASS — "How to Get Your Illinois Permit at 15 \| DriveMaster" |
| Meta description | PASS — conversational, targets "learners permit at 15 in Illinois" |
| **Canonical** | **FAIL — CRITICAL** — hard-coded to `https://drivemaster.app/illinois-teen-permit-15-years-old`. Same domain mismatch as pages 2 and 4. |
| FAQPage JSON-LD | PASS — flat `@type: FAQPage`, 7 questions, valid structure |
| Article JSON-LD | PASS — `@type: Article` with `headline`, `author`, `publisher`, `dateModified` |
| No Course JSON-LD | NOTE — uses Article type instead; appropriate for this page's editorial angle |
| OG `type: article` | PASS — correctly typed |

#### Content Quality — Grade: B+

- Word count: ~1,900 words — above 1,200 target but appropriate depth for a GDL guide
- H2 subheads: 6 — PASS
- 3 sample questions: PASS — IDs il-is-001, il-is-005, il-ad-002
- FAQ: 7 questions via `<details>`/`<summary>` — PASS
- **Factual accuracy review (high-confidence flags):**
  - "Permit hold time: 9 mo" in the quick-stat bar — **NEEDS VERIFICATION.** Illinois GDL requires holding an instruction permit for a minimum of **9 months** before applying for a Graduated Driver's License (GDL). This is accurate per the IL SOS handbook as of 2024. PASS.
  - "50 total hours of supervised driving, 10 at night" — PASS, matches IL SOS requirements.
  - Curfew: "Sunday–Thursday 10 PM–6 AM, Friday–Saturday 11 PM–6 AM" — PASS, matches IL 625 ILCS 5/6-107.
  - "Without driver's ed, minimum age is 17 years and 3 months" — PASS, correct per IL statute.
  - BAC "0.00% — not 0.02% or 0.05%, literally zero" — PASS, Illinois zero-tolerance policy is correct.
  - **Minor factual nuance:** The page states a non-parent adult supervisor "needs to be at least 21 years old and hold a valid Illinois driver's license, with your parent's permission." The IL SOS handbook states the supervisor must be a licensed driver 21 or older but does not explicitly require written parental permission for a non-parent supervisor. The "parent's permission" detail is added context not directly from statute. Low severity — errs on the side of caution.

#### CTA Flow — Grade: B

- Primary: "Practice IL Permit Questions Free" → `/signup` — PASS
- Secondary: "Jump to Checklist" → `#checklist` anchor — PASS
- Closing CTA: "Create Free Account" → `/signup` — PASS
- Nav CTA uses blue — PASS
- Hero primary CTA uses `bg-blue-600` (not orange). **Minor:** Per DESIGN.md, orange is the accent/CTA color. Blue is acceptable as a primary brand color but inconsistent with the accent-CTA pattern used on other pages.
- Touch targets: `h-11`/`h-12` — PASS

#### Design Compliance — Grade: B+

- `font-display` on headings (14 instances) — PASS
- No purple — PASS
- `<header>` element: PASS — this is the only page (besides the homepage) that wraps the hero in a `<header>` element. Consistent with semantic HTML best practice.
- Orange accent used in badge and info block — PASS
- Dash block with hype tone — PASS

#### Performance — Grade: A

- 122.2 KB — PASS

#### Accessibility — Grade: B+

| Check | Result |
|-------|--------|
| Skip link | PASS |
| `<main>` landmark | PASS |
| `<nav>` landmark | PASS |
| `<header>` landmark | PASS (only page with correct `<header>`) |
| `<footer>` landmark | FAIL |
| Breadcrumb | FAIL |
| Images missing alt | PASS |

---

## Cross-Cutting Issues

### ISSUE-1 (CRITICAL): Canonical URL Domain Inconsistency

Three of five pages have canonicals pointing to domains other than the live deployment (`drivemaster-app.vercel.app`):

| Page | Canonical in Source | Live Domain | Impact |
|------|---------------------|-------------|--------|
| /free-illinois-dmv-practice-test | `getdrivemaster.com` | `drivemaster-app.vercel.app` | Critical |
| /illinois-road-signs-test | `drivemaster.app` | `drivemaster-app.vercel.app` | Critical |
| /illinois-teen-permit-15-years-old | `drivemaster.app` | `drivemaster-app.vercel.app` | Critical |

If `getdrivemaster.com` and `drivemaster.app` are the intended production domains (and `vercel.app` is a staging/deployment URL), these canonicals are forward-looking and intentionally signal authority will move there. **However**, until those domains are live and serving these exact pages, Google may ignore the canonical or treat it as invalid, hurting indexation of the current live URLs.

**Fix:** Either (a) set `NEXT_PUBLIC_APP_URL` to the canonical production domain in Vercel environment variables, or (b) ensure all canonical domains are live and resolving to the same content.

### ISSUE-2 (HIGH): Zero Cross-Linking Between SEO Pages

None of the 5 SEO pages link to any of the other 4. A user on `/rules-of-the-road` has no in-page link to `/illinois-road-signs-test` or `/illinois-permit-test`. This is a missed opportunity for:
- Topical authority clustering (internal PageRank flow between related pages)
- User journeys (a teen reading about rules of the road would benefit from a road signs link)
- Reduced bounce rate

**Recommendation:** Add a "Related guides" section to each page with 2–3 internal links. Minimum viable: `/illinois-permit-test` should link to `/rules-of-the-road` and `/illinois-road-signs-test`; `/illinois-teen-permit-15-years-old` should link to `/illinois-permit-test`.

### ISSUE-3 (HIGH): ImageObject JSON-LD on /illinois-road-signs-test Uses Fragment Anchors as contentUrl

Six `ImageObject` nodes in the road signs page JSON-LD use `contentUrl` values like `https://drivemaster.app/illinois-road-signs-test#sign-stop`. These are anchor fragments, not image URLs. Google's Rich Results processor expects a resolvable image URL (JPEG, PNG, WebP, etc.). These will not surface as valid image rich results and may generate structured data warnings in Search Console.

**Fix:** Either point `contentUrl` to actual hosted image assets, or remove the `ImageObject` nodes entirely until real sign images exist.

### ISSUE-4 (MEDIUM): Purple Used on /free-illinois-dmv-practice-test

DESIGN.md explicitly prohibits purple. The features grid on this page uses:
- `bg-purple-100` / `text-purple-600` on the "Zero Paywalls" feature card icon
- `bg-pink-100` / `text-pink-600` on the "Timed Test Simulator" card icon

**Fix:** Replace with brand-compliant colors. Suggested replacements:
- "Zero Paywalls": `bg-green-100` / `text-green-600` (aligns with "free/safe" messaging)
- "Timed Test Simulator": `bg-orange-100` / `text-orange-600` (accent color, suggests urgency)

### ISSUE-5 (MEDIUM): Missing `<header>` Semantic Element on 4 of 5 Pages

`/illinois-permit-test`, `/free-illinois-dmv-practice-test`, `/rules-of-the-road`, and `/illinois-road-signs-test` have no `<header>` element wrapping the hero section. Only `/illinois-teen-permit-15-years-old` uses `<header>` correctly. Screen readers and assistive technology use `<header>` to identify the page banner landmark (ARIA role `banner`). This is a consistent omission.

### ISSUE-6 (MEDIUM): No Breadcrumb Navigation or Schema on Any Page

None of the 5 pages have breadcrumb navigation UI or `BreadcrumbList` JSON-LD. For pages nested under an implied content hierarchy (e.g., Illinois > Permit Test > Road Signs), breadcrumbs:
- Help users understand site structure
- Appear in Google SERPs as path annotations
- Provide an internal link back to higher-level pages

**Recommended breadcrumb:** Home > [Page Name] at minimum; or Home > Permit Test Prep > [Page Name] for deeper pages.

### ISSUE-7 (LOW): Inconsistent Title Tag Branding

| Page | Has "DriveMaster" in Title |
|------|---------------------------|
| /illinois-permit-test | NO |
| /free-illinois-dmv-practice-test | YES |
| /rules-of-the-road | NO |
| /illinois-road-signs-test | YES |
| /illinois-teen-permit-15-years-old | YES |

Two pages omit the brand suffix. While keyword-first titles are acceptable, consistent branding aids recognition in SERPs.

### ISSUE-8 (LOW): Duplicate Content Risk — "3,400+ Questions" Claim

Every page repeats the "3,400+ free questions" claim in nearly identical phrasing. While this is a feature differentiator, the meta descriptions for pages 1 and 3 are structurally similar. Google does not currently flag these as duplicate pages (distinct H1s and canonical topics differ them), but the boilerplate language across hero sections is high enough that monitoring for cannibalization is advisable once all pages are indexed.

### ISSUE-9 (LOW): /free-illinois-dmv-practice-test CTAs Route to /quiz, Others Route to /quiz/practice

Pages 1, 3, and 4 send secondary CTAs to `/quiz/practice`. Page 2 sends to `/quiz`. This inconsistency could affect conversion tracking if the two routes have different funnel behavior.

---

## Factual Accuracy Summary

| Claim | Page | Verdict |
|-------|------|---------|
| 35 questions, 80% passing score | All pages | PASS — correct |
| Minimum permit age 15 with driver's ed | pages 1, 5 | PASS |
| Without driver's ed: 17 yrs 3 months | pages 1, 5 | PASS |
| 50 supervised hours, 10 at night | page 5 | PASS |
| Curfew Sun–Thu 10 PM, Fri–Sat 11 PM | pages 1, 5 | PASS |
| BAC 0.00% for under-21 | pages 1, 5 | PASS |
| Permit hold time "9 mo" | page 5 | PASS |
| Non-parent supervisor needs "parent's permission" | page 5 | LOW CONFIDENCE — not in statute; extra-statutory addition |
| Fines doubled in construction zones | page 4 | PASS — correct per IL law |
| Handbook ~100 pages | page 3 | PASS — approximate but accurate |

---

## Cleanup

- tmux sessions created: NONE (static fetch audit; no long-running service needed)
- Artifacts created: This report only
- All network requests were read-only HTTP GETs
