# 🚗 Product Vision — Rwanda Provisoire Exam Prep

## Overview

A **minimal, polished web application** that helps Rwandans prepare for and pass the
**Provisoire (provisional driving license theory exam)**.

The app takes everything tested in the real exam — *Amategeko y'umuhanda* (highway code),
road signs, traffic rules — and **divides it into simple, digestible topics**. Each topic
can be read in a few minutes, then tested with a short 5-question quiz.

The product does **two things, done excellently**:
1. **Learn** — master each exam topic at your own pace
2. **Practice** — test yourself under real-exam-like conditions and see exactly where to focus

> **Positioning**: The #1 learning platform for provisional driving license theory exam prep in Rwanda.

---

## 👥 Target Users

- Young people (18–30) getting their first driver's license
- Adults of all ages obtaining or renewing their license
- Driving schools and instructors who want a practice tool for students

---

## 🌍 Language Support

| Language | Code | Priority |
|---|---|---|
| 🇷🇼 Kinyarwanda | `rw` | Primary |
| 🇫🇷 French | `fr` | High |
| 🇬🇧 English | `en` | High |

All UI text, topic content, questions, and explanations are translated per language.

---

## 🧭 App Structure & Navigation

### Layout

- **Desktop**: Persistent **left sidebar** navigation
- **Mobile**: Hamburger menu icon toggles the sidebar as a slide-in drawer
- **Top bar** (always visible): streak 🔥, XP/level indicator, sound toggle 🔊, language switcher, profile avatar

### Sidebar Navigation — exactly 3 items

| Item | Route | Purpose |
|---|---|---|
| 📊 Dashboard | `/` | Progress overview, continue learning, quick stats |
| 📚 Learn | `/learn` | Topic list → read content → 5-question quiz |
| 🎯 Practice | `/practice` | 20-question exam-style quiz → results + weak-area advice |

Profile/settings are accessed via the avatar menu in the top bar.

---

## 📚 Mode 1: Learn

### Topic List (`/learn`)
- All exam topics displayed as **cards**, each showing:
  - Topic title + icon
  - **Progress bar + percentage** (based on quiz performance)
  - Status: not started / in progress / completed
- Topics are derived from *Amategeko y'umuhanda*, broken into **atomic, simple units** — e.g. "Warning Signs", "Speed Limits", "Right of Way", "Parking Rules", "Traffic Lights", "Safe Following Distance", "Required Documents", etc.

### Topic Detail
- Clean, readable content broken into short sections/pages
- Mobile-first typography, minimal chrome — the content is the focus

### Topic Quiz (5 questions)

Read topic → Start quiz (5 MCQs)
├─ Correct answer → option turns green, brief ✓
├─ Wrong answer → error snackbar + sound
│ └─ Snackbar shows: correct answer + 1-line explanation
└─ Quiz complete → success snackbar + sound + XP award
└─ Topic progress bar updates on the topic card

**Completion rule**: Score ≥ 80% (4/5) marks the topic as *completed*; lower scores leave it *in progress* and suggest a retake.

---

## 🎯 Mode 2: Practice

### Session Setup (`/practice`)
- User chooses scope:
  - **All Topics** — mixed questions across the whole exam
  - **Single Topic** — focused practice on one topic
- Then a **20-question quiz** in real-exam style (multiple choice)

### Results Screen
- Final score (X/20) with pass/fail indicator
- **Per-topic breakdown** — accuracy % for each topic covered
- **"Where to put effort" advice** — e.g. *"Focus on: Road Signs (50%), Speed Limits (40%)"*
- Buttons: **Review wrong answers** / **Practice again**

> Practice mode is the app's diagnostic engine: it reveals weak areas and naturally
> feeds the Learn mode (weak topics surface as suggestions on the dashboard).

---

## 🏠 Dashboard (`/`)

Minimal, single-screen overview:

| Element | Description |
|---|---|
| 👋 Greeting | "Good morning, {name}" |
| 🔥 Streak | Current daily streak count |
| ⚡ XP bar | Animated progress to next level |
| 📖 Continue card | Resume last topic or suggested weak topic |
| 🎴 Two mode cards | Large, clear entry points: **Learn** and **Practice** |
| 📊 Quick stats | Topics completed, best practice score |

---

## 🎮 Gamification (Minimal Set)

Only three mechanics — everything else is cut for v1:

