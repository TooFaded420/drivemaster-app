# QA Report 09 -- Design System Compliance + Accessibility Audit

**Date:** 2026-04-21
**Auditor:** Claude Opus 4.6 (automated)
**Scope:** DESIGN.md compliance, WCAG AA accessibility, responsive review

---

## 1. Purple / Off-Brand Hex Violations

**Expected:** ZERO after the purple purge (FINDING-005 fix).
**Actual:** 6 remaining instances in the main codebase (excludes .claude/worktrees/).

| # | File | Line | Value | Context |
|---|------|------|-------|---------|
| 1 | app/free-illinois-dmv-practice-test/page.tsx | 677 | bg-purple-100 | Zero Paywalls feature card icon background |
| 2 | app/free-illinois-dmv-practice-test/page.tsx | 678 | text-purple-600 | Zero Paywalls feature card icon color |
| 3 | lib/gamification/achievements.ts | 417 | text-purple-600 | Legendary achievement tier color |
| 4 | lib/gamification/achievements.ts | 418 | bg-purple-100 | Legendary achievement tier background |
| 5 | lib/gamification/achievements.ts | 419 | border-purple-200 | Legendary achievement tier border |
| 6 | app/(quiz)/quiz/category/[id]/page.tsx | 30 | text-purple-600 | Vehicle Operation category color |

**Fix:** Replace all purple-* with blue-* or orange-* per DESIGN.md palette. For Legendary tier, consider text-gold / bg-yellow-100 (XP Gold from DESIGN.md).

