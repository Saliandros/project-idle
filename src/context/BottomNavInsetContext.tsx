import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type BottomNavInsetContextValue = {
  bottomNavHeight: number;
  setBottomNavHeight: (height: number) => void;
};

const BottomNavInsetContext = createContext<BottomNavInsetContextValue | null>(null);

type BottomNavInsetProviderProps = {
  children: ReactNode;
};

export function BottomNavInsetProvider({ children }: BottomNavInsetProviderProps) {
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const value = useMemo(
    () => ({
      bottomNavHeight,
      setBottomNavHeight,
    }),
    [bottomNavHeight],
  );

  return <BottomNavInsetContext.Provider value={value}>{children}</BottomNavInsetContext.Provider>;
}

export function useBottomNavInset() {
  const context = useContext(BottomNavInsetContext);

  if (!context) {
    throw new Error('useBottomNavInset must be used within a BottomNavInsetProvider.');
  }

  return context;
}
