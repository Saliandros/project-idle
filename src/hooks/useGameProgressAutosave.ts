import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { saveGameProgress } from '../services/gameProgress';
import { useGameStore } from '../store/useGameStore';
import { TestUser } from '../types';

const AUTO_SAVE_INTERVAL_MS = 15000;

type AutoSaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

function getCurrentGameProgressPayload() {
  const state = useGameStore.getState();

  return {
    activeFactionId: state.activeFactionId,
    championLevels: state.championLevels,
    resources: state.resources,
    unlockedFactionIds: state.unlockedFactionIds,
  };
}

function getAutoSaveLabel(
  currentUser: TestUser | null,
  isGameReady: boolean,
  autoSaveState: AutoSaveState,
  lastAutoSavedAt: Date | null,
) {
  if (!currentUser) {
    return '';
  }

  if (!isGameReady) {
    return 'Syncing data...';
  }

  if (autoSaveState === 'pending') {
    return 'Autosave: Waiting';
  }

  if (autoSaveState === 'saving') {
    return 'Autosave: Saving...';
  }

  if (autoSaveState === 'error') {
    return 'Autosave: Error';
  }

  if (autoSaveState === 'saved' && lastAutoSavedAt) {
    const time = `${String(lastAutoSavedAt.getHours()).padStart(2, '0')}:${String(
      lastAutoSavedAt.getMinutes(),
    ).padStart(2, '0')}:${String(lastAutoSavedAt.getSeconds()).padStart(2, '0')}`;

    return `Autosave: Saved ${time}`;
  }

  return 'Autosave: Ready';
}

export function useGameProgressAutosave(currentUser: TestUser | null, isGameReady: boolean) {
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>('idle');
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<Date | null>(null);
  const currentUserRef = useRef(currentUser);
  const isGameReadyRef = useRef(isGameReady);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    isGameReadyRef.current = isGameReady;
  }, [isGameReady]);

  useEffect(() => {
    const userId = typeof currentUser?.id === 'string' ? currentUser.id : null;

    if (!userId || !isGameReady) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isDisposed = false;
    let isSaving = false;

    const clearAutoSaveInterval = () => {
      if (!intervalId) {
        return;
      }

      clearInterval(intervalId);
      intervalId = null;
    };

    const runSave = async () => {
      if (isSaving || isDisposed) {
        return;
      }

      isSaving = true;
      setAutoSaveState('saving');

      try {
        await saveGameProgress(userId, getCurrentGameProgressPayload());

        if (isDisposed) {
          return;
        }

        setLastAutoSavedAt(new Date());
        setAutoSaveState('saved');
      } catch (error) {
        if (isDisposed) {
          return;
        }

        setAutoSaveState('error');
        console.log('Game progress save error:', error);
      } finally {
        isSaving = false;
      }
    };

    setAutoSaveState('pending');
    void runSave();
    intervalId = setInterval(() => {
      void runSave();
    }, AUTO_SAVE_INTERVAL_MS);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        void runSave();
      }
    });

    return () => {
      isDisposed = true;
      subscription.remove();
      clearAutoSaveInterval();
    };
  }, [currentUser, isGameReady]);

  useEffect(() => {
    const browserWindow = (globalThis as typeof globalThis & {
      addEventListener?: (type: string, listener: () => void) => void;
      removeEventListener?: (type: string, listener: () => void) => void;
    });

    if (
      typeof browserWindow.addEventListener !== 'function' ||
      typeof browserWindow.removeEventListener !== 'function'
    ) {
      return;
    }

    const handleBeforeUnload = () => {
      const nextUser = currentUserRef.current;

      if (!nextUser || typeof nextUser.id !== 'string' || !isGameReadyRef.current) {
        return;
      }

      void saveGameProgress(nextUser.id, getCurrentGameProgressPayload());
    };

    browserWindow.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      browserWindow.removeEventListener?.('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      return;
    }

    setAutoSaveState('idle');
    setLastAutoSavedAt(null);
  }, [currentUser]);

  return {
    autoSaveLabel: getAutoSaveLabel(currentUser, isGameReady, autoSaveState, lastAutoSavedAt),
    autoSaveTone: autoSaveState === 'error' ? ('error' as const) : ('normal' as const),
  };
}
