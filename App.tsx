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
import { useGameStore } from './src/store/useGameStore';
import { TestUser } from './src/types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [route, setRoute] = useState<AppRoute>(AppRoute.Home);
  const applyIdleTick = useGameStore((state) => state.applyIdleTick);

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
      return;
    }

    const interval = setInterval(() => {
      applyIdleTick(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [applyIdleTick, currentUser]);

  if (!currentUser) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Login onLogin={setCurrentUser} />
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
        <BottomNavigation route={route} onRouteChange={setRoute} />
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
    paddingBottom: 84,
  },
});
