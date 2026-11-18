# 🚗 Features, User Workflows & UI/UX Direction
 
> **Product scope: 2 modes** — Learn and Practice. Minimal, polished, professional.
> Navigation: left sidebar (Dashboard / Learn / Practice) on desktop; hamburger-toggled drawer on mobile.
---

## 1. 🧭 User Flows

### 1.1 First Visit (Unauthenticated)
```
Visit App URL
    └─► Stunning Landing Page
            ├─ App description + feature highlights
            ├─ Hero section with mascot character
            └─ CTA Buttons: [Get Started] / [Login]
```

### 1.2 Registration Flow
```
Click "Get Started"
    └─► Sign Up Page
            ├─ Fields: Full Name, Email, Password
            ├─ Submit → JWT token issued
            └─► Redirect to Dashboard (Home)
```

### 1.3 Login Flow
```
Click "Login"
    └─► Login Page
            ├─ Fields: Email, Password
            ├─ Forgot Password link
            └─► Redirect to Dashboard (Home)
```

---

## 2. 🖥️ App Shell & Navigation

### Layout
- **Desktop**: fixed **left sidebar** (~240px) with nav items: 📊 Dashboard, 📚 Learn, 🎯 Practice
- **Mobile**: sidebar hidden; **hamburger icon** in top bar opens it as a slide-in drawer (overlay + close on outside tap)
- Active nav item highlighted with accent color

### Top Bar (all screens)
| Element | Behavior |
|---|---|
| 🔥 Streak | Flame icon + count; pulses subtly when streak increments |
| ⚡ XP | Compact level chip (e.g. "Lv.3 · 340 XP") |
| 🔊 Sound toggle | Mute/unmute all feedback sounds |
| 🌐 Language | Switcher: Kinyarwanda / French / English |
| 👤 Avatar | Menu: Profile, Settings, Logout |

---

## 3. 📊 Dashboard (`/`)

Single clean screen:

| Element | Description |
|---|---|
| 👋 Greeting | "Good morning, {name}" + date |
| 🔥 Streak + ⚡ Level | Two compact stat chips |
| 📖 Continue card | "Continue: {last topic}" or "Suggested: {weakest topic}" |
| 🎴 Mode cards | Two large cards: **Learn** (📚) and **Practice** (🎯) |
| 📊 Stats row | Topics completed · Best practice score · Total XP |

**Empty state** (brand-new user): friendly prompt → "Start with your first topic" CTA into Learn.

---

## 4. 📚 Learn Mode

### 4.1 Topic List (`/learn`)
- Grid/list of **topic cards**: icon, title, progress bar, percentage
- Sort: in-progress first, then not-started (or manual curriculum order — decide during content build)
- Each card status: `Not started` / `In progress` / `Completed` (≥80% on quiz)

### 4.2 Topic Detail
- Title + progress indicator
- Content split into short readable **sections** (scrollable, minimal styling)
- Sticky bottom bar: **"Start Quiz"** button (5 questions)

### 4.3 Topic Quiz Flow
Start Quiz → Question screen (one at a time, 5 total)
├─ Select answer → immediate check
│ ├─ Correct → option turns green + ✓ + soft chime
│ └─ Wrong → error snackbar + buzz
│ └─ Snackbar content: correct answer + 1-line explanation
│ (snackbar persists ~4s or until dismissed)
├─ Next question → ... repeat ×5
└─ Results → success snackbar + fanfare + XP
├─ "4/5 correct · +20 XP"
└─ Topic progress updates; ≥80% → topic marked completed


**Rules**
- Answers are checked immediately (learn mode = learning, not testing)
- User can retry the quiz anytime; best score is kept
- Quiz questions are drawn from the topic's question pool; if pool < 5, cycle/repeat is allowed but flagged for content team

### 4.4 Topic Progress Model
topic_progress = {
bestScore: number, // best quiz score %
attempts: number,
completed: boolean, // bestScore >= 80
lastStudiedAt: Date
}


---

## 5. 🎯 Practice Mode

### 5.1 Setup Screen (`/practice`)
Two clear choices:
- **All Topics** — 20 mixed questions across the full exam
- **Pick a Topic** — same topic list as Learn, single-select → 20 questions from that topic's pool (cycles if needed)

Optional (v1.1): timed mode toggle.

### 5.2 Quiz Session
20 questions, one at a time
├─ No instant feedback (exam simulation)
├─ Question palette/grid to jump between questions (optional but recommended)
├─ Answers saved locally per session; refresh resumes session
└─ Submit → Results scree


### 5.3 Results Screen
| Element | Description |
|---|---|
| Score | X/20 with pass/fail badge |
| Per-topic breakdown | Accuracy % per topic covered |
| 💡 Effort advice | "Focus on: Road Signs (50%), Speed Limits (40%)" — generated from wrong answers |
| Actions | **Review wrong answers** / **Practice again** / **Back to Dashboard** |

