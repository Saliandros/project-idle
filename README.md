# project-idle

Minimal React Native app built with Expo and TypeScript.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm run dev
```

Other available scripts:

```bash
npm run android
npm run web
```

## Project Structure

- `App.tsx`: App entry, root layout, and simple route state.
- `assets/`: Fonts, images, sound effects, and other static assets.
- `schema/`: SQL schema, policies, and seed scripts for Supabase setup.
- `src/components/`: Reusable UI components.
- `src/constants/`: Shared constants such as route names.
- `src/data/`: Static game definitions for factions, champions, and embassy options.
- `src/hooks/`: Shared lifecycle and game-behavior hooks.
- `src/pages/`: Screen-level components.
- `src/services/`: Supabase client, auth, and game-progress persistence.
- `src/store/`: Zustand game state.
- `src/theme/`: Shared design tokens.
- `src/types/`: Shared TypeScript types.
- `src/utils/`: Formatting and resource conversion helpers.

## Game State

The global game state lives in `src/store/useGameStore.ts`. It tracks active faction, unlocked factions, champion levels, and resources such as gold, iron, meat, and clicks.

Screens such as `Frontpage`, `Factions`, `Stronghold`, and `EmbassyExchange` read from the store and call store actions like `performClick`, `upgradeChampion`, `unlockFaction`, `setActiveFaction`, and `exchangeResource`.

`App.tsx` keeps the app shell small. Game lifecycle behavior is handled by hooks:

- `useIdleProduction`: Applies idle production ticks.
- `useGameProgressHydration`: Loads Supabase progress into Zustand after login.
- `useGameProgressAutosave`: Saves current Zustand progress to Supabase.
- `useAndroidNavigationBar`: Keeps the Android navigation bar hidden.

## Database

Database reference and setup scripts live in `schema/*.sql`.

Run seed scripts in order when setting up a new Supabase project:

```text
001_schema.sql
002_policies.sql
003_seed_factions.sql
004_seed_champions.sql
```

For manual setup in Supabase SQL Editor, `999_seed_all.sql` contains the faction and champion seed data in one file.
