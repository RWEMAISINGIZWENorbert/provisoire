# 🗺️ Provisoire — Build Roadmap

> Working rules:
> 1. This file is the source of truth — nothing gets built that isn't listed here.
> 2. One item at a time → you review it in the browser → approve/adjust → next.
> 3. Reusable primitives live in `components/ui/`; features compose them, never duplicate.
> 4. Foundation before pages: tokens → primitives → utils → shell → pages.
> 5. `/dev/components` preview page exists for reviewing all UI primitives (dev-only, hidden from prod nav).

---

## Phase 0 — Project Foundation
- [ ] Scaffold Vite + React + TypeScript project
- [ ] Install dependencies:
  - `tailwindcss` + `@tailwindcss/vite` (Tailwind v4)
  - `react-router-dom`
  - `@reduxjs/toolkit` + `react-redux`
  - `@tanstack/react-query`
  - `react-i18next` + `i18next`
  - `zod`
  - `howler` (+ `@types/howler`)
  - `vite-plugin-pwa`
  - `framer-motion` (micro-animations)
- [ ] Folder structure:
  ```
  src/
  ├── app/                  # router, providers, layout shell
  ├── features/
  │   ├── auth/
  │   ├── dashboard/
  │   ├── learn/
  │   ├── practice/
  │   └── profile/
  ├── components/ui/        # reusable primitives
  ├── lib/                  # api client, sound, utils, mock data
  ├── i18n/                 # translations
  ├── store/                # Redux Toolkit slices + hooks
  └── dev/                  # component preview page (dev-only)
  ```
- [ ] Redux store setup: `store/index.ts`, typed `useAppDispatch`/`useAppSelector` hooks
- [ ] App providers wired: Router, Redux `<Provider>`, QueryClient, Toast provider, i18n
- [ ] Dev server verified — blank shell renders

---

## Phase 1 — Design System (Tokens & Global Styles)
- [ ] `src/styles/tokens.css` — CSS custom properties:
  - Colors: `--color-accent` (primary brand), `--color-success`, `--color-error`, neutral scale
  - Semantic tokens only — no raw hex in components
- [ ] `tailwind.config` / `@theme` mapping tokens → Tailwind utilities
- [ ] Font setup: Inter or Outfit via `@fontsource` or Google Fonts
- [ ] `src/styles/global.css` — base reset, focus-visible rings, scrollbar styling
- [ ] `[data-theme="dark"]` token overrides (structure ready even if dark mode ships later)
- [ ] **Review checkpoint**: view token demo page → approve palette/typography

---

## Phase 2 — UI Primitives (`src/components/ui/`)
Each item: build → add to `/dev/components` preview → you review → approve.

- [ ] `Button` — variants: primary / secondary / ghost / danger; sizes sm/md/lg; `loading` state
- [ ] `Card` — padding variants, subtle shadow, optional hover lift
- [ ] `ProgressBar` — animated fill, %, color states (default/success)
- [ ] `Snackbar` + `useToast()` — success/error/info variants, auto-dismiss, bottom placement, sound hook point
- [ ] `QuizOption` — idle / selected / correct / wrong states, press animation, letter badge (A–D)
- [ ] `TextInput` + `PasswordInput` — label, hint, error message, show/hide toggle
- [ ] `Modal` + `Drawer` — accessible overlay; Drawer = mobile sidebar
- [ ] `Avatar` — initials, deterministic auto-color from name
- [ ] `Chip`/`Badge` — streak 🔥, level ⚡, topic status chips
- [ ] `Skeleton` — card/text/avatar loading placeholders
- [ ] `Confetti` — level-up celebration burst (canvas or CSS-based)
- [ ] `SectionHeader`, `StatChip`, `EmptyState` — small layout helpers
- [ ] **Review checkpoint**: full `/dev/components` gallery review

---

## Phase 3 — Utils, Services & State
- [ ] `lib/sound.ts` — sound manager: `play('correct'|'wrong'|'success'|'levelup')`, mute flag, Howler.js
- [ ] `lib/api.ts` — fetch wrapper: base URL, JWT attach/refresh, typed errors, zod response parsing
- [ ] `lib/xp.ts` — XP event constants, level thresholds (Beginner→Road Master), `xpToNextLevel()`
- [ ] `lib/streak.ts` — Kigali-timezone day helpers, streak update rules
- [ ] `lib/format.ts` — date/time formatting per locale
- [ ] `store/` slices:
  - `authSlice` — user, token, status
  - `uiSlice` — sidebar open (mobile), theme, soundOn
  - `progressSlice` — XP, level, streak (hydrated from API/mock)
