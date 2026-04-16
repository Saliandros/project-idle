import { StyleSheet, Text } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenCard } from '../components/ScreenCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppRoute } from '../constants/routes';
import { useThemeColors } from '../hooks/useThemeColors';

type SettingsPageProps = {
  onNavigate: (route: AppRoute) => void;
};

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const colors = useThemeColors();

  return (
    <ScreenContainer>
      <ScreenCard>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>Her kan du senere samle præferencer, konto og app-konfiguration.</Text>
        <PrimaryButton label="Tilbage til home" onPress={() => onNavigate(AppRoute.Home)} />
      </ScreenCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});