# Student Learning Dashboard

A full-stack learning dashboard built with **React (Vite) + Tailwind CSS** on the frontend
and **Node.js + Express** on the backend, using JSON files for data storage and JWT for
authentication.

This project is being built **step by step**. Each step is completed and verified before
the next one begins.

---

## ✅ Step 1 — Project Setup (COMPLETE)

### What was built

**Backend (`/server`)**
- Express app scaffolded with a clean separation between `app.js` (Express config) and
  `server.js` (process entry point) — this makes the app testable later.
- Folder structure created: `controllers`, `routes`, `middleware`, `services`, `data`,
  `config`, `utils`.
- `config/config.js` centralizes all environment variable access.
- `.env` / `.env.example` created with `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.
- Global middleware wired up: `cors`, `express.json`, `morgan` (dev logging).
- `GET /api/health` route added and verified (returns 200 with a JSON payload).
- Centralized error handling: `middleware/errorHandler.js` exports:
  - `asyncHandler` — wraps async controllers so you never write try/catch boilerplate again.
  - `notFound` — 404 handler for unmatched routes.
  - `errorHandler` — final error formatter, understands JWT errors (`TokenExpiredError`,
    `JsonWebTokenError`) and returns friendly messages.
- `utils/apiResponse.js` — `ApiError` class + `success`/`error` helpers for consistent
  JSON response shapes across every endpoint we build going forward.

**Note on dependencies:** the spec asked for `bcrypt`, but this environment doesn't have
native build tools readily available for it, so I installed **`bcryptjs`** instead — it's
a pure-JS, drop-in-compatible replacement with the identical API (`hash`, `compare`, etc.),
so nothing about the authentication design changes.

**Frontend (`/client`)**
- Scaffolded with Vite's official `react` template.
- Installed: `react-router-dom`, `axios`, `react-hook-form`, `react-icons`.
- Installed **Tailwind CSS v4** using the official `@tailwindcss/vite` plugin (v4 no longer
  uses a `tailwind.config.js` + `postcss.config.js` pair — theme tokens are defined directly
  in CSS via `@theme`, which is what `src/index.css` does).
- Defined a medical/clinical color palette (`brand` = teal, `accent` = sky blue) as CSS
  theme tokens, so components can use classes like `bg-brand-600` or `text-accent-500`.
- Folder structure created: `components`, `layouts`, `pages`, `routes`, `services`, `hooks`,
  `context`, `utils`.
- `main.jsx` wraps the app in `BrowserRouter`.
- Dev proxy configured in `vite.config.js` so frontend calls to `/api/*` are forwarded to
  `http://localhost:5000` during development — no CORS headaches, no hardcoded base URLs.
- Verified: `npm run build` succeeds, `npm run dev` serves on port 5173 with HTTP 200.

### Folder structure so far

```
student-learning-dashboard/
├── server/
│   ├── config/
│   │   └── config.js
│   ├── controllers/        (empty — next step)
│   ├── routes/             (empty — next step)
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── services/           (empty — next step)
│   ├── data/               (empty — JSON "database" files go here)
│   ├── utils/
│   │   └── apiResponse.js
│   ├── app.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── client/
    ├── src/
    │   ├── assets/
    │   ├── components/     (empty — next step)
    │   ├── layouts/        (empty)
    │   ├── pages/           (empty)
    │   ├── routes/          (empty)
    │   ├── services/        (empty — Axios instance goes here)
    │   ├── hooks/           (empty)
    │   ├── context/         (empty — AuthContext goes here)
    │   ├── App.jsx          (placeholder, verifies pipeline)
    │   ├── main.jsx
    │   └── index.css        (Tailwind + medical theme tokens)
    ├── vite.config.js
    ├── .gitignore
    └── package.json
```

### How to run what exists so far

**Backend**
```bash
cd server
npm install
npm run dev        # requires nodemon (installed as devDependency)
# or: npm start
```
Visit `http://localhost:5000/api/health` — should return a JSON success message.

**Frontend**
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173` — should show the placeholder "Student Learning Dashboard"
scaffold confirmation screen.

---

## ✅ Step 2 — Authentication Module (COMPLETE)

### Demo credentials

| Email | Password |
|---|---|
| ananya.sharma@student.edu | Student@123 |
| rohan.mehta@student.edu | Student@456 |
| priya.nair@student.edu | Student@789 |

### What was built

**Backend**
- `data/students.json` — seed data, passwords hashed with `bcryptjs` (10 salt rounds).
- `utils/jsonDb.js` — shared `readJson`/`writeJson` helper for all JSON-backed modules.
- `services/auth.service.js` — business logic: find-by-email/id, sanitize (strips password
  before sending to client), verify password, generate JWT.
- `middleware/validators/authValidator.js` — validates `email` (required + format) and
  `password` (required) before the request reaches the controller.
- `middleware/auth.middleware.js` — `protect` middleware: reads `Authorization: Bearer <token>`,
  verifies it, attaches `req.user`. Expired/invalid tokens are forwarded to the central error
  handler, which returns friendly messages ("Token Expired", "Unauthorized Access").
- `controllers/auth.controller.js` — thin controllers for `login`, `logout`, `getProfile`,
  wrapped in `asyncHandler` so there's no manual try/catch.
- `routes/auth.routes.js` — `POST /api/login` (public), `POST /api/logout` (protected),
  `GET /api/profile` (protected). Mounted in `app.js`.

**Verified via curl (9 scenarios, all passing):** valid login, wrong password, missing
fields, invalid email format, profile without token, profile with valid token, profile with
invalid token, logout with token, logout without token.

**Frontend**
- `utils/constants.js` / `utils/tokenStorage.js` — storage keys + a helper that puts the
  token in `localStorage` when "Remember Me" is checked, or `sessionStorage` otherwise.
- `services/api.js` — single Axios instance. Request interceptor attaches the JWT
  automatically; response interceptor catches global 401s, clears the session, and fires a
  browser event the AuthContext listens for (so React state updates too, not just storage).
- `services/auth.service.js` — `login`, `logout`, `getProfile` API wrappers.
- `context/AuthContext.jsx` — the auth source of truth: `user`, `isAuthenticated`, `loading`
  (true while checking an existing token on refresh), `login()`, `logout()`.
- `context/ToastContext.jsx` + `components/ToastContainer.jsx` — global toast notifications
  (used for login errors/success, logout confirmation, and reusable for every future step).
- `components/ProtectedRoute.jsx` — redirects to `/login` if not authenticated; shows a
  full-screen loader while the initial session check runs.
- `components/Loader.jsx` — reusable spinner.
- `pages/Login.jsx` — logo placeholder, title, email + password fields (React Hook Form
  validation, inline error messages), show/hide password toggle, Remember Me checkbox,
  Forgot Password link (UI only, shows a toast), submit button with loading state, and a
  server-error banner for 401/400/network failures.
- `pages/Dashboard.jsx` — placeholder page (full dashboard is next step) that proves the
  whole flow works: shows the logged-in student's name/course/semester and a working
  Logout button.
- `pages/NotFound.jsx` — 404 page.
- `routes/AppRoutes.jsx` — `/login` public, `/dashboard` behind `ProtectedRoute`, `/` redirects
  to `/dashboard`, unknown paths hit `NotFound`.
- `App.jsx` — composition root: wraps everything in `ToastProvider` → `AuthProvider` →
  `AppRoutes` + `ToastContainer`.

**Verified:** `npm run build` succeeds with no errors. Full login → profile → logout flow
tested through the actual Vite dev proxy (not just the raw backend), confirming the frontend
and backend talk to each other correctly.

### How to try it

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev
```

Visit `http://localhost:5173` → redirects to `/login` → sign in with a demo credential above
→ redirects to `/dashboard` → click Logout → back to `/login`. Try wrong credentials, empty
fields, and refreshing the page while logged in (session should persist and re-hydrate).

---

## ✅ Step 3 — Dashboard Module (COMPLETE)

### What was built

**Backend**
- `data/subjects.json` — global subject catalog (Anatomy, Physiology, Biochemistry,
  Microbiology), each with a `progressByStudent` map so per-student progress lives
  alongside the subject rather than needing a join. This same file will power the
  Subject Module (next step) — `GET /api/subjects` and `/api/subjects/:id`.
- `data/assignments.json` / `data/quizScores.json` — seeded, keyed by `studentId`.
- `data/dashboard.json` — per-student aggregate snapshot: `continueLearning` pointer
  (which subject/chapter/topic they were last on), `overallProgress`, and `quickStats`.
- `services/dashboard.service.js` — assembles the full dashboard payload:
  - `getRecentSubjects` — merges the subject catalog with the student's progress, sorted
    by progress descending.
  - `getUpcomingAssignments` — filters to `status: pending` for this student, sorted by
    nearest due date, capped at 4.
  - `getRecentQuizScores` — filters to this student, sorted by most recent date, capped at 4.
  - `getDashboardData` — combines all of the above plus the summary record into one object.
- `controllers/dashboard.controller.js` + `routes/dashboard.routes.js` — `GET /api/dashboard`,
  protected by the same `protect` JWT middleware from Step 2.

**Verified via curl:** dashboard rejected without a token; with a token, returns the fully
assembled payload; confirmed two different students (Ananya, Rohan) get correctly distinct
data — proving the per-student filtering actually works, not just returning the same JSON
for everyone.

**Frontend**
- `services/dashboard.service.js` — calls `GET /api/dashboard`.
- `components/ProgressBar.jsx` — reusable bar, color shifts amber → teal → green as percent
  climbs. Will be reused in Chapters/Topics later.
- `components/DashboardCard.jsx` — generic icon + value + label tile (Quick Statistics grid).
- `components/ProgressCard.jsx` — circular SVG progress ring for Overall Progress, with a
  topics/chapters/subjects breakdown alongside it.
- `components/SubjectCard.jsx` — subject tile with color-coded icon, progress bar, and a
  Continue button. Built now but designed for reuse on the full Subjects page next step.
- `components/ContinueLearningCard.jsx` — gradient hero card showing the in-progress topic
  with a resume button.
- `components/AssignmentItem.jsx` — list row with due date, flags anything due within 2 days
  in red.
- `components/QuizScoreItem.jsx` — list row with a color-coded score badge (green/teal/amber/red
  based on percentage).
- `pages/Dashboard.jsx` — replaced the Step 2 placeholder with the real thing: welcome banner,
  Continue Learning + Overall Progress side-by-side, Quick Statistics grid, Recent Subjects
  grid, and Upcoming Assignments + Recent Quiz Scores side-by-side. Fetches on mount, shows a
  full-screen loader while fetching, and a graceful error banner if the request fails.

**Note:** Subjects/Chapters/Topics/Learning Unit pages don't exist yet (they're the next
steps), so the "Continue" and "Resume Topic" buttons currently show a toast — "Subjects
module is coming in the next step!" — instead of navigating to a page that isn't built. This
avoids shipping dead links; they'll be wired to real navigation once those routes exist.

**Also note:** I did not build the full Navbar/Sidebar modules yet since those are their own
step later in the spec — for now the Dashboard has a minimal top bar with the logo and
Logout button so the page isn't empty at the top.

**Verified:** `npm run build` succeeds. Full stack tested together — logged in as two
different students through the live dev proxy and confirmed the dashboard renders correctly
distinct data for each (different overall progress %, different continue-learning topic,
different assignment/quiz counts).

### How to try it

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev
```

Log in with any demo credential from Step 2, and try logging in as different students
(ananya.sharma / rohan.mehta / priya.nair) to see the dashboard change per student.

---

## ✅ Step 4 — Subject Module (COMPLETE)

### What was built

**Backend**
- `services/subject.service.js` — reuses the same `subjects.json` catalog as the Dashboard
  module, so progress data is always consistent between the two:
  - `getAllSubjects(studentId)` — full catalog, each annotated with that student's progress.
  - `getSubjectById(subjectId, studentId)` — single subject, or `null` if it doesn't exist.
- `controllers/subject.controller.js` — `getSubjects`, `getSubjectById` (throws a 404
  `ApiError` when the id doesn't match any subject).
- `routes/subject.routes.js` — `GET /api/subjects`, `GET /api/subjects/:id`, both protected
  by the `protect` JWT middleware. Mounted in `app.js`.

**Verified via curl:** rejected without a token; with a token, `GET /api/subjects` returns
all 4 subjects with this student's progress; `GET /api/subjects/SUB002` returns just that
one; `GET /api/subjects/NONEXISTENT` returns a proper 404 with a clear message.

**Frontend**
- `services/subject.service.js` — `getSubjects()`, `getSubjectById(id)`.
- `layouts/MainLayout.jsx` — **new**: a shared header (logo + Dashboard/Subjects nav links +
  Logout) rendered once via a layout route, instead of being duplicated in every page. This
  also removed the header code that used to live directly inside `Dashboard.jsx`.
- `pages/Subjects.jsx` — grid of all subjects using the existing `SubjectCard` component
  (built back in Step 3), each "Continue" button navigating to `/subjects/:id`.
- `pages/SubjectDetail.jsx` — subject header (name, description, progress bar, chapter
  count) plus a clearly-labeled placeholder where the Chapters list will render once the
  Chapter Module (next step) is built. Handles the "subject not found" case with a 404-style
  message and a link back to `/subjects`.
- `routes/AppRoutes.jsx` — restructured so all authenticated pages nest inside `MainLayout`,
  which itself nests inside `ProtectedRoute`. Added `/subjects` and `/subjects/:id` routes.
- **Dashboard navigation is now real**, not placeholder toasts:
  - "View All" (Recent Subjects) → `/subjects`
  - Each Subject Card's "Continue" → `/subjects/:id`
  - "Resume Topic" (Continue Learning card) → `/subjects/:id` for that topic's subject
    (this will point at the specific topic/learning-unit once that module exists)

**Verified:** `npm run build` succeeds. Full stack tested together through the live dev
proxy — confirmed `/api/subjects`, `/api/subjects/:id`, and all three frontend routes
(`/dashboard`, `/subjects`, `/subjects/SUB001`) return HTTP 200 and correct data.

### How to try it

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev
```

Log in, then click "View All" or any subject's "Continue" button on the Dashboard — you'll
land on `/subjects` or `/subjects/:id` respectively, both fully working pages now.

---

## ⏭️ Next Step — Chapter Module

Next I'll build `GET /api/subjects/:id/chapters`, a `chapters.json` data file, `ChapterCard`
component, and wire the Chapters section inside `SubjectDetail.jsx` (currently a placeholder)
to show the real chapter list — clicking a chapter will open its Topics.
