import { useEffect } from 'react';

import { useGameStore } from '../store/useGameStore';
import { TestUser } from '../types';

export function useIdleProduction(currentUser: TestUser | null) {
  const applyIdleTick = useGameStore((state) => state.applyIdleTick);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const interval = setInterval(() => {
      applyIdleTick(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [applyIdleTick, currentUser]);
}
