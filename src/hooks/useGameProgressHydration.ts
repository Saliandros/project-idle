import { useEffect, useState } from 'react';

import { loadGameProgress } from '../services/gameProgress';
import { useGameStore } from '../store/useGameStore';
import { TestUser } from '../types';

type GameProgressHydrationState = {
  errorMessage: string | null;
  isGameReady: boolean;
  status: 'idle' | 'loading' | 'ready' | 'error';
};

export function useGameProgressHydration(currentUser: TestUser | null) {
  const [state, setState] = useState<GameProgressHydrationState>({
    errorMessage: null,
    isGameReady: false,
    status: 'idle',
  });
  const hydrateGameState = useGameStore((state) => state.hydrateGameState);
  const resetGameState = useGameStore((state) => state.resetGameState);

  useEffect(() => {
    const userId = typeof currentUser?.id === 'string' ? currentUser.id : null;

    if (!userId) {
      setState({
        errorMessage: null,
        isGameReady: false,
        status: 'idle',
      });
      resetGameState();
      return;
    }

    let isCancelled = false;
    const profileId = userId;

    async function hydrateFromDatabase() {
      setState({
        errorMessage: null,
        isGameReady: false,
        status: 'loading',
      });

      try {
        const gameState = await loadGameProgress(profileId);

        if (isCancelled) {
          return;
        }

        hydrateGameState(gameState);
      } catch (error) {
        console.log('Game progress load error:', error);

        if (!isCancelled) {
          setState({
            errorMessage:
              error instanceof Error ? error.message : 'Could not load your saved progress.',
            isGameReady: true,
            status: 'error',
          });
        }
      } finally {
        if (!isCancelled) {
          setState((current) =>
            current.status === 'error'
              ? current
              : {
                  errorMessage: null,
                  isGameReady: true,
                  status: 'ready',
                },
          );
        }
      }
    }

    void hydrateFromDatabase();

    return () => {
      isCancelled = true;
    };
  }, [currentUser, hydrateGameState, resetGameState]);

  return state;
}
