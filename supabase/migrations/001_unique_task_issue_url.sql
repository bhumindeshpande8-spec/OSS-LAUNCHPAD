-- Prevents the same GitHub issue from being imported as a task twice by one user,
-- even across double-clicks or multiple tabs. Manual tasks without an issue URL are unaffected.
create unique index if not exists tasks_user_issue_url_key
  on public.tasks (user_id, issue_url)
  where issue_url is not null and issue_url <> '';
