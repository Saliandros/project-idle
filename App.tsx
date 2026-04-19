import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomNavigation } from './src/components/BottomNavigation';
import { AppRoute } from './src/constants/routes';
import { EmbassyExchange } from './src/pages/EmbassyExchange';
import { Factions } from './src/pages/Factions';
import { Frontpage } from './src/pages/Frontpage';
import { Login } from './src/pages/Login';
import { TestUser } from './src/types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [route, setRoute] = useState<AppRoute>(AppRoute.Home);

  if (!currentUser) {
    return (
      <>
        <StatusBar style="light" />
        <Login onLogin={setCurrentUser} />
      </>
    );
  }

  const content = (() => {
    if (route === AppRoute.Factions) {
      return <Factions onNavigate={setRoute} />;
    }

    if (route === AppRoute.Embassy_Exchange) {
      return <EmbassyExchange onNavigate={setRoute} />;
    }

    return <Frontpage onNavigate={setRoute} currentUser={currentUser} />;
  })();

  return (
    <View style={styles.app}>
      <StatusBar style="light" />

      <View style={styles.content}>{content}</View>
      <BottomNavigation route={route} onRouteChange={setRoute} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
});