- [ ] `lib/mock/` — typed mock data: topics, questions, user progress, quiz sessions (shaped like future API responses)
- [ ] `i18n/` — `en.json`, `fr.json`, `rw.json` scaffold + language switcher util
- [ ] Custom hooks: `useToast`, `useSound`, `useAuth`, `useQuizSession`
- [ ] **Review checkpoint**: sound toggle + toast demo working in preview page

---

## Phase 4 — App Shell
- [ ] `AppLayout` — left sidebar (Dashboard/Learn/Practice) + top bar
- [ ] Top bar: streak chip, level chip, sound toggle, language switcher, avatar menu
- [ ] Mobile: hamburger → `Drawer` sidebar (overlay, close on outside tap/navigate)
- [ ] `ProtectedRoute` wrapper → redirect to `/login` when unauthenticated
- [ ] Public `Landing` page (hero, value prop, Get Started / Login CTAs)
- [ ] 404 page
- [ ] **Review checkpoint**: navigate shell on desktop + mobile widths

---

## Phase 5 — Auth Pages
- [ ] `/login` — email + password, error states, forgot-password link
- [ ] `/signup` — name/email/password + confirm, validation via zod
- [ ] `/forgot-password` — email → confirmation state
- [ ] Auth slice wired to mock auth (real JWT comes with backend)
- [ ] **Review checkpoint**: full auth flow against mock

---

## Phase 6 — Dashboard (`/`)
- [ ] Greeting header (time-aware: morning/afternoon/evening)
- [ ] Stat chips row: 🔥 streak, ⚡ level + XP progress bar
- [ ] "Continue learning" card → last topic or weakest topic
- [ ] Two mode cards: Learn / Practice
- [ ] Quick stats row: topics completed, best practice score, total XP
- [ ] Empty state for brand-new users
- [ ] **Review checkpoint**: dashboard against mock data

---

## Phase 7 — Learn Mode
- [ ] `/learn` — topic card grid: icon, title, ProgressBar, %, status chip
- [ ] `/learn/:topicId` — content sections + sticky "Start Quiz" bar
- [ ] `/learn/:topicId/quiz` — 5-question flow:
  - instant check, QuizOption correct/wrong states
  - wrong → error Snackbar (correct answer + explanation) + buzz
  - complete → success Snackbar + fanfare + XP count-up
  - progress bar updates; ≥80% → completed
- [ ] Retake quiz support (best score kept)
- [ ] **Review checkpoint**: full learn flow end-to-end

---

## Phase 8 — Practice Mode
- [ ] `/practice` — setup: All Topics / pick single topic
- [ ] `/practice/session` — 20 questions, no instant feedback, question palette, refresh-resume
- [ ] `/practice/results` — score X/20, pass/fail, per-topic breakdown bars, "focus on" advice, review-wrong / retry actions
- [ ] XP + streak awarded on completion
- [ ] **Review checkpoint**: full practice flow end-to-end

---

## Phase 9 — Profile & Settings
- [ ] `/profile` — avatar, editable name, email, stats (XP/level/streak/topics)
- [ ] Practice history list (last ~10 attempts)
- [ ] Settings: language, sound, change password, logout, delete account
- [ ] **Review checkpoint**: profile page

---

## Phase 10 — PWA & Polish
- [ ] vite-plugin-pwa manifest + icons (installable)
- [ ] Offline caching strategy for questions/topics
- [ ] Loading/error/empty states audit across all screens
- [ ] Responsive pass (320px → desktop)
- [ ] Accessibility pass (focus states, aria labels, contrast)
- [ ] Remove/guard `/dev/components` from production build
- [ ] **Final review checkpoint**

---

## Phase 11 — Backend (separate roadmap)
- Express + TS API, MongoDB + Mongoose, JWT auth
- Endpoints: auth, topics, questions, progress, XP/streak, practice attempts
- Frontend swaps `lib/mock/` → real API (no component changes)