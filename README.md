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