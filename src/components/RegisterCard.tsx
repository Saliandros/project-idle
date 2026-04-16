import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../theme/theme';

type RegisterCardProps = {
  onLogin: () => void;
};

export function RegisterCard({ onLogin }: RegisterCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.navColor }]}>
      <TextInput
        placeholder="Username"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.submitButton} accessibilityRole="button">
        <Text style={styles.submitButtonLabel}>Register</Text>
      </Pressable>

      <View style={styles.loginRow}>
        <Text style={[styles.loginText, { color: theme.colors.textPrimary }]}>Already have an account </Text>
        <Pressable onPress={onLogin} accessibilityRole="link">
          <Text style={[styles.loginLink, { color: theme.colors.textPrimary }]}>login here</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  input: {
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    color: '#141414',
    fontSize: 17,
  },
  submitButton: {
    height: 54,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  submitButtonLabel: {
    color: '#111111',
    fontSize: 19,
    fontWeight: '500',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
