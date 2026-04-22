# QA Report 02 — Returning-User Surface & Navigation

**Date:** 2026-04-21  
**Auditor:** QA Tester (automated code review + live curl)  
**Branch:** master  
**Production URL:** https://drivemaster-app.vercel.app

---

## Summary

The returning-user surface has a functional skeleton but relies entirely on hardcoded mock data — no live Supabase reads anywhere on the dashboard. Three routes linked from dashboard page content return 404. The navigation layer has an architectural duplication that causes two competing nav trees to render simultaneously on the `/dashboard` route. Accessibility is partially addressed in the newer `layout/` components but the older `components/navigation.tsx` component (still used by `MobileLayout`) is missing `aria-current`. The skip link exists and targets `#main` correctly, but the `#main` landmark is placed inside `<ThemeProvider>`, which means the skip target wraps the entire application rather than scoping to page content — this is a semantic mismatch.

**Overall grade: C+**  
Core navigation works. Auth gating works. But data is 100% mock, two dead-link routes are surfaced to logged-in users on the dashboard, and the dual-nav architecture is a latent render bug.

---

## Dead Links / 404-Prone Routes

| Route | Source | Live Status | Notes |
|---|---|---|---|
| `/test` | Dashboard page — "Timed Test" quick action button (line 161) | **404** | No `app/test/` directory exists. The timed test lives at `/quiz/timed`, not `/test`. |
| `/categories` | Dashboard page — "View All" link in Category Progress card (line 176) | **404** | No `app/categories/` directory exists. No categories index route anywhere. |
| `/profile` | All nav components (mobile bottom bar, sheet menu, desktop sidebar) | **200 (app shell, renders 404 content)** | No `app/(dashboard)/profile/` or `app/profile/` page file exists. The server returns HTTP 200 because the Next.js app shell renders but the page itself shows 404 content. Confirmed via body inspection: the response contains eight `404` text nodes with the DriveMaster title. |

---

## Dashboard Stats Grid — Data Source Audit

**File:** `app/(dashboard)/dashboard/page.tsx`

All stat cards read from `mockStats`, `mockCategories`, and `mockDailyQuests` — hardcoded constants defined at the top of the file (lines 27–48). There is no Supabase query, no TanStack Query hook, no Zustand store read anywhere in this component.

Specific findings:

- **XP card** (`mockStats.totalXP = 1250`) — hardcoded. No connection to `user_stats` table.
- **Accuracy card** (`mockStats.accuracy = 82`) — hardcoded. No connection to quiz session data.
- **Level card** (`mockStats.currentLevel = 8`) — hardcoded.
- **Level progress bar** (`mockStats.levelProgress = 65`) — hardcoded percentage. The `Progress` component renders it as a static bar.
- **Streak indicator** — rendered from `mockStats.currentStreak = 5` in the orange pill (line 87). Hardcoded. No daily login tracking or Supabase read.
- **"Continue where you left off"** — not present. There is no such link or feature in the component.
- **Daily Quests** — three hardcoded quests with static `current`/`target` values. Quest 3 (`completed: true`) is always pre-completed regardless of actual user activity.
- **Category Progress** — four hardcoded categories. The "View All" link goes to `/categories` which is a 404 (see above).
- **Leaderboard preview** — five hardcoded entries. "You" is always rank 3 at 1,950 XP regardless of the authenticated user.

**Risk:** A returning user sees data that never changes regardless of their actual study activity. The streak shows `5` for every user, the leaderboard always shows them at rank 3. This will erode trust when users notice their stats never update.

---

## Navigation Architecture Issues

### Dual-nav rendering on `/dashboard`

The dashboard route (`app/(dashboard)/layout.tsx`) renders `<DesktopSidebar />` and `<MobileNav />` directly (lines 20–21). The `dashboard/page.tsx` then wraps its content in `<MobileLayout>`, which internally renders `<Navigation />` (from `components/navigation.tsx`) — a second nav tree containing both `<MobileNavigation>` and `<DesktopNavigation>`.

On desktop at `/dashboard`, this produces:
- One sidebar from `components/layout/desktop-sidebar.tsx` (via layout)
- A second sidebar from `components/navigation.tsx` → `DesktopNavigation` (via `MobileLayout`)

