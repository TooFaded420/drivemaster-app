# Design System — Ace Your Permit (formerly DriveMaster)

## Product Context
- **What this is:** A gamified driving test prep PWA with a mascot (Dash), XP/streaks/leaderboards, and AI-powered explanations
- **Who it's for:** Anyone procrastinating on the Illinois permit test — first-timers (15+), adults new to Illinois, and retakers
- **Space/industry:** Ed-tech / test prep (competitors: Duolingo, Zutobi, DMV Genie, driving-tests.org)
- **Project type:** Mobile-first web app (PWA)

## Aesthetic Direction
- **Direction:** Playful/Toy-like with energy
- **Decoration level:** Intentional — gradient cards for stats, clean white space in quiz UI
- **Mood:** Fun, energetic, game-native. Feels like a game, not homework. Duolingo's playfulness with a bit of street energy. Dash's voice is casual and encouraging — works for anyone, skews teen-friendly but never patronizing.
- **Reference sites:** Duolingo (mascot-driven, white space, bold color), Zutobi (gamification, leaderboards), but Ace Your Permit is more personality-driven than either

## Typography
- **Display/Hero:** Cabinet Grotesk 800 — rounded, bold, modern. Feels like a game title, not a textbook. `letter-spacing: -0.03em`
- **Subheadings:** Cabinet Grotesk 700 — `letter-spacing: -0.02em`
- **Body:** DM Sans 400/500 — clean readability, friendly for long explanations
- **UI/Labels:** DM Sans 500/600
- **Data/Tables:** JetBrains Mono — tabular numbers (`font-variant-numeric: tabular-nums`), XP counters, timers, scores
- **Code:** JetBrains Mono
- **Loading:** Cabinet Grotesk via Fontshare CDN (`https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800`), DM Sans + JetBrains Mono via Google Fonts
- **Scale:**
  - `text-xs`: 12px / 1rem (labels, captions)
  - `text-sm`: 14px (body small, badges)
  - `text-base`: 16px (body default)
  - `text-lg`: 18px (subheadings)
  - `text-xl`: 20px (card titles, quiz questions)
  - `text-2xl`: 24px (section headers)
  - `text-3xl`: 32px (page titles)
  - `text-4xl`: 48px (hero display)
  - `text-5xl`: 72px (share card score)

## Color
- **Approach:** Balanced — primary + accent + semantic
- **Primary:** `#2563EB` (Electric Blue) — CTAs, active states, links, brand identity
- **Primary Light:** `#3B82F6` — hover states, lighter accents
- **Primary Dark:** `#1D4ED8` — pressed states, shadows
- **Accent:** `#F97316` (Hot Orange) — energy, urgency, streaks, fire, challenge buttons
- **Accent Light:** `#FB923C` — hover
- **Accent Dark:** `#EA580C` — pressed, shadows
- **Success:** `#10B981` (Emerald) — correct answers, passed quizzes, completed tasks
- **Error:** `#EF4444` — wrong answers, errors
- **Warning:** `#F59E0B` (Amber) — streak warnings, attention
- **Info:** `#06B6D4` (Cyan) — informational messages, tips
- **XP Gold:** `#FBBF24` — XP earnings, achievements, special badges
- **Neutrals (cool gray):**
  - `#F8FAFC` — bg-subtle (card backgrounds)
  - `#F1F5F9` — bg-muted (section backgrounds)
  - `#E2E8F0` — borders
  - `#94A3B8` — muted text, placeholders
  - `#475569` — secondary text
  - `#0F172A` — primary text
- **Dark mode strategy:** Invert surfaces (`#0F172A` bg, `#1E293B` cards), reduce color saturation 10-15%, keep accent orange at full saturation for energy

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — generous padding on mobile (thumb-friendly)
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)
- **Touch targets:** 44px minimum height for all interactive elements on mobile
- **Card padding:** 20-24px default, 32px for feature cards
- **Section padding:** 48-64px vertical

