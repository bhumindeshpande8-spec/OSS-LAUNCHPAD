alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.saved_projects enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Projects are publicly readable" on public.projects;
create policy "Projects are publicly readable"
on public.projects for select
using (true);

drop policy if exists "Saved projects are owner readable" on public.saved_projects;
create policy "Saved projects are owner readable"
on public.saved_projects for select
using (auth.uid() = user_id);

drop policy if exists "Saved projects are owner insertable" on public.saved_projects;
create policy "Saved projects are owner insertable"
on public.saved_projects for insert
with check (auth.uid() = user_id);

drop policy if exists "Saved projects are owner updateable" on public.saved_projects;
create policy "Saved projects are owner updateable"
on public.saved_projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Saved projects are owner deletable" on public.saved_projects;
create policy "Saved projects are owner deletable"
on public.saved_projects for delete
using (auth.uid() = user_id);

drop policy if exists "Tasks are owner readable" on public.tasks;
create policy "Tasks are owner readable" on public.tasks for select using (auth.uid() = user_id);

drop policy if exists "Tasks are owner insertable" on public.tasks;
create policy "Tasks are owner insertable" on public.tasks for insert with check (auth.uid() = user_id);

drop policy if exists "Tasks are owner updateable" on public.tasks;
create policy "Tasks are owner updateable" on public.tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Tasks are owner deletable" on public.tasks;
create policy "Tasks are owner deletable" on public.tasks for delete using (auth.uid() = user_id);

drop policy if exists "Notes are owner readable" on public.notes;
create policy "Notes are owner readable" on public.notes for select using (auth.uid() = user_id);

drop policy if exists "Notes are owner insertable" on public.notes;
create policy "Notes are owner insertable" on public.notes for insert with check (auth.uid() = user_id);

drop policy if exists "Notes are owner updateable" on public.notes;
create policy "Notes are owner updateable" on public.notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Notes are owner deletable" on public.notes;
create policy "Notes are owner deletable" on public.notes for delete using (auth.uid() = user_id);

drop policy if exists "Activity logs are owner readable" on public.activity_logs;
create policy "Activity logs are owner readable" on public.activity_logs for select using (auth.uid() = user_id);

drop policy if exists "Activity logs are owner insertable" on public.activity_logs;
create policy "Activity logs are owner insertable" on public.activity_logs for insert with check (auth.uid() = user_id);

drop policy if exists "Activity logs are owner deletable" on public.activity_logs;
create policy "Activity logs are owner deletable" on public.activity_logs for delete using (auth.uid() = user_id);
