-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Creates the tables for user-added pins and per-page media.

create table if not exists pins (
  id uuid primary key default gen_random_uuid(),
  page text not null default 'navsari',
  name text not null,
  note text,
  lat double precision not null,
  lon double precision not null,
  kind text not null default 'place',
  emoji text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  type text not null check (type in ('photo','audio')),
  url text not null,
  caption text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Treasure progress is PER VISITOR, keyed by an anonymous id stored in the
-- browser (cookie + localStorage). This way your own testing never reveals
-- memories to Krushi — each device has its own discovery state.
-- Discovery data is disposable, so this recreates the table cleanly.
drop table if exists progress;
create table progress (
  visitor text not null,
  page text not null,
  unlocked_at timestamptz not null default now(),
  primary key (visitor, page)
);
create index if not exists progress_visitor_idx on progress (visitor);

-- Relationship timeline entries (the "calendar" page). Seed entries live in
-- code; these are the ones added from the browser.
create table if not exists timeline (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  note text,
  kind text not null default 'past' check (kind in ('past','milestone','future')),
  emoji text,
  media jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
-- safe to re-run if the table already existed without these columns:
alter table timeline add column if not exists emoji text;
alter table timeline add column if not exists details jsonb not null default '{}'::jsonb;

-- Reactions (hearts / little replies) keyed by entry id (seed id or timeline uuid).
create table if not exists reactions (
  entry_key text primary key,
  hearted boolean not null default false,
  reply text,
  updated_at timestamptz not null default now()
);

create index if not exists pins_page_idx on pins (page);
create index if not exists media_page_idx on media (page);
create index if not exists timeline_date_idx on timeline (date);

-- Row Level Security: lock down direct client access. All reads/writes go
-- through our server routes using the service_role key (which bypasses RLS),
-- so we intentionally add NO public policies here.
alter table pins enable row level security;
alter table media enable row level security;
alter table timeline enable row level security;
alter table reactions enable row level security;

-- Storage bucket for photos/audio (public read).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