## Layout
- **Approach:** Grid-disciplined — consistent cards, predictable alignment
- **Grid:** 1 column mobile, 2 columns tablet, 3-4 columns desktop
- **Max content width:** 1200px (7xl)
- **Mobile nav:** Fixed bottom bar (4 items: Home, Quiz, Rank, Profile) + top bar with logo
- **Desktop nav:** Collapsible left sidebar (72px collapsed, 256px expanded)
- **Border radius:**
  - `sm`: 6px (inputs, small badges)
  - `md`: 10px (buttons, option cards)
  - `lg`: 16px (cards, dialogs)
  - `xl`: 24px (feature cards, quiz cards, modals)
  - `full`: 9999px (badges, avatars, progress bars)

## Motion
- **Approach:** Intentional — purposeful animations that aid comprehension and delight
- **Easing:**
  - Enter: `ease-out` (elements arriving)
  - Exit: `ease-in` (elements leaving)
  - Move: `ease-in-out` (position changes)
  - Spring: `type: "spring", stiffness: 300, damping: 30` (mascot, celebrations)
- **Duration:**
  - Micro: 50-100ms (button press, toggle)
  - Short: 150-250ms (fade in/out, hover)
  - Medium: 250-400ms (card transitions, page changes)
  - Long: 400-700ms (XP counter animation, confetti)
- **Key animations:**
  - Quiz question transitions: fade + slide (250ms)
  - XP counter: animated increment to final value (600ms)
  - Dash speech bubble: spring animation on appear
  - Streak milestone: scale-in + bounce (400ms)
  - Share card generation: shimmer loading → reveal (500ms)
  - Confetti on quiz pass: particle burst (700ms)
- **Rules:** No parallax scrolling. No auto-playing animations. Respect `prefers-reduced-motion`.

## Dash Mascot Design
- **Emotions:** Happy (default), Excited (milestones), Thinking (AI loading), Encouraging (wrong answers)
- **Sizes:** sm (32px), md (64px), lg (96px), xl (128px)
- **Speech bubble:** White bg, 2px border, rounded-2xl, spring animation, dismissible
- **Personality:** Hype-beast friend — ultra-casual, Gen Z, emoji-friendly, never condescending
- **AI explanation tone rules:**
  - Acknowledge their choice first, then explain
  - Never say "incorrect" or "wrong" — say "nah" / "oof" / "close but"
  - Max 3 sentences per explanation
  - One emoji per message max
  - No exclamation marks after bad news
  - Example: "Nah that ain't it. At a 4-way stop it's first-come-first-served. Think of it like a line at the cafeteria."

## Share Card Design
- **Format:** Achievement card (score-focused, shareable)
- **Sizes:** 1080x1920 (Instagram Story), 1080x1080 (square post)
- **Layout:** Blue gradient background, "Ace Your Permit Certified" badge, large score %, username, streak count, Dash celebrating, QR code at bottom
- **Typography:** Cabinet Grotesk 800 for score, DM Sans for details
- **Branding:** Subtle — QR code + "aceyourpermit.com" URL, not a logo wall
- **Generated via:** Vercel OG Image Generation (edge-rendered)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-21 | Initial design system created | Created by /design-consultation based on competitive research (Duolingo, Zutobi, DMV Genie) and product context (teen-focused gamified test prep) |
| 2026-03-21 | Blue + orange palette over blue + purple | Orange is more energetic and matches streak/fire theming. Purple felt too corporate for teens. |
| 2026-03-21 | Cabinet Grotesk display font | Rounded and bold — feels like a game, not a textbook. Available free via Fontshare. |
| 2026-03-21 | Dash hype-beast personality | Users respond to "smart friend" not "teacher." Design review chose ultra-casual tone that skews teen-friendly but works for any age. |
| 2026-03-21 | Achievement card over challenge card for sharing | Achievement cards get shared more — users share about themselves, not the app. Challenge mechanic has its own share link. |
| 2026-04-21 | Broadened positioning from teen-first to universal permit-prep | Ace Your Permit serves anyone taking the IL permit test — teens, adults, new residents, retakers. Dash tone and gamification stay; teen exclusivity dropped. |
