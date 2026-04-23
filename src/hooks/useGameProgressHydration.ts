import { useEffect, useState } from 'react';

import { loadGameProgress } from '../services/gameProgress';
import { useGameStore } from '../store/useGameStore';
import { TestUser } from '../types';

export function useGameProgressHydration(currentUser: TestUser | null) {
  const [isGameReady, setIsGameReady] = useState(false);
  const hydrateGameState = useGameStore((state) => state.hydrateGameState);
  const resetGameState = useGameStore((state) => state.resetGameState);

  useEffect(() => {
    const userId = typeof currentUser?.id === 'string' ? currentUser.id : null;

    if (!userId) {
      setIsGameReady(false);
      resetGameState();
      return;
    }

    let isCancelled = false;
    const profileId = userId;

    async function hydrateFromDatabase() {
      setIsGameReady(false);

      try {
        const gameState = await loadGameProgress(profileId);

        if (isCancelled) {
          return;
        }

        hydrateGameState(gameState);
      } catch (error) {
        console.log('Game progress load error:', error);
      } finally {
        if (!isCancelled) {
          setIsGameReady(true);
        }
      }
    }

    void hydrateFromDatabase();

    return () => {
      isCancelled = true;
    };
  }, [currentUser, hydrateGameState, resetGameState]);

  return isGameReady;
}
