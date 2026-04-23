import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppRoute } from '../constants/routes';
import { theme } from '../theme/theme';

type BottomNavigationProps = {
  route: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  autoSaveText?: string;
  autoSaveTone?: 'normal' | 'error';
};

export function BottomNavigation({
  route,
  onRouteChange,
  autoSaveText,
  autoSaveTone = 'normal',
}: BottomNavigationProps) {
  const clickSoundUri = useRef<string | null>(null);
  const { width } = useWindowDimensions();
  const isHome = route === AppRoute.Home;
  const isFactions = route === AppRoute.Factions;
  const isEmbassyExchange = route === AppRoute.Embassy_Exchange;
  const isDesktopWeb = Platform.OS === 'web' && width >= 1024;

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
    const WebAudio = (globalThis as unknown as {
      Audio?: new (src?: string) => { volume: number; play: () => Promise<unknown> };
    }).Audio;

    if (Platform.OS !== 'web' || !clickSoundUri.current || !WebAudio) {
      return;
    }

    try {
      const sound = new WebAudio(clickSoundUri.current);
      sound.volume = 0.9;
      await sound.play();
    } catch {
      // Navigation should continue even if audio playback fails.
    }
  };

  const handleRouteChange = (nextRoute: AppRoute) => {
    void playClick();
    onRouteChange(nextRoute);
  };

  const renderNavContent = (icon: keyof typeof Ionicons.glyphMap, label: string) => (
    <View style={[styles.navButtonContent, isDesktopWeb && styles.navButtonContentDesktop]}>
      <Ionicons name={icon} size={28} color={theme.colors.textPrimary} />
      {isDesktopWeb ? <Text style={styles.navButtonLabel}>{label}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.navSafeArea}>
      <View style={[styles.container, { backgroundColor: theme.colors.navColor }]}>
        {autoSaveText ? (
          <View style={styles.autoSaveRow}>
            <Text style={[styles.autoSaveText, autoSaveTone === 'error' && styles.autoSaveTextError]}>
              {autoSaveText}
            </Text>
          </View>
        ) : null}

        <View style={styles.nav}>
        <Pressable
          style={({ pressed }) => [styles.navButton, isHome && styles.navButtonActive, pressed && styles.navButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Home"
          onPress={() => handleRouteChange(AppRoute.Home)}
        >
          {renderNavContent(isHome ? 'home' : 'home-outline', 'Home')}
        </Pressable>

        {!isDesktopWeb ? (
          <Pressable
            style={({ pressed }) => [styles.navButton, isFactions && styles.navButtonActive, pressed && styles.navButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Factions"
            onPress={() => handleRouteChange(AppRoute.Factions)}
          >
            {renderNavContent('shield-half', 'Factions')}
          </Pressable>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.navButton, isEmbassyExchange && styles.navButtonActive, pressed && styles.navButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Embassy"
          onPress={() => handleRouteChange(AppRoute.Embassy_Exchange)}
        >
          {renderNavContent('swap-horizontal', 'Embassy Exchange')}
        </Pressable>
        </View>
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
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    paddingTop: 6,
  },
  autoSaveRow: {
    minHeight: 18,
    paddingHorizontal: 12,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoSaveText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  autoSaveTextError: {
    color: theme.colors.feedbackError,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonContentDesktop: {
    gap: 10,
  },
  navButtonLabel: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  navButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonPressed: {
    opacity: 0.8,
  },
});
