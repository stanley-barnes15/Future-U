-- Align database schema with application code paths

-- profiles table additions used by dashboard onboarding checks
alter table public.profiles
  add column if not exists onboarding_completed boolean default false;

-- user_habits additions used in the app
alter table public.user_habits
  add column if not exists current_age integer,
  add column if not exists monthly_income numeric,
  add column if not exists monthly_savings numeric,
  add column if not exists current_savings numeric default 0,
  add column if not exists savings_goal numeric;

-- Ensure one row per user for upsert(onConflict: 'user_id')
create unique index if not exists user_habits_user_id_unique on public.user_habits(user_id);

-- subscriptions table used for plan gating and Stripe sync
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'inactive' check (status in ('active', 'inactive', 'canceled', 'past_due')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);
create policy "subscriptions_insert_own" on public.subscriptions
  for insert with check (auth.uid() = user_id);
create policy "subscriptions_update_own" on public.subscriptions
  for update using (auth.uid() = user_id);
create policy "subscriptions_delete_own" on public.subscriptions
  for delete using (auth.uid() = user_id);
