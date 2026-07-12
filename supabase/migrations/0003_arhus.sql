-- Arhus — furtos e roubos com mapa interativo (comunitário e público).
-- Run this once in the Supabase SQL editor.

create type occurrence_type as enum ('furto', 'roubo', 'outro');

create table occurrences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type occurrence_type not null default 'furto',
  description text not null,
  latitude double precision not null,
  longitude double precision not null,
  address text,
  occurred_at timestamptz not null default now(),
  photo_url text,
  created_at timestamptz not null default now()
);

create index occurrences_user_id_idx on occurrences (user_id);
create index occurrences_occurred_at_idx on occurrences (occurred_at);

alter table occurrences enable row level security;

-- The whole point of Arhus is a shared community map, so anyone can read it —
-- reporting, editing and deleting stay restricted to the author.
create policy "occurrences are publicly readable"
  on occurrences for select
  using (true);

create policy "occurrences are insertable by their author"
  on occurrences for insert
  with check (auth.uid() = user_id);

create policy "occurrences are owner-updatable"
  on occurrences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "occurrences are owner-deletable"
  on occurrences for delete
  using (auth.uid() = user_id);

-- ========== STORAGE (occurrence photos) ==========
insert into storage.buckets (id, name, public)
values ('occurrence-photos', 'occurrence-photos', true)
on conflict (id) do nothing;

create policy "occurrence photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'occurrence-photos');

create policy "authenticated users can upload occurrence photos"
  on storage.objects for insert
  with check (bucket_id = 'occurrence-photos' and auth.role() = 'authenticated');

create policy "users can delete their own occurrence photos"
  on storage.objects for delete
  using (bucket_id = 'occurrence-photos' and owner = auth.uid());
