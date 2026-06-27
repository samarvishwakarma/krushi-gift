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

create index if not exists pins_page_idx on pins (page);
create index if not exists media_page_idx on media (page);

-- Row Level Security: lock down direct client access. All reads/writes go
-- through our server routes using the service_role key (which bypasses RLS),
-- so we intentionally add NO public policies here.
alter table pins enable row level security;
alter table media enable row level security;

-- Storage bucket for photos/audio (public read).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