Both are `fixed left-0 top-0 w-64` or similar — they stack on top of each other. The layout sidebar wins visually because it renders first in the DOM, but the second sidebar still exists in the accessibility tree. Screen readers encounter duplicate landmark navigation regions with the same set of links.

On mobile, there are two `<header>` elements with `fixed top-0` and two `<nav>` elements with `fixed bottom-0`.

**The `components/navigation.tsx` component appears to be the original nav that was not fully removed when `components/layout/desktop-sidebar.tsx` and `components/layout/mobile-nav.tsx` were introduced.**

Also affected: `app/(dashboard)/settings/page.tsx` also uses `<MobileLayout>`, confirming this pattern repeats across dashboard pages.

### Nav item inventories differ between the two nav trees

| Item | `components/navigation.tsx` | `components/layout/mobile-nav.tsx` / `desktop-sidebar.tsx` |
|---|---|---|
| Dashboard `/dashboard` | Yes (label: "Home") | Yes (label: "Home" / "Dashboard") |
| Quiz `/quiz` | Yes (label: "Quiz") | Yes (label: "Quiz" / "Practice Quiz") |
| Leaderboard `/leaderboard` | Yes (label: "Rank") | Yes (label: "Rank" / "Leaderboard") |
| Profile `/profile` | Yes (label: "Profile") | Yes (label: "Profile") |
| Settings `/settings` | Sheet menu only (below divider) | Sidebar footer only |

The label for the same destination differs between mobile and desktop in `desktop-sidebar.tsx`: mobile nav says "Dashboard" while the item label is "Home" in the mobile bar — inconsistent text for the same destination across breakpoints.

### `aria-current` gaps

- `components/layout/desktop-sidebar.tsx` — `aria-current="page"` is applied to the `<Link>` element (line 179). Correct.
- `components/layout/mobile-nav.tsx` — `aria-current="page"` is applied to both the sheet menu `<Link>` (line 85) and the bottom bar `<Link>` (line 134). Correct.
- `components/navigation.tsx` (`MobileNavigation` / `DesktopNavigation`) — **no `aria-current` attribute anywhere**. The active state is communicated only via CSS class (`text-primary`). Screen readers have no programmatic active-page indicator when this component tree is the one in the accessibility focus order.

---

## Touch Target Audit

The CSS utility classes are defined correctly (`touch-target` = 44px min, `touch-target-comfortable` = 48px). Application at component level:

| Component | Class used | Rendered height | Compliant |
|---|---|---|---|
| Mobile bottom bar buttons (`mobile-nav.tsx`) | `h-14 touch-target-comfortable` | 56px | Yes |
| Sheet menu items (`mobile-nav.tsx`) | `h-12 touch-target-comfortable` | 48px | Yes |
| Desktop sidebar nav items (`desktop-sidebar.tsx`) | `h-11` | 44px | Yes (exact minimum) |
| Desktop sidebar collapse button | `h-11` | 44px | Yes (exact minimum) |
| Mobile top bar hamburger (`navigation.tsx` legacy) | `touch-target` (size="icon") | 44px | Yes |
| Mobile bottom bar (`navigation.tsx` legacy) | `h-14 touch-target-comfortable` | 56px | Yes |
| Dashboard "Timed Test" / "Quick Practice" buttons | `h-auto py-6` (size="lg") | Approx 68px | Yes |
| Onboarding checklist close button (`dashboard/page.tsx` line 98) | No touch-target class | Inherits button default ~36px | **Fail — below 44px minimum** |
| Mascot widget close button (`dashboard/page.tsx` line 323) | `text-xs px-2` (size="sm") | ~32px | **Fail — below 44px minimum** |

---

## A11y Findings

### 1. Skip link target scope mismatch

`app/layout.tsx` line 132–137: The skip link `href="#main"` correctly links to `id="main"` on line 146. However, `id="main"` is on the `<main>` element that wraps the entire application including every page, dashboard, nav, and footer. Activating the skip link does scroll to `#main`, but `#main` is at the very top of the document — functionally the skip link skips nothing for dashboard pages because `<MobileNav>` is rendered inside `#main` (via `DashboardLayout` which lives inside `#main`). The `fixed` positioning of the nav visually puts it above the content, but in DOM order the nav components in the layout render before the page content children. The skip link should target the start of the page-specific content, not the root layout `<main>`.

