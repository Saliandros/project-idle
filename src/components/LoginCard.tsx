import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../theme/theme';

type LoginSubmitInput = {
  username: string;
  password: string;
  keepLoggedIn: boolean;
};

type LoginCardProps = {
  onRegister: () => void;
  onSubmit: (input: LoginSubmitInput) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
};

export function LoginCard({
  onRegister,
  onSubmit,
  isSubmitting = false,
  errorMessage = null,
  successMessage = null,
}: LoginCardProps) {
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    void onSubmit({ username, password, keepLoggedIn });
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.navColor }]}>
      <TextInput
        placeholder="Username or email"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        editable={!isSubmitting}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isSubmitting}
      />

      <Pressable
        style={styles.keepLoggedInRow}
        onPress={() => setKeepLoggedIn((prev) => !prev)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: keepLoggedIn }}
        disabled={isSubmitting}
      >
        <View style={[styles.checkbox, keepLoggedIn && styles.checkboxChecked]} />
        <Text style={[styles.keepLoggedInText, { color: theme.colors.textPrimary }]}>Keep logged in</Text>
      </Pressable>

      {errorMessage ? <Text style={[styles.errorText, { color: theme.colors.feedbackError }]}>{errorMessage}</Text> : null}
      {successMessage ? (
        <Text
          style={[styles.successText, { color: theme.colors.feedbackSuccess }]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {successMessage}
        </Text>
      ) : null}

      <Pressable style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} accessibilityRole="button" onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitButtonLabel}>{isSubmitting ? 'Logging in...' : 'Login'}</Text>
      </Pressable>

      <View style={styles.signupRow}>
        <Text style={[styles.signupText, { color: theme.colors.textPrimary }]}>Dont have an account </Text>
        <Pressable onPress={onRegister} accessibilityRole="link" disabled={isSubmitting}>
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
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonLabel: {
    color: '#111111',
    fontSize: 19,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
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
