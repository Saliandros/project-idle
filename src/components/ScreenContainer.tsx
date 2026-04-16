import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';

export function ScreenContainer({ children }: PropsWithChildren) {
  const colors = useThemeColors();

  return <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});