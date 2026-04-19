# project-idle

Minimal React Native app sat op med Expo og TypeScript.

## Kom i gang

1. Installer dependencies:

	```bash
	npm install
	```

2. Start udviklingsserveren:

	```bash
	npm run start
	```

3. Kommandoen åbner Android og web samtidig, så du kan arbejde cross-platform fra samme dev session.

4. Hvis du kun vil starte Expo uden at åbne targets automatisk, brug:

	```bash
	npm run start:mobile
	```

## Struktur

- `App.tsx`: App entry og root composition
- `assets/fonts/`: Fonte
- `assets/icons/`: Ikoner
- `assets/images/`: Billeder
- `src/components/`: Genbrugelige UI-komponenter
- `src/constants/`: Routes, config og faste værdier
- `src/hooks/`: Custom hooks
- `src/navigation/`: App navigation og flowstyring
- `src/pages/`: Sider/screens
- `src/services/`: API- og datalag
- `src/theme/`: Design tokens og farver
- `src/types/`: Delte typer
- `src/utils/`: Små hjælpefunktioner
- `tsconfig.json`: TypeScript-konfiguration
- `app.json`: Expo-konfiguration

## Startstruktur

- `src/navigation/AppNavigator.tsx`: Simpel app-flow/base for screens
- `src/constants/routes.ts`: Delte route-navne
- `src/pages/HomePage.tsx`: Landing screen
- `src/pages/DetailsPage.tsx`: Placeholder details screen
- `src/pages/SettingsPage.tsx`: Placeholder settings screen

## src mapper

- `src/components/`: Genbrugelige UI-byggesten som knapper, cards og layout-komponenter.
- `src/constants/`: Faste værdier som routes, config-nøgler og app-konstanter.
- `src/hooks/`: Custom hooks til delt state, tema og adfærdslogik.
- `src/navigation/`: Navigation, flowstyring og sammensætning af screens.
- `src/pages/`: Screens og side-niveau komponenter for appens views.
- `src/services/`: API-kald, datalag og integrationer mod eksterne services.
- `src/theme/`: Farver, tokens og fælles visuelle designvalg.
- `src/types/`: Delte TypeScript-typer og interfaces.
- `src/utils/`: Små hjælpefunktioner og generelle utilities.

Schema for DB:
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.champion_minigame (
  champion_id uuid NOT NULL,
  minigame_id uuid NOT NULL,
  CONSTRAINT champion_minigame_pkey PRIMARY KEY (champion_id, minigame_id),
  CONSTRAINT champion_minigame_champion_id_fkey FOREIGN KEY (champion_id) REFERENCES public.champions(id),
  CONSTRAINT champion_minigame_minigame_id_fkey FOREIGN KEY (minigame_id) REFERENCES public.minigames(id)
);
CREATE TABLE public.champions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  faction_id uuid,
  base_income integer,
  CONSTRAINT champions_pkey PRIMARY KEY (id),
  CONSTRAINT champions_faction_id_fkey FOREIGN KEY (faction_id) REFERENCES public.factions(id)
);
CREATE TABLE public.factions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text UNIQUE,
  CONSTRAINT factions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.minigames (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  difficulty integer,
  CONSTRAINT minigames_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profile_champions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  champion_id uuid NOT NULL,
  level integer NOT NULL DEFAULT 0,
  CONSTRAINT profile_champions_pkey PRIMARY KEY (id),
  CONSTRAINT profile_champions_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT profile_champions_champion_id_fkey FOREIGN KEY (champion_id) REFERENCES public.champions(id)
);
CREATE TABLE public.profile_factions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  faction_id uuid NOT NULL,
  unlocked boolean DEFAULT false,
  progress jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT profile_factions_pkey PRIMARY KEY (id),
  CONSTRAINT profile_factions_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT profile_factions_faction_id_fkey FOREIGN KEY (faction_id) REFERENCES public.factions(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text UNIQUE,
  income bigint DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['gold'::text, 'wood'::text, 'iron'::text])),
  amount bigint DEFAULT 0,
  CONSTRAINT resources_pkey PRIMARY KEY (id),
  CONSTRAINT resources_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);