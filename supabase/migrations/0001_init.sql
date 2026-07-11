-- Finanças Pessoais — initial schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`)
-- for a fresh project. Requires the `pgcrypto` extension for gen_random_uuid(),
-- which Supabase projects already have enabled by default.

-- ========== ENUMS ==========
create type account_type as enum ('checking', 'savings', 'credit_card', 'cash', 'investment');
create type category_kind as enum ('income', 'expense');
create type transaction_type as enum ('income', 'expense', 'transfer');
create type recurrence_frequency as enum ('weekly', 'monthly', 'yearly');

-- ========== PROFILES ==========
-- One row per authenticated user, created automatically on signup.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  currency text not null default 'BRL',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are self-readable"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles are self-updatable"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========== ACCOUNTS ==========
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type account_type not null default 'checking',
  institution text,
  color text not null default '#6366f1',
  initial_balance numeric(14, 2) not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index accounts_user_id_idx on accounts (user_id);

alter table accounts enable row level security;

create policy "accounts are owner-only"
  on accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== CATEGORIES ==========
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  kind category_kind not null,
  color text not null default '#6366f1',
  icon text not null default 'tag',
  created_at timestamptz not null default now(),
  unique (user_id, name, kind)
);

create index categories_user_id_idx on categories (user_id);

alter table categories enable row level security;

create policy "categories are owner-only"
  on categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== RECURRING RULES ==========
create table recurring_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null references accounts (id) on delete cascade,
  category_id uuid references categories (id) on delete set null,
  description text not null,
  amount numeric(14, 2) not null check (amount > 0),
  type transaction_type not null default 'expense' check (type in ('income', 'expense')),
  frequency recurrence_frequency not null default 'monthly',
  day_of_month smallint check (day_of_month between 1 and 31),
  start_date date not null default current_date,
  end_date date,
  next_run_date date not null default current_date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index recurring_rules_user_id_idx on recurring_rules (user_id);

alter table recurring_rules enable row level security;

create policy "recurring rules are owner-only"
  on recurring_rules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== TRANSACTIONS ==========
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null references accounts (id) on delete cascade,
  category_id uuid references categories (id) on delete set null,
  recurring_rule_id uuid references recurring_rules (id) on delete set null,
  transfer_pair_id uuid,
  type transaction_type not null,
  amount numeric(14, 2) not null check (amount > 0),
  description text not null,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index transactions_user_id_idx on transactions (user_id);
create index transactions_account_id_idx on transactions (account_id);
create index transactions_occurred_on_idx on transactions (occurred_on);

alter table transactions enable row level security;

create policy "transactions are owner-only"
  on transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== BUDGETS ==========
-- One budget amount per category per calendar month (month stored as the 1st day of that month).
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  month date not null,
  amount numeric(14, 2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

create index budgets_user_id_month_idx on budgets (user_id, month);

alter table budgets enable row level security;

create policy "budgets are owner-only"
  on budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== GOALS ==========
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0,
  target_date date,
  color text not null default '#22c55e',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index goals_user_id_idx on goals (user_id);

alter table goals enable row level security;

create policy "goals are owner-only"
  on goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ========== GOAL CONTRIBUTIONS ==========
-- Audit trail of deposits/withdrawals applied to a goal.
create table goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(14, 2) not null,
  note text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index goal_contributions_goal_id_idx on goal_contributions (goal_id);

alter table goal_contributions enable row level security;

create policy "goal contributions are owner-only"
  on goal_contributions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Keep goals.current_amount in sync whenever a contribution is added, changed or removed.
create function public.apply_goal_contribution()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update goals set current_amount = current_amount + new.amount where id = new.goal_id;
  elsif tg_op = 'UPDATE' then
    update goals set current_amount = current_amount - old.amount + new.amount where id = new.goal_id;
  elsif tg_op = 'DELETE' then
    update goals set current_amount = current_amount - old.amount where id = old.goal_id;
  end if;
  return null;
end;
$$;

create trigger on_goal_contribution_change
  after insert or update or delete on goal_contributions
  for each row execute procedure public.apply_goal_contribution();
