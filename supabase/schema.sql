-- Schemat bazy danych dla Kalkulatora Finansów Rodzinnych.
-- Uruchom w Supabase Dashboard -> SQL Editor (albo przez supabase CLI: supabase db push).
--
-- Bezpieczeństwo: każda tabela ma włączone Row Level Security (RLS).
-- Polityki poniżej gwarantują, że użytkownik widzi i modyfikuje WYŁĄCZNIE
-- własne rekordy (auth.uid() = user_id). To działa na poziomie bazy danych,
-- więc nawet błąd w kodzie frontendu nie pozwoli podejrzeć cudzych danych.

-- Kategorie wydatków/przychodów (każdy użytkownik ma swoje własne)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now()
);

-- Transakcje (wpływy i wydatki budżetu domowego)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  description text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_occurred_on_idx on public.transactions(occurred_on);
create index if not exists categories_user_id_idx on public.categories(user_id);

-- Włączenie RLS
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Polityki: użytkownik widzi/edytuje tylko swoje rekordy
create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);
