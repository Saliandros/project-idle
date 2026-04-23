-- Schema snapshot for the current Supabase database.
-- This file is for reference and documentation.

create table public.champion_minigame (
  champion_id uuid not null,
  minigame_id uuid not null,
  constraint champion_minigame_pkey primary key (champion_id, minigame_id),
  constraint champion_minigame_champion_id_fkey foreign key (champion_id) references public.champions(id),
  constraint champion_minigame_minigame_id_fkey foreign key (minigame_id) references public.minigames(id)
);

create table public.champions (
  id uuid not null default gen_random_uuid(),
  name text,
  faction_id uuid,
  base_income integer,
  constraint champions_pkey primary key (id),
  constraint champions_faction_id_fkey foreign key (faction_id) references public.factions(id)
);

create table public.factions (
  id uuid not null default gen_random_uuid(),
  name text unique,
  constraint factions_pkey primary key (id)
);

create table public.minigames (
  id uuid not null default gen_random_uuid(),
  name text,
  difficulty integer,
  constraint minigames_pkey primary key (id)
);

create table public.profile_champions (
  id uuid not null default gen_random_uuid(),
  profile_id uuid not null,
  champion_id uuid not null,
  level integer not null default 0,
  constraint profile_champions_pkey primary key (id),
  constraint profile_champions_profile_id_fkey foreign key (profile_id) references public.profiles(id),
  constraint profile_champions_champion_id_fkey foreign key (champion_id) references public.champions(id)
);

create table public.profile_factions (
  id uuid not null default gen_random_uuid(),
  profile_id uuid not null,
  faction_id uuid not null,
  unlocked boolean default false,
  progress jsonb default '{}'::jsonb,
  constraint profile_factions_pkey primary key (id),
  constraint profile_factions_profile_id_fkey foreign key (profile_id) references public.profiles(id),
  constraint profile_factions_faction_id_fkey foreign key (faction_id) references public.factions(id)
);

create table public.profiles (
  id uuid not null,
  username text unique,
  income bigint default 0,
  created_at timestamp with time zone default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users(id)
);

create table public.resources (
  id uuid not null default gen_random_uuid(),
  profile_id uuid not null,
  type text not null check (type = any (array['gold'::text, 'wood'::text, 'iron'::text, 'meat'::text])),
  amount bigint default 0,
  constraint resources_pkey primary key (id),
  constraint resources_profile_id_fkey foreign key (profile_id) references public.profiles(id)
);
