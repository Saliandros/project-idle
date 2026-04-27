import { router } from 'expo-router';

import { useAuth } from '../../src/context/AuthContext';
import { Login } from '../../src/pages/Login';
import { TestUser } from '../../src/types';

export default function LoginScreen() {
  const { setCurrentUser } = useAuth();

  const handleLogin = (user: TestUser) => {
    setCurrentUser(user);
    router.replace('/(tabs)');
  };

  return <Login onLogin={handleLogin} />;
}
