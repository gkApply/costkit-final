create extension if not exists moddatetime;

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  subscription_status text not null default 'free'
    check (subscription_status in ('free','trialing','active','past_due','canceled','incomplete')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger handle_updated_at
  before update on public.profiles
  for each row execute procedure moddatetime(updated_at);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  model text not null,
  tokens_input integer not null default 0,
  tokens_output integer not null default 0,
  estimated_cost_usd numeric(10,6) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.ai_usage enable row level security;

create policy "users can view own usage" on public.ai_usage
  for select using (auth.uid() = user_id);

create policy "users can insert own usage" on public.ai_usage
  for insert with check (auth.uid() = user_id);

create table public.stripe_events (
  id text primary key,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  email text,
  message text not null,
  page text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "anyone can insert feedback" on public.feedback
  for insert with check (true);