### 2. `aria-label` on hamburger trigger

`components/navigation.tsx` line 74–76: The `SheetTrigger` button contains `<span class="sr-only">Open menu</span>`. This is acceptable but the trigger button itself has no explicit `aria-label`; it relies on the `sr-only` span content being exposed as the button's accessible name. This is correct by spec but fragile — if `asChild` causes the span to be stripped, the button becomes unlabelled. `components/layout/mobile-nav.tsx` (the replacement component) does the same pattern (line 58–60).

### 3. Keyboard shortcut labels misleading on non-Mac

`desktop-sidebar.tsx` and `mobile-nav.tsx` display `⌘D`, `⌘Q`, `⌘L`, `⌘P` keyboard shortcut indicators. The keyboard handler in `desktop-sidebar.tsx` (lines 79–106) listens for `e.altKey || e.metaKey` — so on Windows the shortcuts work with `Alt+D` etc., but the UI always shows the Mac `⌘` symbol. Windows users see `⌘D` but must press `Alt+D`. No platform detection adjusts the label.

### 4. Keyboard shortcuts modal missing `role="dialog"` and focus trap

`desktop-sidebar.tsx` lines 270–314: The keyboard shortcuts modal is a plain `<div>` with `fixed inset-0`. It has no `role="dialog"`, no `aria-modal`, no `aria-labelledby`, and no focus trap. When opened, focus does not move into the modal. Screen reader users who invoke `⌘/` (Alt+/) will not be informed a modal has opened.

### 5. Onboarding checklist close button missing accessible label

`dashboard/page.tsx` line 98–103: The dismiss button for the onboarding checklist renders only `<X className="w-4 h-4" />` with no `aria-label` or `sr-only` text. Screen readers announce this as an unlabelled button.

### 6. Mascot widget close button missing accessible label

Same pattern at line 322–329. The `<X className="w-3 h-3" />` button dismissing the floating Dash widget has no `aria-label`. Announced as unlabelled.

### 7. MobileLayout introduces a second `<main>` element

`components/mobile-layout.tsx` line 15: `<main className="md:ml-64 min-h-screen">`. The root layout already wraps everything in `<main id="main">`. Dashboard pages using `MobileLayout` produce a nested `<main>` inside `<main>`, which is invalid HTML. Landmark navigation via screen readers will encounter two nested main regions.

---

## Mobile Nav Sheet — Specific Checks

- **Open/close:** `Sheet` from Radix UI handles open/close via `isMenuOpen` state. Radix `SheetContent` provides focus trap and `aria-modal` automatically. Pass.
- **`aria-label` on trigger:** sr-only span present. Acceptable. See finding 2.
- **`SheetTitle`:** present as `sr-only` — "Navigation Menu". Pass.
- **`SheetDescription`:** present as `sr-only` — "Access navigation links and settings". Pass.
- **Close button inside sheet:** Radix provides a built-in accessible close button in `SheetContent`. Pass.
- **`aria-current` in sheet menu items:** present in `mobile-nav.tsx`, absent in `navigation.tsx` (legacy). See aria-current section.

---

## Desktop Sidebar — Active State Styling

`desktop-sidebar.tsx` line 169–192: Active state applies `variant="secondary"` and `bg-primary/10 text-primary` via `cn()`. This is a visual-only distinction (background tint + text color change). There is no border, underline, or other non-color indicator. For users with color blindness or high-contrast mode the active item may not be distinguishable if the background tint has insufficient contrast. The active item also correctly receives `aria-current="page"` (programmatic signal exists).

Collapse state is persisted to `localStorage` under key `"sidebar-collapsed"`. This is correct but has no SSR guard — reading `localStorage` in a `useEffect` (lines 59–63) means there will be a hydration flicker from default-expanded to persisted-collapsed on first paint for users who have collapsed the sidebar.

---

## Footer (app/page.tsx)

The footer at lines 485–502 contains a single link: `/privacy`. Status: **200**. No other footer links are present (no Illinois-specific SEO page links, no `/signup`, no contact). The footer is minimal and all present links resolve correctly.

The SEO landing pages (`/illinois-permit-test`, `/free-illinois-dmv-practice-test`, `/illinois-road-signs-test`, `/illinois-teen-permit-15-years-old`, `/rules-of-the-road`) are all live and return 200. They are not linked from the footer — they are only accessible via direct URL or search. This is intentional for SEO but means there is no internal discovery path for these pages from within the app.