| Mechanic | Rule | Where it appears |
|---|---|---|
| ⚡ **XP** | +5 per correct answer, +20 per completed topic quiz, +50 per practice session | Inside success snackbars + dashboard bar |
| 🔥 **Streak** | +1 day for completing any quiz; breaks on a missed day (Africa/Kigali timezone) | Header flame + dashboard |
| 📈 **Level** | XP thresholds → Beginner → Learner → Driver → Expert → Road Master | Dashboard XP bar only |

**Level-up**: one confetti + snackbar celebration, then nothing more.

### Explicitly deferred / cut
- ❌ Leaderboard → **v1.1** (needs user critical mass; risks looking empty)
- ❌ Badges gallery → later
- ❌ Daily challenge → Practice mode covers the daily habit
- ❌ Mascot → clean snackbar feedback replaces it

---

## 🔊 Feedback & Sound System

One unified feedback system powers the whole app:

| Event | Visual | Sound |
|---|---|---|
| Correct answer | Option → green + ✓ | Soft success chime |
| Wrong answer | Error snackbar (auto-dismiss ~4s) showing correct answer + explanation | Error buzz |
| Quiz/session complete | Success snackbar + XP count-up | Success fanfare |
| Level up | Confetti burst + snackbar | Celebration sound |

- 🔇 Sound toggle in the top bar (ON by default)
- All sounds are short, subtle, professional — not cartoonish

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript + Vite |
| **Styling** | Tailwind CSS + design tokens (CSS variables) for theming |
| **Routing** | React Router |
| **State** | Redux Toolkit (client state) + TanStack Query (server state) |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (access + refresh), email + password |
| **i18n** | react-i18next (`rw`, `fr`, `en`) |
| **PWA** | vite-plugin-pwa — installable, offline-capable |
| **Validation** | Zod (shared client/server schemas) |

### Codebase structure (feature-folder architecture)
src/
├── app/ # router, providers, layout shell (sidebar + topbar)
├── features/
│ ├── dashboard/
│ ├── learn/ # topic list, topic detail, quiz
│ ├── practice/ # setup, exam session, results
│ ├── auth/
│ └── profile/
├── components/ui/ # Button, Card, ProgressBar, Snackbar, QuizOption...
├── lib/ # api client, sounds, utils
├── i18n/ # translation files
├── store/ # Redux Toolkit slices + typed hooks

---

## 🎨 Design Direction

| Attribute | Decision |
|---|---|
| **Feel** | Minimal, clean, professional — premium ed-tech, not cartoonish |
| **Layout** | Left sidebar (desktop) / slide-in drawer (mobile) |
| **Color** | One confident accent color + neutral palette; semantic green/red only for feedback |
| **Typography** | Inter or Outfit — one family, restrained scale |
| **Cards** | Soft shadows, generous rounded corners, ample whitespace |
| **Motion** | Minimal and purposeful: snackbar slide, answer color transitions, XP count-up, confetti on level-up only |
| **Mobile-first** | Fully responsive; most users on phones |
| **Dark mode** | Supported via design tokens if time permits (not a v1 blocker) |

---

## 🔐 Authentication

- Email + password registration/login, JWT sessions
- Progress, XP, and streaks tied to the account (syncs across devices)

---

## ⚠️ Pre-Build Verifications

- [ ] Confirm the **real Rwanda provisoire exam format** (question count, duration, pass mark) — Practice mode must mirror it
- [ ] Confirm **content rights** for *Amategeko y'umuhanda* material
- [ ] Finalize the **topic breakdown** (atomic topics list) with a driving instructor/domain expert

---

## 🔮 Roadmap

| Version | Features |
|---|---|
| **v1** | Learn + Practice modes, XP, streaks, levels, snackbar feedback, i18n, PWA |
| **v1.1** | Leaderboard, weak-area recommendations on dashboard, review-wrong-answers mode |
| **v2** | Admin portal for question/content management |
| **v3** | Premium tier (advanced analytics), mobile money payments (MTN MoMo / Airtel Money) |
| **v4** | Native mobile apps |

---

## 💡 Core Value Proposition

> **"The simplest, most effective way to pass your Rwanda driving theory exam — learn each topic in minutes, practice like the real exam, and know exactly where to focus."**

---

*Document created: November 2026 — revised for minimal 2-mode product focus*