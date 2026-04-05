create table if not exists public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('personal', 'professional', 'academic')),
  title text not null,
  timeframe text not null,
  ai_plan jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_goals enable row level security;

create policy "user_goals_select_own" on public.user_goals
  for select using (auth.uid() = user_id);
create policy "user_goals_insert_own" on public.user_goals
  for insert with check (auth.uid() = user_id);
create policy "user_goals_update_own" on public.user_goals
  for update using (auth.uid() = user_id);
create policy "user_goals_delete_own" on public.user_goals
  for delete using (auth.uid() = user_id);
