import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../theme/theme';

type RegisterSubmitInput = {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type RegisterCardProps = {
  onLogin: () => void;
  onSubmit: (input: RegisterSubmitInput) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function RegisterCard({ onLogin, onSubmit, isSubmitting = false, errorMessage = null }: RegisterCardProps) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    void onSubmit({ firstname, lastname, email, username, password, confirmPassword });
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.navColor }]}>
      <TextInput
        placeholder="Firstname"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        value={firstname}
        onChangeText={setFirstname}
        editable={!isSubmitting}
      />
      <TextInput
        placeholder="Lastname"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        value={lastname}
        onChangeText={setLastname}
        editable={!isSubmitting}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!isSubmitting}
      />
      <TextInput
        placeholder="Username"
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
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="rgba(20, 20, 20, 0.65)"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!isSubmitting}
      />

      {errorMessage ? <Text style={[styles.errorText, { color: theme.colors.feedbackError }]}>{errorMessage}</Text> : null}

      <Pressable style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} accessibilityRole="button" onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitButtonLabel}>{isSubmitting ? 'Creating account...' : 'Register'}</Text>
      </Pressable>

      <View style={styles.loginRow}>
        <Text style={[styles.loginText, { color: theme.colors.textPrimary }]}>Already have an account </Text>
        <Pressable onPress={onLogin} accessibilityRole="link" disabled={isSubmitting}>
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
