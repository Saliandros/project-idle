import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BottomNavigation, BottomNavigationRoute } from '../../src/components/BottomNavigation';
import { BottomNavInsetProvider } from '../../src/context/BottomNavInsetContext';
import { SyncStatusOverlay } from '../../src/components/SyncStatusOverlay';
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
  const { errorMessage, isGameReady, status } = useGameProgressHydration(currentUser);
  const { autoSaveErrorMessage, autoSaveLabel, autoSaveTone } = useGameProgressAutosave(
    currentUser,
    isGameReady,
  );

  useIdleProduction(currentUser);

  if (!currentUser) {
    return <Redirect href="/(auth)/login" />;
  }

  if (status === 'loading') {
    return (
      <SyncStatusOverlay
        title="Syncing Progress"
        message="Loading your saved game data from Supabase before the app opens."
      />
    );
  }

  return (
    <BottomNavInsetProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ state, navigation }) => (
          <BottomNavigation
            autoSaveErrorMessage={autoSaveErrorMessage}
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
      {status === 'error' ? (
        <View pointerEvents="none" style={styles.syncWarningOverlay}>
          <View style={styles.syncWarningCard}>
            <View style={styles.syncWarningDot} />
            <View style={styles.syncWarningTextWrap}>
              <Text style={styles.syncWarningTitle}>Sync Warning</Text>
              <Text style={styles.syncWarningMessage}>
                {errorMessage ?? 'Saved progress could not be loaded. Using local fallback state.'}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </BottomNavInsetProvider>
  );
}

const styles = StyleSheet.create({
  syncWarningOverlay: {
    position: 'absolute',
    top: 18,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  syncWarningCard: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(139, 0, 0, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 12,
  },
  syncWarningDot: {
    width: 10,
    height: 10,
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: '#FFD7D7',
  },
  syncWarningTextWrap: {
    flex: 1,
  },
  syncWarningTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  syncWarningMessage: {
    color: 'rgba(255, 255, 255, 0.84)',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
});