- XP: +5 per correct answer, +50 session bonus (higher if pass threshold met)
- Attempt saved to profile history (date, score, scope)

---

## 6. 🔔 Snackbar / Toast System (Global)

One system, used everywhere:
useToast() → renders Snackbar
├─ Position: bottom-center (mobile) / bottom-right (desktop)
├─ Auto-dismiss: ~4s (error toasts: until dismissed or 6s)
├─ Variants: success (green) / error (red) / info (neutral)
└─ Sound: fires matching feedback sound (if sound ON)


| Trigger | Variant | Content | Sound |
|---|---|---|---|
| Correct answer (learn quiz) | inline state | — | chime |
| Wrong answer (learn quiz) | error | Correct answer + explanation | buzz |
| Quiz complete | success | "4/5 · +20 XP" | fanfare |
| Practice complete | success | score + XP | fanfare |
| Level up | success + confetti | "Level Up! You're now a Driver" | celebration |
| Network/server error | error | "Something went wrong — try again" | — |

---

## 7. 🎮 Progression System

### 7.1 XP Events
| Action | XP |
|---|---|
| Correct answer (learn quiz) | +5 |
| Topic quiz completed | +20 bonus |
| Practice: per correct answer | +5 |
| Practice session completed | +50 |
| Practice pass threshold | +25 bonus |

XP is awarded server-side only (never trusted from client).

### 7.2 Streaks
- Increments when user completes **any** quiz (learn or practice) on a given day
- Resets if a day is missed; evaluated in **Africa/Kigali** timezone
- Stored server-side; displayed in header + dashboard

### 7.3 Levels
| Level | Name | Cumulative XP |
|---|---|---|
| 1 | Beginner | 0 |
| 2 | Learner | 100 |
| 3 | Driver | 300 |
| 4 | Expert | 700 |
| 5 | Road Master | 1500 |

Level-up triggers: XP bar animation → confetti → snackbar. Nothing more.

---

## 8. 👤 Profile (via avatar menu)

Minimal profile page:
- Avatar (initials, auto-colored), display name (editable), email
- Stats: total XP, current level, current/best streak, topics completed
- Practice history: last ~10 attempts (date, scope, score, pass/fail)
- Settings: language, sound toggle, change password, logout, delete account

---

## 9. 🌍 Language & Content

- Switcher in top bar; persists per user preference
- Content model stores all text per language:
  ```
  Topic: { title: {rw, fr, en}, content: {rw, fr, en}[] }
  Question: { text, options[4], correctIndex, explanation } × {rw, fr, en}
  ```
- Fallback: if a translation is missing, fall back to English and log for content team

---

## 10. 📴 States, Edge Cases & Non-Functional

| Scenario | Behavior |
|---|---|
| First launch | Landing → signup → dashboard empty state |
| No topics in a category | Empty-state illustration + "Content coming soon" |
| Quiz pool < 5 questions | Cycle questions (flagged in admin/content review) |
| Practice session refresh | Resume from saved session state |
| Timer/network loss mid-quiz | Local draft preserved; sync on reconnect |
| Sound files fail to load | Silent fail — app never breaks over audio |
| Slow connection | Skeleton screens on lists; questions cached (PWA) for offline practice |
| Session expiry (JWT) | Silent refresh; on failure → login redirect with return URL |

---

## 11. 🎨 UI/UX Direction

### Principles
1. **Minimal** — every element earns its place; no decorative clutter
2. **Clean** — white space, consistent spacing scale, soft shadows
3. **Professional** — restrained color, one accent, semantic colors only for feedback
4. **Engaging** — feedback is instant and satisfying (snackbar + sound + micro-motion)

### Design Tokens
- Single accent color (final pick during build — e.g. deep green or blue)
- Semantic: success green, error red, neutral grays
- Radius: 12–16px cards; spacing on 4px/8px scale
- Font: Inter or Outfit
- Dark mode: token-based, post-v1 if needed

### Key Screens Polish
- **Learn topic list**: progress bars animate on load; completed topics show checkmark
- **Quiz options**: press scale effect; correct = green fill transition; wrong = red + shake
- **Snackbar**: slide-up entrance, icon + text + optional action
- **Results screen**: score counts up animated; topic breakdown as mini progress bars
- **Confetti**: only on level-up — the single celebration moment

---

## 12. 🧪 Verification Checklist (Pre-Build)

- [ ] Official Rwanda provisoire exam format confirmed (count/time/pass mark)
- [ ] Practice mode question count/duration mirrors it (or is clearly labeled "practice")
- [ ] Topic list finalized with domain expert (~15–25 atomic topics)
- [ ] Question bank minimum: ≥10 questions per topic (enables 5-q learn quizzes + 20-q practice without heavy repetition)
- [ ] Sound assets sourced (short chime/buzz/fanfare — royalty-free)
- [ ] Translations for all three languages planned per content batch

---

*Document created: November 2026 — revised for minimal 2-mode product*