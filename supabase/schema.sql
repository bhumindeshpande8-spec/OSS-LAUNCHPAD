create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,
  github_url text not null,
  website_url text,
  category text not null check (category in ('Frontend', 'Backend', 'Full Stack', 'Developer Tools', 'Education', 'AI/ML', 'Docs', 'Open Data', 'Community')),
  difficulty text not null check (difficulty in ('Beginner', 'Easy', 'Medium')),
  tech_stack text[] default '{}',
  tags text[] default '{}',
  beginner_friendly boolean default true,
  setup_complexity text default 'Medium',
  issue_availability text default 'Moderate',
  mentorship_available boolean default false,
  logo_url text,
  created_at timestamptz default now()
);

create table if not exists public.saved_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  progress_stage text not null default 'Interested' check (progress_stage in ('Interested', 'Exploring', 'Setup Done', 'Issue Selected', 'PR Opened', 'PR Merged')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, project_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  issue_url text,
  description text,
  status text not null default 'Todo' check (status in ('Todo', 'In Progress', 'Done')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  deadline date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists tasks_user_issue_url_key
  on public.tasks (user_id, issue_url)
  where issue_url is not null and issue_url <> '';

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null default 'General' check (category in ('General', 'Setup', 'Learning', 'Commands', 'PR Notes', 'Blockers')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  message text not null,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_saved_projects_updated_at on public.saved_projects;
create trigger set_saved_projects_updated_at before update on public.saved_projects
for each row execute procedure public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at before update on public.tasks
for each row execute procedure public.set_updated_at();

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at before update on public.notes
for each row execute procedure public.set_updated_at();
