# OSS Launchpad

A contribution workspace that guides students from "I want to contribute to open source" to a merged pull request.

**Live app:** _https://your-deployment-url.vercel.app_ <!-- TODO: replace with the deployed URL -->

## Problem Statement

Students who want to start contributing to open source usually stall before they ever open a pull request. The information they need is scattered: they find repositories on GitHub, read setup instructions in project docs, track issues in browser tabs, and keep notes in random files. There is no single place that shows which projects they are working on, how far along each one is, and what to do next, so momentum is lost after the first attempt.

## Target Users

- College students and early-career developers making their first open source contributions
- Beginners who need help choosing approachable, beginner-friendly repositories
- Students working on several repositories at once who need to track progress and to-dos in one place

## Solution

OSS Launchpad combines the full beginner contribution journey into one authenticated workspace:

1. **Discover**: browse a curated catalogue of beginner-friendly repositories and filter it by difficulty, tech stack and category.
2. **Save and track**: save a repository to your workspace and move it through a six-stage contribution pipeline:
   `Interested → Exploring → Setup Done → Issue Selected → PR Opened → PR Merged`
3. **Plan the work**: create tasks linked to a project (with issue URL, priority, deadline and status).
4. **Capture learning**: write notes linked to a project and categorised as Setup, Commands, PR Notes, Blockers, and so on.
5. **Review progress**: the dashboard and profile pages calculate your totals, completion rate, merged-PR count and stage distribution from your real data, alongside an activity feed of everything you did.

Every action is saved per user in PostgreSQL and protected by row-level security, so each student sees only their own workspace.

## Key Features

- **Authentication**: email/password signup and login with Supabase Auth, a persistent session and auto-refreshed tokens
- **Protected routes**: all workspace pages sit behind a `ProtectedRoute` guard; unauthenticated users are redirected to login
- **Project discovery**: debounced search (250 ms) plus difficulty, tech-stack and category filters, with an empty state and a reset action
- **Contribution pipeline**: save or unsave projects and update each one's stage; each stage change is recorded in the activity feed
- **Task tracking**: create, edit, filter and delete tasks with status (`Todo / In Progress / Done`), priority, deadline and issue link; completing a task is logged as activity
- **Notes**: categorised notes linked to a project, with create, edit and delete
- **Dashboard**: stat cards, recent projects, pending tasks and recent activity
- **Profile analytics**: Recharts charts for stage distribution, task status, project difficulty and note categories
- **UX states**: loading spinners and skeletons, empty states, toast notifications for success and failure, confirmation dialogs for destructive actions, and form validation errors
- **Responsive layout**: desktop sidebar and mobile navigation drawer

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Component model and a fast dev/build tool |
| Routing | React Router DOM v6 | Nested layouts, protected routes, lazy-loaded pages |
| Styling | Tailwind CSS | Consistent, responsive UI without a component library |
| Backend / Auth | Supabase Auth | Managed authentication and secure password storage |
| Database | Supabase PostgreSQL | Relational data with constraints, triggers and row-level security |
| State | Context API + custom hooks | Auth/UI state is global; data state stays inside each feature's hook |
| Charts | Recharts | Analytics on the profile page |
| Utilities | react-hot-toast, lucide-react, date-fns, clsx | Notifications, icons, date formatting, class names |

## Architecture

```text
┌──────────────────────────── React SPA (Vite) ────────────────────────────┐
│                                                                          │
│  pages/  ──uses──▶  hooks/  ──calls──▶  services/  ──▶  lib/supabaseClient│
│  (route screens)    (useTasks,          (taskService,                    │
│                      useProjects, …)     savedProjectService, …)         │
│        ▲                                                                 │
│  context/AuthContext (session, profile, login/signup/logout)             │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │ HTTPS (anon key + user JWT)
                    ┌──────────────▼──────────────┐
                    │          Supabase           │
                    │  Auth  │  PostgreSQL + RLS  │
                    └─────────────────────────────┘
```

**Layers**

- **Pages** (`src/pages`): route-level screens. They are lazy-loaded with `React.lazy` + `Suspense` to keep the initial bundle small.
- **Hooks** (`src/hooks`): own loading/error/data state for each feature (`useProjects`, `useSavedProjects`, `useTasks`, `useNotes`, `useDashboardStats`) and expose actions to the UI.
- **Services** (`src/services`): the only layer that talks to Supabase. Each mutation (save project, change stage, create or complete a task) also writes an entry to `activity_logs`.
- **Context** (`src/context`): `AuthContext` manages the session and profile; `UIContext` manages UI state such as the mobile nav.
- **Lib** (`src/lib`): the Supabase client (which validates the config and shows a clear error if env vars are missing), validators, formatters and helpers.
- **Components** (`src/components`): reusable UI primitives and feature components.

