import { createInitialGameState } from '../../store/useGameStore';
import { saveGameProgress } from './saveGameProgress';

export async function resetGameProgress(profileId: string): Promise<void> {
  const initialState = createInitialGameState();

  await saveGameProgress(profileId, {
    activeFactionId: initialState.activeFactionId,
    championLevels: initialState.championLevels,
    resources: initialState.resources,
    unlockedFactionIds: initialState.unlockedFactionIds,
  });
}
