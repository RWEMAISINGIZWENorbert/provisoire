# Backend Roadmap — Provisoire API

Backend for the Provisoire web app (`web/`). Feature-by-feature: build MVC backend → integrate fully into frontend → verify in browser → approve → next.

## Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: MongoDB (local) + Mongoose
- **Auth**: JWT — 15-min access token (memory) + 30-day refresh token (`httpOnly` cookie)
- **Validation**: Zod (shared schema language with frontend)
- **Security**: helmet, cors (credentials), express-rate-limit, bcrypt
- **Frontend state**: TanStack Query for server state, Redux for client/UI state

## Folder structure
server/
├── .env # PORT, MONGO_URI, JWT secrets, CLIENT_URL
├── package.json
├── tsconfig.json
└── src/
├── index.ts # bootstrap: express, cors, routes, error handler
├── config/db.ts # mongoose connect
├── models/ # User, Topic, Question, Progress
├── controllers/ # auth, content, progress
├── routes/ # /api/v1/...
├── middleware/ # auth (JWT verify), errorHandler, validate
├── services/ # xp/streak business logic (Kigali TZ)
└── seed/seed.ts # import mock content → MongoDB


## API surface (v1)

POST /api/v1/auth/register → { user, accessToken } + refresh cookie
POST /api/v1/auth/login → same
POST /api/v1/auth/refresh → rotate tokens (cookie → new accessToken)
POST /api/v1/auth/logout → clear cookie + blacklist refresh
GET /api/v1/auth/me → current user (protected)

GET /api/v1/content/topics → topics + caller's progress merged
GET /api/v1/content/topics/:id → topic + sections + its questions
GET /api/v1/content/questions → question pool (practice sampling)

GET /api/v1/progress → xp, streak, topicProgress, practiceHistory
POST /api/v1/progress/learn-quiz → { topicId, answers[] } → server computes score/XP
POST /api/v1/progress/practice → { topicId|'all', answers[] } → score/XP/history


**Core rule**: client sends *answers*, server computes *score, XP, streak, completion*. Client-side XP is dev fallback only — never trusted.

## Auth flow (critical feature)

1. Login/Register → `accessToken` (body, 15 min, Redux memory) + `refreshToken` (`httpOnly`, `Secure`, `SameSite=Lax`, 30 days)
2. `AuthGate` on app boot → `POST /auth/refresh` → `authenticated` | `unauthenticated` | `loading` (splash while checking)
3. `ProtectedRoute` — `unauthenticated`/`loading` → `/login` or splash; authenticated only inside shell
4. Login/Register pages redirect to `/dashboard` when already authenticated
5. `apiFetch` — on 401: silent refresh → retry once → logout → `/login`
6. Logout → `/auth/logout` → clear state → `/`
7. CORS: `credentials: true`, origin = Vite dev URL

## Build phases

### B1 — Server scaffold + connectivity
- `server/` skeleton: package.json, tsconfig, .env, index.ts, config/db.ts
- `/health` route, mongoose connect, helmet/cors/rate-limit
- Frontend: `.env` `VITE_API_URL`, `apiFetch` smoke test
- **Test**: `curl localhost:5000/health` + fetch from `/dev/utils`

### B2 — Auth (the critical feature)
- Models: User (name, email, passwordHash, xp, streak, lastActiveDate)
- Routes: register, login, refresh, logout, me + JWT middleware + refresh rotation
- Frontend: real `signIn`/`signUp` via apiFetch, AuthGate bootstrap, protected guards, 401 refresh-retry, session persistence across reload
- **Test**: can't reach `/dashboard` logged out; reload keeps session; logout locks app; tampered/expired token rejected

### B3 — Content
- Models: Topic (slug, icon, order, title/summary/sections LocalizedText), Question (topicId, text, options[4], correctIndex, explanation LocalizedText)
- Seed script: port `web/src/lib/mock/content.ts` → MongoDB
- Routes: topics list, topic detail, question pool
- Frontend: TanStack Query hooks replace MOCK_TOPICS/MOCK_QUESTIONS in Learn, Practice, Dashboard
- **Test**: all pages render API data in rw/fr/en; progress still merges correctly

### B4 — Progress
- Model: Progress (userId → topicProgress map, xp, streak, lastActiveDate, practiceHistory[20])
- Services: score computation, XP awards (XP_EVENTS), streak via nextStreak/todayKigali logic ported server-side
- Routes: GET progress, POST learn-quiz, POST practice
- Frontend: QuizPlayer submits answers[] instead of computing locally; store syncs from server responses; useReward becomes dev-only fallback
- **Test**: tampering client XP does nothing; streak respects Kigali midnight; history records correctly

### B5 — Profile/history + hardening
- Profile endpoint (user + stats), history already covered by progress
- Rate limiting on auth routes, input sanitization audit, error handler polish, CORS lockdown to prod origin
- **Test**: full end-to-end pass, Lighthouse re-check, `npm run build` clean on both apps

## Rules

1. One feature at a time — backend MVC → frontend integration → browser test → approval → next
2. No mock data left in production paths once its API lands
3. Server is source of truth for score/XP/streak/history
4. Every auth guard verified manually in browser before moving on
5. Kinyarwanda strings still pending native review (content task, not blocking)
6. Real Rwanda exam format + Amategeko y'umuhanda content rights — verify before launch