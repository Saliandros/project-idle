import { FactionId, GameState, ResourceId } from '../../types/game';

export type ResourceRow = {
  amount: number | null;
  type: string | null;
};

export type ProfileFactionRow = {
  faction_id: string;
  unlocked: boolean | null;
  progress?: { activeFaction?: boolean } | null;
};

export type FactionRow = {
  id: string;
  name: string | null;
};

export type ProfileChampionRow = {
  champion_id: string;
  level: number | null;
};

export type ProfileChampionIdRow = {
  id: string;
};

export type ProfileChampionSaveRow = {
  profile_id: string;
  champion_id: string;
  level: number;
};

export type ChampionRow = {
  id: string;
  name: string | null;
};

export type SaveMutationResult = {
  error: { message: string } | null;
};

export type FactionMaps = {
  dbFactionIdByGameId: Map<FactionId, string>;
  gameFactionIdByDbId: Map<string, FactionId>;
  availableDbFactionNames: string[];
};

export type ChampionMaps = {
  dbChampionIdByGameId: Map<string, string>;
  gameChampionIdByDbId: Map<string, string>;
  availableDbChampionNames: string[];
};

export type PersistedGameState = Pick<
  GameState,
  'activeFactionId' | 'championLevels' | 'resources' | 'unlockedFactionIds'
>;

export const gameResourceIds: ResourceId[] = ['gold', 'iron', 'meat'];
