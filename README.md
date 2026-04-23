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

## Zustand

Kort hvad bruger man det til:
Zustand bruges til global state management i React og React Native. Det betyder, at flere sider og komponenter kan dele samme data uden at sende props hele vejen rundt manuelt.

Hvordan er det brugt i mit projekt:
I projektet ligger Zustand-storen i `src/store/useGameStore.ts`. Den holder styr på spillets centrale state: aktiv faction, unlocked factions, champion levels og resources som gold, iron, meat og clicks.

Komponenter som `Frontpage`, `Factions`, `Champions` og `EmbassyExchange` læser data direkte fra `useGameStore`. De bruger også actions fra storen, fx `performClick`, `upgradeChampion`, `unlockFaction`, `setActiveFaction` og `exchangeResource`.

I `App.tsx` bruges Zustand til spillets baggrundslogik. `applyIdleTick(1)` kører hvert sekund og producerer ressourcer fra champions. Når brugeren logger ind, bliver data fra Supabase hentet og lagt ind i Zustand med `hydrateGameState`. Autosave læser derefter den aktuelle Zustand-state hvert minut og gemmer den i Supabase.

## Schema for DB

Database-schemaet ligger i `schema/DB`.
