import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNavigation } from './src/components/BottomNavigation';
import { AppRoute } from './src/constants/routes';
import { useAndroidNavigationBar } from './src/hooks/useAndroidNavigationBar';
import { useGameProgressAutosave } from './src/hooks/useGameProgressAutosave';
import { useGameProgressHydration } from './src/hooks/useGameProgressHydration';
import { useIdleProduction } from './src/hooks/useIdleProduction';
import { EmbassyExchange } from './src/pages/EmbassyExchange';
import { Factions } from './src/pages/Factions';
import { Frontpage } from './src/pages/Frontpage';
import { Login } from './src/pages/Login';
import { Stronghold } from './src/pages/Stronghold';
import { TestUser } from './src/types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [route, setRoute] = useState<AppRoute>(AppRoute.Home);
  const isGameReady = useGameProgressHydration(currentUser);
  const { autoSaveLabel, autoSaveTone } = useGameProgressAutosave(currentUser, isGameReady);

  useAndroidNavigationBar();
  useIdleProduction(currentUser);

  if (!currentUser) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Login onLogin={setCurrentUser} />
      </SafeAreaProvider>
    );
  }

  if (!isGameReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.app}>
          <StatusBar style="light" />
        </View>
      </SafeAreaProvider>
    );
  }

  const content = (() => {
    if (route === AppRoute.Factions) {
      return <Factions onNavigate={setRoute} />;
    }

    if (route === AppRoute.EmbassyExchange) {
      return <EmbassyExchange onNavigate={setRoute} />;
    }

    if (route === AppRoute.Stronghold) {
      return <Stronghold onNavigate={setRoute} />;
    }

    return <Frontpage onNavigate={setRoute} currentUser={currentUser} />;
  })();

  return (
    <SafeAreaProvider>
      <View style={styles.app}>
        <StatusBar style="light" />

        <View style={styles.content}>{content}</View>
        <BottomNavigation
          route={route}
          onRouteChange={setRoute}
          autoSaveText={autoSaveLabel}
          autoSaveTone={autoSaveTone}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingBottom: 108,
  },
});
