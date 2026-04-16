import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomNavigation } from './src/components/BottomNavigation';
import { AppRoute } from './src/constants/routes';
import { EmbassyExchange } from './src/pages/EmbassyExchange';
import { Factions } from './src/pages/Factions';
import { Frontpage } from './src/pages/Frontpage';
import { Login } from './src/pages/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [route, setRoute] = useState<AppRoute>(AppRoute.Home);

  if (!isLoggedIn) {
    return (
      <>
        <StatusBar style="light" />
        <Login onLogin={() => setIsLoggedIn(true)} />
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

    return <Frontpage onNavigate={setRoute} />;
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
