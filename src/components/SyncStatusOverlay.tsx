import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

type SyncStatusOverlayProps = {
  message: string;
  title: string;
};

const isWeb = Platform.OS === 'web';

export function SyncStatusOverlay({ message, title }: SyncStatusOverlayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#E9D7AC" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: 'rgba(233, 215, 172, 0.24)',
    borderRadius: 16,
    ...(isWeb
      ? { boxShadow: '0 16px 28px rgba(0, 0, 0, 0.28)' }
      : {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.28,
          shadowRadius: 18,
          elevation: 12,
        }),
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
});
