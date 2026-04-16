import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../theme/theme';

type LoginCardProps = {
  onRegister: () => void;
  onSubmit?: () => void;
};

export function LoginCard({ onRegister, onSubmit }: LoginCardProps) {
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.navColor }]}>
      <TextInput
        placeholder="Username"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        secureTextEntry
      />

      <Pressable
        style={styles.keepLoggedInRow}
        onPress={() => setKeepLoggedIn((prev) => !prev)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: keepLoggedIn }}
      >
        <View style={[styles.checkbox, keepLoggedIn && styles.checkboxChecked]} />
        <Text style={[styles.keepLoggedInText, { color: theme.colors.textPrimary }]}>Keep logged in</Text>
      </Pressable>

      <Pressable style={styles.submitButton} accessibilityRole="button" onPress={onSubmit}>
        <Text style={styles.submitButtonLabel}>Login</Text>
      </Pressable>

      <View style={styles.signupRow}>
        <Text style={[styles.signupText, { color: theme.colors.textPrimary }]}>Dont have an account </Text>
        <Pressable onPress={onRegister} accessibilityRole="link">
          <Text style={[styles.signupLink, { color: theme.colors.textPrimary }]}>create one here</Text>
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
  keepLoggedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
  },
  keepLoggedInText: {
    fontSize: 14,
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
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    fontSize: 14,
    textAlign: 'center',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
