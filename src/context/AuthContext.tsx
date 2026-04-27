import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { TestUser } from '../types';

type AuthContextValue = {
  currentUser: TestUser | null;
  setCurrentUser: (user: TestUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
