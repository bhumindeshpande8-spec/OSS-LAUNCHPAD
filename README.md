# OSS Launchpad

OSS Launchpad is a production-style React and Supabase application for students who want a structured way to begin contributing to open source.

## Problem Statement

Beginners often lose momentum because project discovery, saved repositories, issue tracking, notes, and progress analytics are scattered across GitHub, docs, and personal tools. OSS Launchpad brings those pieces into one beginner-focused contribution workspace.

## Features

- Email and password authentication with Supabase Auth
- Protected dashboard routes with session persistence
- Discover page with searchable and filterable beginner-friendly repositories
- Saved project tracking with contribution stages
- Task and issue CRUD with status, priority, deadline, issue URL, and notes
- Project-linked learning notes with categories
- Dashboard with stats, recent projects, pending tasks, and activity feed
- Profile analytics using Recharts
- Supabase PostgreSQL schema, seed data, triggers, and RLS policies
- Responsive dashboard layout with desktop sidebar and mobile drawer

## Tech Stack

- React 18 with Vite
- React Router DOM
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Context API and custom hooks
- Recharts
- react-hot-toast
- lucide-react
- date-fns

## Architecture

```text
src/
  app/                 routing and providers
  components/          reusable UI, layout, dashboard, project, task, note components
  constants/           statuses, categories, navigation config
  context/             AuthContext and UIContext
  hooks/               reusable data and UX hooks
  layouts/             public and dashboard layouts
  lib/                 Supabase client, helpers, validators, formatters
  pages/               route-level screens
  services/            Supabase query/service layer
  styles/              Tailwind entry CSS
supabase/
  schema.sql           tables, triggers, profile creation function
  policies.sql         RLS policies
  seed.sql             realistic starter project data
```

## Database Summary

- `profiles`: app profile linked to Supabase auth users
- `projects`: public master list of beginner-friendly open source repositories
- `saved_projects`: user bookmarks and contribution stage
- `tasks`: user-owned project tasks and issue tracking
- `notes`: user-owned project learning notes
- `activity_logs`: recent activity feed events

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. In Supabase SQL editor, run:

```text
supabase/schema.sql
supabase/policies.sql
supabase/seed.sql
```

4. Enable Email/Password auth in Supabase Authentication settings.

5. Run locally:

```bash
npm run dev
```

## Future Improvements

- GitHub API import for repository metadata
- Contribution streak and activity heatmap
- Onboarding checklist for first-time users
- Team or club workspaces
- More granular recommendation scoring
