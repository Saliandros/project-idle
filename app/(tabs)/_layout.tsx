import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BottomNavigation, BottomNavigationRoute } from '../../src/components/BottomNavigation';
import { useAuth } from '../../src/context/AuthContext';
import { useGameProgressAutosave } from '../../src/hooks/useGameProgressAutosave';
import { useGameProgressHydration } from '../../src/hooks/useGameProgressHydration';
import { useIdleProduction } from '../../src/hooks/useIdleProduction';

function getCurrentNavRoute(routeName: string): BottomNavigationRoute {
  if (routeName === 'stronghold-hub' || routeName === 'stronghold') {
    return 'stronghold-hub';
  }

  if (routeName === 'embassy-exchange') {
    return 'embassy-exchange';
  }

  return 'index';
}

export default function TabsLayout() {
  const { currentUser } = useAuth();
  const isGameReady = useGameProgressHydration(currentUser);
  const { autoSaveLabel, autoSaveTone } = useGameProgressAutosave(currentUser, isGameReady);

  useIdleProduction(currentUser);

  if (!currentUser) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!isGameReady) {
    return <View style={styles.loadingScreen} />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <BottomNavigation
          route={getCurrentNavRoute(state.routes[state.index]?.name ?? 'index')}
          onRouteChange={(route) => navigation.navigate(route)}
          autoSaveText={autoSaveLabel}
          autoSaveTone={autoSaveTone}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="stronghold-hub" options={{ title: 'Stronghold' }} />
      <Tabs.Screen name="embassy-exchange" options={{ title: 'Embassy Exchange' }} />
      <Tabs.Screen name="stronghold" options={{ href: null, title: 'Stronghold' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
