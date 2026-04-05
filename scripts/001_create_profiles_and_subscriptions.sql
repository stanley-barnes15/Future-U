-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'premium')),
  stripe_customer_id text,
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_end_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create user_habits table to store user input data
create table if not exists public.user_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  age integer,
  income numeric,
  savings_rate numeric,
  exercise_frequency integer,
  sleep_hours numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_habits enable row level security;

-- RLS policies for user_habits
create policy "user_habits_select_own" on public.user_habits for select using (auth.uid() = user_id);
create policy "user_habits_insert_own" on public.user_habits for insert with check (auth.uid() = user_id);
create policy "user_habits_update_own" on public.user_habits for update using (auth.uid() = user_id);
create policy "user_habits_delete_own" on public.user_habits for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