---

## Route Curl Summary

| Route | Expected | Actual | Notes |
|---|---|---|---|
| `/` | 200 | 200 | Pass |
| `/dashboard` | 307 redirect to /login (no session) | 200 | Vercel returns 200 because curl follows the server-side redirect to `/login` which itself is a 200. Auth gating confirmed via layout code. |
| `/quiz` | 200 | 200 | Pass |
| `/leaderboard` | 200 | 200 | Pass |
| `/settings` | 200 | 200 | Pass |
| `/profile` | 404 expected | 200 (app shell, 404 content) | **Fail** — no route file, app shell renders |
| `/privacy` | 200 | 200 | Pass |
| `/login` | 200 | 200 | Pass |
| `/signup` | 200 | 200 | Pass |
| `/test` | Should not exist | 404 | **Fail** — linked from dashboard |
| `/categories` | Should not exist | 404 | **Fail** — linked from dashboard |
| `/illinois-permit-test` | 200 | 200 | Pass |
| `/free-illinois-dmv-practice-test` | 200 | 200 | Pass |
| `/illinois-road-signs-test` | 200 | 200 | Pass |
| `/illinois-teen-permit-15-years-old` | 200 | 200 | Pass |
| `/rules-of-the-road` | 200 | 200 | Pass |
| `/quiz/practice` | 200 | 200 | Pass |
| `/quiz/timed` | 200 | 200 | Pass |
| `/quiz/results` | 200 | 200 | Pass |
| `/quiz/marathon` | 200 | 200 | Pass |
| `/quiz/mistakes` | 200 | 200 | Pass |
| `/quiz/category/1` | 200 | 200 | Pass |

---

## Prioritised Findings

### Critical (breaks user experience for logged-in users)
1. **`/test` is 404** — "Timed Test" quick action button on dashboard is broken. Should link to `/quiz/timed`. (`dashboard/page.tsx` line 161)
2. **`/categories` is 404** — "View All" in Category Progress card is broken. No categories index page exists. Either create the route or remove the link. (`dashboard/page.tsx` line 176)
3. **`/profile` shows 404 content** — Profile is in every nav bar but has no page. Every user who taps Profile gets an error state. A stub page or redirect is needed immediately.
4. **All dashboard stats are mock data** — XP, accuracy, level, streak, category progress, and leaderboard are all hardcoded constants. Returning users see fabricated data that never changes. This is the highest-impact data integrity issue.

### High (degrades navigation reliability)
5. **Dual-nav architecture** — `MobileLayout` renders a full second nav tree alongside the one in `DashboardLayout`. Results in duplicate landmarks, potential double-render of fixed-position elements, and `aria-current` gaps in the legacy tree.
6. **Nested `<main>` elements** — `MobileLayout` wraps content in `<main>` while the root layout already has `<main id="main">`. Invalid HTML, confuses landmark navigation.

### Medium (accessibility)
7. **`aria-current` absent in `components/navigation.tsx`** — the legacy nav components used by `MobileLayout` have no programmatic active-page indicator.
8. **Keyboard shortcuts modal missing dialog semantics** — no `role="dialog"`, `aria-modal`, or focus trap.
9. **Close buttons missing accessible names** — onboarding checklist dismiss and mascot widget dismiss have no `aria-label` or `sr-only` text.
10. **Skip link targets root `<main>` not page content** — functionally skips nothing for dashboard pages.

### Low (polish)
11. **Keyboard shortcut labels show `⌘` on all platforms** — Windows users must use `Alt` key but see the Mac symbol.
12. **Sidebar collapse hydration flicker** — `localStorage` read happens after mount; persisted-collapsed users see a flash of expanded state.
13. **`X` import at bottom of file in `desktop-sidebar.tsx`** — `import { X } from "lucide-react"` appears at line 320, after the component export. While this works in most bundlers, it violates the convention of placing all imports at the top of the file and could confuse tree-shaking analysis.
14. **Nav label inconsistency** — Dashboard destination is labelled "Home" on mobile bottom bar, "Dashboard" in desktop sidebar, and "Home" in the sheet menu. Same destination, three different labels across breakpoints.