**Banned hex codes (#8B5CF6, #EC4899, #A855F7, #7C3AED, #6366F1):** ZERO found. PASS.

---

## 2. Font Usage

**PASS.** Fonts are correctly configured:
- globals.css:14 -- font-display resolves to Cabinet Grotesk (loaded via Fontshare CDN at line 3)
- globals.css:12 -- font-sans resolves to DM Sans
- globals.css:13 -- font-mono resolves to JetBrains Mono
- layout.tsx -- DM Sans and JetBrains Mono loaded via next/font/google
- Headings on landing page (app/page.tsx) use font-display class correctly
- Data elements use font-mono (e.g., quiz-progress.tsx:45, weekly-progress.tsx:86)

---

## 3. Reduced-Motion Gaps

**CRITICAL.** 18 files import framer-motion in the main codebase; only 1 uses useReducedMotion.

### CSS layer (PASS)
- globals.css:858-867 -- Global prefers-reduced-motion: reduce media query kills all CSS animations/transitions. Good.

### Framer Motion layer (FAIL)
The CSS media query does NOT affect Framer Motion JavaScript-driven animations. Each component using repeat: Infinity must check useReducedMotion() or gate the animate prop.

| File | Issue | Has useReducedMotion? |
|------|-------|------------------------|
| components/quiz/streak-indicator.tsx | repeat: Infinity on flame | YES (only file that does) |
| components/mascot/dash-happy.tsx | repeat: Infinity bounce + blink | NO -- has animate prop but defaults true |
| components/mascot/dash-excited.tsx | 6x repeat: Infinity + 2x SVG indefinite | NO |
| components/mascot/dash-thinking.tsx | repeat: Infinity thinking dots | NO |
| components/mascot/dash-loading.tsx | 7x repeat: Infinity loading spinner | NO |
| components/mascot/dash-encouraging.tsx | repeat: Infinity wave/heart | NO |
| components/leaderboard/top-three-podium.tsx | repeat: Infinity rank-1 bounce | NO |
| components/leaderboard/promotion-modal.tsx | repeat: Infinity arrow animation | NO |
| components/quiz/question-card.tsx | Fade/slide on question change | NO (user-triggered, lower risk) |
| components/quiz/answer-options.tsx | Stagger-in on load | NO (one-shot, lower risk) |
| components/quiz/explanation-card.tsx | Fade-in on show | NO (one-shot, lower risk) |
| components/onboarding/tutorial-tooltip.tsx | AnimatePresence transitions | NO (user-triggered) |
| components/onboarding/checklist.tsx | Motion on items | NO (one-shot) |
| components/mascot/index.tsx | Speech bubble spring | NO (user-triggered) |
| components/leaderboard/leaderboard-table.tsx | Stagger-in list items | NO (one-shot) |
| components/layout/floating-action-button.tsx | AnimatePresence on menu | NO (user-triggered) |
| components/leaderboard/weekly-progress.tsx | Progress bar animation | NO (one-shot) |
| components/leaderboard/friends-list.tsx | AnimatePresence on list | NO (one-shot) |

**High-priority fix:** All repeat: Infinity animations MUST be gated. The mascot components, top-three-podium.tsx, and promotion-modal.tsx are the worst offenders -- they produce continuous movement that violates WCAG 2.1 SC 2.3.3 (Animation from Interactions) and SC 2.2.2 (Pause, Stop, Hide).

**Recommended approach:** Add useReducedMotion() to the Dash parent component (components/mascot/index.tsx) and pass animate={!prefersReducedMotion} down to all emotion variants. For leaderboard components, check in each component individually.

### Auto-playing video (MEDIUM)
- app/page.tsx:93-104 -- Hero video with autoPlay loop. Has aria-hidden=true (good), but does not pause when prefers-reduced-motion is enabled. Should add a prefers-reduced-motion check to pause the video.

---

## 4. Dash Tone Compliance

**PASS.**
- app/api/explain/route.ts:33 -- System prompt correctly instructs: Never say incorrect or wrong. Good.
- components/quiz/explanation-card.tsx:47 -- Uses "Not quite" instead of "incorrect". PASS.
- No instances of the banned word "incorrect" in user-facing strings.

---

## 5. No Parallax

**PASS.** Zero hits for translate3d, position: fixed background-scroll patterns, or the word parallax in source code.

---

## 6. Touch Targets Under 44px

| # | File | Line | Element | Size | Issue |
|---|------|------|---------|------|-------|
| 1 | components/ui/button.tsx | 24 | Default button | h-9 (36px) | Below 44px min on mobile |
| 2 | components/ui/button.tsx | 26 | Small button | h-8 (32px) | Below 44px min on mobile |
| 3 | components/ui/input.tsx | 11 | Input field | h-9 (36px) | Below 44px min on mobile |
| 4 | components/onboarding/tutorial-tooltip.tsx | 223, 233, 241 | Tutorial nav buttons | h-8 (32px) | Below 44px min |
| 5 | components/leaderboard/friends-list.tsx | 181, 220, 228 | Accept/reject buttons | h-8 w-8 (32px) | Below 44px min |
| 6 | components/pwa-install-prompt.tsx | 130 | Close button | h-8 w-8 (32px) | Below 44px min |
| 7 | components/challenge/challenge-create.tsx | 94-96, 100-102 | Copy/share buttons | p-2 (~32px) | Below 44px min |

**Note:** The global CSS defines --touch-target-min: 44px and a .touch-target utility class, but these are not applied to the default button/input primitives. The design system rule is violated by its own UI primitives.

**Fix:** Either increase h-9 to h-11 (44px) in button.tsx and input.tsx for mobile, or add a responsive min-h-[44px] on small screens via a media variant.

---

## 7. Accessibility (WCAG AA)

### 7.1 Semantic Landmarks

| Criterion | Status | Notes |
|-----------|--------|-------|
| main once per page | PASS | app/layout.tsx:146 wraps children in main id=main |
| nav aria-label | FAIL | All 7 nav elements across landing pages lack aria-label |
| header | PARTIAL | Only illinois-teen-permit-15-years-old/page.tsx:178 uses header |
| footer | PASS | Present on landing pages |

**Files missing aria-label on nav:**
- app/page.tsx:66
- app/rules-of-the-road/page.tsx:180, 559
- app/illinois-permit-test/page.tsx:159
- app/illinois-teen-permit-15-years-old/page.tsx:154
- app/free-illinois-dmv-practice-test/page.tsx:163
- app/illinois-road-signs-test/page.tsx:753

**WCAG ref:** SC 1.3.1 (Info and Relationships), SC 4.1.2 (Name, Role, Value)
**Fix:** Add aria-label="Main navigation" (or similar descriptive label) to each nav.

### 7.2 Skip Link

**PASS.** app/layout.tsx:132-137 -- Skip link targets #main, uses sr-only focus:not-sr-only pattern. Correctly positioned as first focusable element.

### 7.3 Focus Visibility

**PASS.** Global focus-visible style at globals.css:225-227 applies ring-2 ring-ring ring-offset-2 to all elements. UI primitives (button.tsx, input.tsx, badge.tsx, etc.) also have explicit focus-visible:ring-* classes.

### 7.4 Form Labels

| # | File | Line | Issue | WCAG |
|---|------|------|-------|------|
| 1 | components/challenge/challenge-create.tsx | 88-92 | input readOnly has no aria-label or visible label | SC 1.3.1, SC 4.1.2 |
| 2 | components/leaderboard/leaderboard-table.tsx | 140-144 | Search Input has placeholder but no aria-label or label | SC 1.3.1 |

**Fix:** Add aria-label="Challenge link URL" to the challenge input. Add aria-label="Search users" to the leaderboard search input.

### 7.5 ARIA on Quiz/Answer Options

**PASS (good implementation).**
- components/quiz/answer-options.tsx:50 -- role=radiogroup with aria-label="Answer options"
- Each option: role=radio with aria-checked={isSelected}
- Arrow-key navigation implemented (handleKeyDown)
- Letter indicators marked aria-hidden=true

### 7.6 Color Contrast (Eyeball Assessment)

| Combination | Ratio (approx) | Status |
|-------------|-----------------|--------|
| Body text #1E293B on #F8FAFC | ~14:1 | PASS |
| Muted text #6B7280 on #F8FAFC | ~5.5:1 | PASS |
| Primary #2563EB on white | ~4.6:1 | PASS (large text); borderline for small |
| Orange #F97316 on white | ~3.0:1 | FAIL for body text (SC 1.4.3) |
| White text on #2563EB hero | ~4.6:1 | PASS for large text |
| text-gray-600 (#4B5563) on white | ~7.3:1 | PASS |

**Issue:** Orange accent color #F97316 on white backgrounds does not meet 4.5:1 for normal text. Used in some UI elements as text color.
**Fix:** Use #EA580C (accent-dark) for orange text on white backgrounds, or ensure orange is only used on non-white backgrounds or for large text only.

### 7.7 Alt Text on Images

**PASS.** Both Image instances on app/page.tsx (lines 69-75, 488-493) include alt="DriveMaster". The question-card image (question-card.tsx:101) uses descriptive alt text. No img or Image tags found without alt attributes.

### 7.8 Heading Hierarchy

**PASS on landing page (app/page.tsx):** h1 then h2 then h2 then h2 then h2. No skips.

---

## 8. Responsive Breakpoint Issues

### 8.1 Hero Text Wrap at 375px

**PASS (likely).** Hero uses responsive sizing: text-5xl sm:text-6xl lg:text-7xl with leading-[1.05]. The max-w-3xl container and px-4 padding should prevent overflow at 375px.

### 8.2 Feature Cards Stacking

**PASS.** Features section (app/page.tsx:242) uses grid md:grid-cols-2 lg:grid-cols-3. On mobile (below 768px), cards stack to single column. No hardcoded widths that would overflow.

### 8.3 Value Props Section

**Minor concern:** app/page.tsx:160 uses grid-cols-1 sm:grid-cols-3. At 640px+ (sm breakpoint) three columns may be tight for longer text strings.

---

## Summary

| Category | Count |
|----------|-------|
| CRITICAL | 1 (reduced-motion on infinite Framer Motion animations) |
| HIGH | 2 (purple violations remaining; nav elements missing aria-label) |
| MEDIUM | 4 (touch targets under 44px; form labels missing; orange contrast; video autoplay + reduced-motion) |
| LOW | 1 (missing header on most landing pages) |

### Verdict: REQUEST CHANGES

The reduced-motion gap on continuous Framer Motion animations is a WCAG AA failure (SC 2.2.2, SC 2.3.3) and the highest priority fix. The remaining purple classes violate the design system. Nav aria-label gaps are a straightforward fix.