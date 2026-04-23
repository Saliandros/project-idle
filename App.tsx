import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNavigation } from './src/components/BottomNavigation';
import { AppRoute } from './src/constants/routes';
import { Champions } from './src/pages/Champions';
import { EmbassyExchange } from './src/pages/EmbassyExchange';
import { Factions } from './src/pages/Factions';
import { Frontpage } from './src/pages/Frontpage';
import { Login } from './src/pages/Login';
import { loadGameProgress, saveGameProgress } from './src/services/gameProgress';
import { useGameStore } from './src/store/useGameStore';
import { TestUser } from './src/types';

const AUTO_SAVE_INTERVAL_MS = 60000;

export default function App() {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [isGameReady, setIsGameReady] = useState(false);
  const [route, setRoute] = useState<AppRoute>(AppRoute.Home);
  const [autoSaveState, setAutoSaveState] = useState<'idle' | 'pending' | 'saving' | 'saved' | 'error'>('idle');
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<Date | null>(null);
  const applyIdleTick = useGameStore((state) => state.applyIdleTick);
  const hydrateGameState = useGameStore((state) => state.hydrateGameState);
  const resetGameState = useGameStore((state) => state.resetGameState);

  useEffect(() => {
    // Skjul Android navigation bar
    const hideNavigationBar = async () => {
      try {
        await NavigationBar.setVisibilityAsync('hidden');
        
        // Gentag efter kort tid for at være sikker
        setTimeout(async () => {
          await NavigationBar.setVisibilityAsync('hidden');
        }, 500);
        
      } catch (error) {
        console.log('Navigation bar error:', error);
      }
    };
    
    // Skjul navigation bar ved app start
    hideNavigationBar();

    // Lyt til app state changes (når skærmen tændes/slukkes)
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App kommer tilbage i fokus - skjul navigation bar igen
        hideNavigationBar();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setIsGameReady(false);
      resetGameState();
      return;
    }

    const interval = setInterval(() => {
      applyIdleTick(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [applyIdleTick, currentUser, resetGameState]);

  useEffect(() => {
    let isCancelled = false;

    async function hydrateFromDatabase() {
      if (!currentUser || typeof currentUser.id !== 'string') {
        return;
      }

      setIsGameReady(false);

      try {
        const gameState = await loadGameProgress(currentUser.id);

        if (isCancelled) {
          return;
        }

        hydrateGameState(gameState);
      } catch (error) {
        console.log('Game progress load error:', error);
      } finally {
        if (!isCancelled) {
          setIsGameReady(true);
        }
      }
    }

    hydrateFromDatabase();

    return () => {
      isCancelled = true;
    };
  }, [currentUser, hydrateGameState]);

  useEffect(() => {
    if (!currentUser || typeof currentUser.id !== 'string' || !isGameReady) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isDisposed = false;
    let isSaving = false;

    const clearAutoSaveInterval = () => {
      if (!intervalId) {
        return;
      }

      clearInterval(intervalId);
      intervalId = null;
    };

    const runSave = async () => {
      if (isSaving || isDisposed) {
        return;
      }

      isSaving = true;
      setAutoSaveState('saving');

      const state = useGameStore.getState();

      try {
        await saveGameProgress(currentUser.id as string, {
          activeFactionId: state.activeFactionId,
          championLevels: state.championLevels,
          resources: state.resources,
          unlockedFactionIds: state.unlockedFactionIds,
        });

        if (isDisposed) {
          return;
        }

        setLastAutoSavedAt(new Date());
        setAutoSaveState('saved');
      } catch (error) {
        if (isDisposed) {
          return;
        }

        setAutoSaveState('error');
        console.log('Game progress save error:', error);
      } finally {
        isSaving = false;
      }
    };

    setAutoSaveState('pending');
    intervalId = setInterval(() => {
      void runSave();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      isDisposed = true;
      clearAutoSaveInterval();
    };
  }, [currentUser, isGameReady]);

  useEffect(() => {
    if (currentUser) {
      return;
    }

    setAutoSaveState('idle');
    setLastAutoSavedAt(null);
  }, [currentUser]);

  const autoSaveLabel = (() => {
    if (!currentUser) {
      return '';
    }

    if (!isGameReady) {
      return 'Syncer data...';
    }

    if (autoSaveState === 'pending') {
      return 'Autosave: Venter';
    }

    if (autoSaveState === 'saving') {
      return 'Autosave: Gemmer...';
    }

    if (autoSaveState === 'error') {
      return 'Autosave: Fejl';
    }

    if (autoSaveState === 'saved' && lastAutoSavedAt) {
      const time = `${String(lastAutoSavedAt.getHours()).padStart(2, '0')}:${String(
        lastAutoSavedAt.getMinutes(),
      ).padStart(2, '0')}:${String(lastAutoSavedAt.getSeconds()).padStart(2, '0')}`;

      return `Autosave: Gemt ${time}`;
    }

    return 'Autosave: Klar';
  })();

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

    if (route === AppRoute.Embassy_Exchange) {
      return <EmbassyExchange onNavigate={setRoute} />;
    }

    if (route === AppRoute.Champions) {
      return <Champions onNavigate={setRoute} />;
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
          autoSaveTone={autoSaveState === 'error' ? 'error' : 'normal'}
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