**Request flow example: moving a project to "PR Opened"**

```text
User picks stage ──▶ ProgressStageSelector ──▶ useSavedProjects.updateStage
  ──▶ savedProjectService.updateProgressStage
        ├─ UPDATE saved_projects (RLS checks auth.uid() = user_id)
        ├─ trigger sets updated_at
        └─ INSERT activity_logs ("Moved X to PR Opened")
  ──▶ hook updates local state ──▶ toast confirms ──▶ dashboard/analytics show the new stage
```

### Database Design

| Table | Purpose | Key constraints |
|---|---|---|
| `profiles` | App profile for each auth user | Created automatically by the `handle_new_user` trigger when a user signs up |
| `projects` | Public catalogue of beginner-friendly repositories | `slug` unique; `category` and `difficulty` limited to allowed values by CHECK constraints |
| `saved_projects` | A user's tracked projects and their pipeline stage | `unique(user_id, project_id)` prevents duplicate saves; stage limited by a CHECK constraint |
| `tasks` | User tasks/issues linked to a project | Status and priority limited by CHECK constraints |
| `notes` | User notes linked to a project | Category limited by a CHECK constraint |
| `activity_logs` | Timeline of user actions | Owned by the user |

The SQL lives in `supabase/`:

- `schema.sql`: tables, constraints and triggers (profile creation, `updated_at`)
- `policies.sql`: row-level security policies
- `seed.sql`: starter catalogue of projects

### Security

- **Row-level security** is enabled on every table. Users can read and write only rows where `auth.uid() = user_id`; the project catalogue is read-only for everyone.
- Passwords are handled entirely by Supabase Auth and are never stored by the app.
- Only the **public anon key** is used in the frontend. Data access is limited by RLS, and no service-role key is used anywhere.
- Secrets are kept in `.env`, which is gitignored.
- Forms validate input on the client (email format, password length, matching passwords, required fields), and the database enforces the CHECK constraints.

## Local Setup

**Prerequisites:** Node.js 18+ and a free [Supabase](https://supabase.com) project.

1. Clone and install:

   ```bash
   git clone https://github.com/bhumindeshpande8-spec/OSS-LAUNCHPAD.git
   cd OSS-LAUNCHPAD
   npm install
   ```

2. Set up the database. In the Supabase dashboard, open **SQL Editor** and run these files in order:

   ```text
   supabase/schema.sql
   supabase/policies.sql
   supabase/seed.sql
   ```

3. In **Authentication → Providers**, make sure **Email** is enabled. For quicker local testing, you can turn off "Confirm email".

4. Create a `.env` file (see [Environment Variables](#environment-variables)):

   ```bash
   cp .env.example .env
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:5173, sign up, and start on the Discover page.

**Other scripts**

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Environment Variables

| Variable | Description | Where to find it |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL, e.g. `https://abcd1234.supabase.co` | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | The public anon key (safe for the browser because RLS limits access) | Supabase → Project Settings → API |

Template (`.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> Never commit `.env` or a Supabase **service-role** key. If the variables are missing or still contain placeholder values, the app shows a clear configuration error instead of failing silently.

## Deployment

**Live application:** _https://your-deployment-url.vercel.app_ <!-- TODO: replace with the deployed URL -->

The app is a static SPA deployed on **Vercel**, with Supabase as the hosted backend.

To deploy your own copy:

1. Import the GitHub repository into Vercel (framework preset: **Vite**; build command `npm run build`; output directory `dist`).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Project Settings → Environment Variables**.
3. Deploy. `vercel.json` rewrites every route to `index.html` so client-side routes such as `/dashboard` work when the page is refreshed.
4. In Supabase, go to **Authentication → URL Configuration** and set the **Site URL** to your Vercel domain (and add it to the redirect URLs).

## Engineering Decisions

- **Service layer separated from the UI:** all Supabase queries are in `src/services`, so pages and components never build queries themselves.
- **Hooks own async state:** each feature hook manages `loading`, `error` and data, so every page handles loading, error and empty states the same way.
- **The database is the source of truth for integrity:** duplicate saves, invalid stages and invalid statuses are rejected by Postgres constraints, not only by the UI.
- **Security in the database, not just the frontend:** even if someone calls the API directly with their own JWT, RLS stops them from reading or changing other users' data.
- **Analytics are derived, not stored:** dashboard totals and charts are calculated from the user's live rows (`analyticsService`), so they never drift out of sync.
- **Performance:** route-level code splitting, a debounced search input, and `useMemo` for filtered lists and chart data.

## Future Improvements

- Import repository metadata and "good first issue" labels from the GitHub API
- Contribution streaks and an activity heatmap
- Onboarding checklist for first-time users
- Team or club workspaces
- Personalised project recommendations based on the user's tech stack
