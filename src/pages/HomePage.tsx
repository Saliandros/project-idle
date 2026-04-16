import { StyleSheet, Text } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenCard } from '../components/ScreenCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { useThemeColors } from '../hooks/useThemeColors';
import { AppRoute } from '../constants/routes';

type HomePageProps = {
  onNavigate: (route: AppRoute) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  const colors = useThemeColors();

  return (
    <ScreenContainer>
      <ScreenCard>
        <Text style={[styles.eyebrow, { color: colors.accent }]}>Project Idle</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Basic React Native app</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>Start i src/pages og byg videre med navigation, components, hooks og assets.</Text>
        <PrimaryButton label="Gå til detaljer" onPress={() => onNavigate(AppRoute.Details)} />
        <PrimaryButton label="Gå til settings" onPress={() => onNavigate(AppRoute.Settings)} variant="secondary" />
      </ScreenCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});