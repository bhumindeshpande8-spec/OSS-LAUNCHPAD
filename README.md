# OSS Launchpad

A contribution workspace that guides students from "I want to contribute to open source" to a merged pull request.

**Live app:** [oss-launchpad.vercel.app](https://oss-launchpad.vercel.app)

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
3. **Pick an issue**: each project page lists the repository's live "good first issues" from GitHub. One click imports an issue as a task and moves the project to *Issue Selected*.
4. **Plan the work**: create tasks linked to a project (with issue URL, priority, deadline and status).
5. **Capture learning**: write notes linked to a project and categorised as Setup, Commands, PR Notes, Blockers, and so on.
6. **Review progress**: the dashboard and profile pages calculate your totals, completion rate, merged-PR count and stage distribution from your real data, alongside an activity feed of everything you did.

Every action is saved per user in PostgreSQL and protected by row-level security, so each student sees only their own workspace.

## Key Features

- **Authentication**: email/password signup and login with Supabase Auth, a persistent session and auto-refreshed tokens
- **Protected routes**: all workspace pages sit behind a `ProtectedRoute` guard; unauthenticated users are redirected to login
- **Project discovery**: debounced search (250 ms) plus difficulty, tech-stack and category filters, with an empty state and a reset action
- **GitHub issue import**: each project page shows the repository's live, open "good first issues" from the GitHub API. **Import as task** saves the project if needed, moves it forward to *Issue Selected* (never backwards), creates a task with the issue's title, link and description already filled in, and logs the action to the activity feed. See [GitHub Issue Import](#github-issue-import) for details.
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
| External API | GitHub REST Search API | Live beginner-labelled issues for each repository (no token, called from the browser) |
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
└──────────────────────────────────┬──────────────────────┬────────────────┘
                                   │ HTTPS                │ HTTPS (public, no token)
                                   │ (anon key + JWT)     │ githubService
                    ┌──────────────▼──────────────┐ ┌─────▼──────────────┐
                    │          Supabase           │ │  GitHub Search API │
                    │  Auth  │  PostgreSQL + RLS  │ │  (open issues)     │
                    └─────────────────────────────┘ └────────────────────┘
```

**Layers**

- **Pages** (`src/pages`): route-level screens. They are lazy-loaded with `React.lazy` + `Suspense` to keep the initial bundle small.
- **Hooks** (`src/hooks`): own loading/error/data state for each feature (`useProjects`, `useSavedProjects`, `useTasks`, `useNotes`, `useDashboardStats`) and expose actions to the UI.
- **Services** (`src/services`): the only layer that talks to Supabase and GitHub. Each mutation (save project, change stage, create or complete a task, import an issue) also writes an entry to `activity_logs`. `githubService` handles GitHub requests and caching; `issueImportService` runs the multi-step issue import.
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

### GitHub Issue Import

**What it does:** finding a suitable first issue is where most beginners give up. Instead of sending users off to search GitHub, each project page shows the repository's open beginner issues and lets them start working on one in a single click.

**How to use it**

1. Open any project from **Discover**.
2. Scroll to the **Good first issues** panel below the contribution workflow.
3. Click **Import as task** on an issue. The project is saved (if it wasn't already) and moved to *Issue Selected*, and the task appears under **Project tasks**, on the **Tasks** page and in the Dashboard's activity feed.
4. Imported issues show **Imported ✓**. Use **Refresh** to fetch the latest issues from GitHub straight away.

**Where the data comes from**

Issues are fetched directly from GitHub's public [Search API](https://docs.github.com/en/rest/search/search#search-issues-and-pull-requests). For a project whose `github_url` is `https://github.com/excalidraw/excalidraw`, the app sends one query:

```text
repo:excalidraw/excalidraw is:issue is:open
label:"good first issue","good-first-issue","beginner","first-timers-only","easy"
```

That returns up to 15 open issues carrying any of those labels, most recently updated first. It is the same data you would see by filtering the repository's Issues tab on github.com. Nothing is stored in the database until the user clicks **Import**.

**How fresh is it?**

| Situation | Behaviour |
|---|---|
| First visit to a project page | Fetched live from GitHub |
| Revisit within 10 minutes | Served from the cache (memory + `sessionStorage`), with no request sent |
| After 10 minutes | Fetched live again |
| User clicks **Refresh** | Skips the cache and fetches immediately |
| Browser tab closed | Cache cleared; the next visit fetches live |

So issues that are closed, assigned or newly labelled on GitHub show up within 10 minutes, or immediately after a refresh. The cache exists because GitHub allows only **10 anonymous search requests per minute** per IP address.

**Imported tasks are a snapshot.** A task keeps the issue's title and description from the moment it was imported. If the issue later changes or is closed on GitHub, the task is not updated (see [Future Improvements](#future-improvements)).

**Flow**

```text
Project page ──▶ useGoodFirstIssues ──▶ githubService.getBeginnerIssues
                   │                       ├─ parse owner/repo from github_url (rejects org-only URLs)
                   │                       ├─ return cached result if < 10 min old (memory + sessionStorage)
                   │                       ├─ skip the request if we already know the rate limit is exhausted
                   │                       └─ GitHub Search API: open issues labelled
                   │                          "good first issue" | "good-first-issue" | "beginner" | "first-timers-only" | "easy"
                   ▼
"Import as task" ──▶ issueImportService.importIssueAsTask
                       1. save project, or advance it to "Issue Selected" (never moves it backwards)
                       2. insert task  ── unique index (user_id, issue_url) rejects duplicates
                       3. log "Picked up issue #N" to activity_logs
```

**How it handles the problems this feature can run into**

| Problem | How it's handled |
|---|---|
| GitHub rate limit (10 anonymous searches/minute) | 10-minute cache per repo; the reset time from GitHub's headers is stored, and the UI shows when the limit resets instead of sending more requests |
| Exposing a GitHub token | No token is used. Any `VITE_` variable is included in the browser bundle, so a token there would be public |
| Project links to an organisation, not a repo | Detected while parsing the URL; the panel shows a clear message instead of making a broken request |
| Repos label beginner issues differently | One search request covers five common beginner labels |
| Pull requests appearing in issue results | Filtered out, and the search is limited to issues (`is:issue`) |
| Importing the same issue twice (double-click, two tabs) | A database unique index is the real guarantee; the UI also marks imported issues and disables buttons during an import |
| The project is saved but creating the task fails | The error says exactly which step succeeded, and the page re-syncs from the database |
| Slow response for an older project after navigating | The hook ignores responses from older requests |
| Network failure | Clear message and a **Retry** button |

Issues that are already assigned are still shown, but labelled *Already assigned* and listed last, because a newcomer usually can't pick them up.

### Database Design

| Table | Purpose | Key constraints |
|---|---|---|
| `profiles` | App profile for each auth user | Created automatically by the `handle_new_user` trigger when a user signs up |
| `projects` | Public catalogue of beginner-friendly repositories | `slug` unique; `category` and `difficulty` limited to allowed values by CHECK constraints |
| `saved_projects` | A user's tracked projects and their pipeline stage | `unique(user_id, project_id)` prevents duplicate saves; stage limited by a CHECK constraint |
| `tasks` | User tasks/issues linked to a project | Status and priority limited by CHECK constraints; a partial unique index on `(user_id, issue_url)` prevents duplicate issue imports |
| `notes` | User notes linked to a project | Category limited by a CHECK constraint |
| `activity_logs` | Timeline of user actions | Owned by the user |

The SQL lives in `supabase/`:

- `schema.sql`: tables, constraints and triggers (profile creation, `updated_at`)
- `policies.sql`: row-level security policies
- `seed.sql`: starter catalogue of projects
- `migrations/`: changes for databases created before `schema.sql` was updated (e.g. `001_unique_task_issue_url.sql`)

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

   If your database was created before the GitHub issue import feature, also run `supabase/migrations/001_unique_task_issue_url.sql`. It is safe to run more than once.

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

**Live application:** [oss-launchpad.vercel.app](https://oss-launchpad.vercel.app)

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
- **External data stays external until the user acts:** GitHub issues are fetched and cached on the client, not copied into the database. Only an issue the user chooses to import becomes a row, which keeps the database small and the issue list current.
- **Multi-step writes report partial failures:** the issue import touches two tables. If the project step succeeds but the task step fails, the user is told exactly what happened, and the page re-syncs instead of showing stale data.
- **Performance:** route-level code splitting, a debounced search input, and `useMemo` for filtered lists and chart data.

## Future Improvements

- A server-side proxy (e.g. a Supabase Edge Function) that holds a GitHub token, to raise the rate limit without exposing the token
- Sync imported tasks with their GitHub issue (auto-complete the task when the issue is closed)
- Contribution streaks and an activity heatmap
- Onboarding checklist for first-time users
- Team or club workspaces
- Personalised project recommendations based on the user's tech stack
