import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { AppRoute } from '../constants/routes';
import { theme } from '../theme/theme';

type BottomNavigationProps = {
  route: AppRoute;
  onRouteChange: (route: AppRoute) => void;
};

export function BottomNavigation({ route, onRouteChange }: BottomNavigationProps) {
  const clickSoundUri = useRef<string | null>(null);
  const isHome = route === AppRoute.Home;
  const isFactions = route === AppRoute.Factions;
  const isEmbassyExchange = route === AppRoute.Embassy_Exchange;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    let mounted = true;

    const prepareSound = async () => {
      try {
        const asset = Asset.fromModule(theme.sfx.buttonClick);
        await asset.downloadAsync();
        const uri = asset.localUri ?? asset.uri;

        if (!uri) {
          clickSoundUri.current = null;
          return;
        }

        if (!mounted) {
          return;
        }

        clickSoundUri.current = uri;
      } catch {
        clickSoundUri.current = null;
      }
    };

    void prepareSound();

    return () => {
      mounted = false;
      clickSoundUri.current = null;
    };
  }, []);

  const playClick = async () => {
    const WebAudio = (globalThis as unknown as { Audio?: new (src?: string) => { volume: number; play: () => Promise<unknown> } }).Audio;

    if (Platform.OS !== 'web' || !clickSoundUri.current || !WebAudio) {
      return;
    }

    try {
      const sound = new WebAudio(clickSoundUri.current);
      sound.volume = 0.9;
      await sound.play();
    } catch {
      // Ignore audio errors to keep navigation responsive.
    }
  };

  const handleRouteChange = (nextRoute: AppRoute) => {
    void playClick();
    onRouteChange(nextRoute);
  };

  return (
    <SafeAreaView style={styles.navSafeArea}>
      <View style={[styles.nav, { backgroundColor: theme.colors.navColor }]}>
        <Pressable
          style={({ pressed }) => [styles.navButton, isHome && styles.navButtonActive, pressed && styles.navButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Home"
          onPress={() => handleRouteChange(AppRoute.Home)}
        >
          <Ionicons name={isHome ? 'home' : 'home-outline'} size={28} color={theme.colors.textPrimary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.navButton, isFactions && styles.navButtonActive, pressed && styles.navButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Factions"
          onPress={() => handleRouteChange(AppRoute.Factions)}
        >
          <Ionicons name="shield-half" size={28} color={theme.colors.textPrimary} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.navButton, isEmbassyExchange && styles.navButtonActive, pressed && styles.navButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Embassy"
          onPress={() => handleRouteChange(AppRoute.Embassy_Exchange)}
        >
          <Ionicons name="swap-horizontal" size={28} color={theme.colors.textPrimary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
  },
  navButton: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonPressed: {
    opacity: 0.8,
  },
});
