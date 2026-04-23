import { championDefinitions } from '../../data/champions';
import { factionDefinitions } from '../../data/factions';
import { FactionId, GameState, ResourceId } from '../../types/game';
import { supabase } from '../supabase';
import { assertCompleteMappings, getChampionMaps, getFactionMaps } from './mapping';
import {
  gameResourceIds,
  PersistedGameState,
  ProfileChampionRow,
  ProfileFactionRow,
  ResourceRow,
} from './types';

function isGameResourceId(value: string): value is ResourceId {
  return gameResourceIds.includes(value as ResourceId);
}

function isFactionId(value: string): value is FactionId {
  return factionDefinitions.some((faction) => faction.id === value);
}

export async function loadGameProgress(profileId: string): Promise<PersistedGameState> {
  const [resourcesResult, factionsResult, championsResult, factionMaps, championMaps] = await Promise.all([
    supabase.from('resources').select('type, amount').eq('profile_id', profileId),
    supabase
      .from('profile_factions')
      .select('faction_id, unlocked, progress')
      .eq('profile_id', profileId),
    supabase.from('profile_champions').select('champion_id, level').eq('profile_id', profileId),
    getFactionMaps(),
    getChampionMaps(),
  ]);

  if (resourcesResult.error) {
    throw new Error(`Kunne ikke hente resources: ${resourcesResult.error.message}`);
  }

  if (factionsResult.error) {
    throw new Error(`Kunne ikke hente factions-progress: ${factionsResult.error.message}`);
  }

  if (championsResult.error) {
    throw new Error(`Kunne ikke hente champion-progress: ${championsResult.error.message}`);
  }

  assertCompleteMappings(factionMaps, championMaps);

  const resources: GameState['resources'] = {
    clicks: 0,
    gold: 0,
    iron: 0,
    meat: 0,
  };

  (resourcesResult.data as ResourceRow[] | null)?.forEach((row) => {
    if (!row.type || !isGameResourceId(row.type)) {
      return;
    }

    resources[row.type] = row.amount ?? 0;
  });

  const unlockedFactionIds =
    (factionsResult.data as ProfileFactionRow[] | null)
      ?.map((row) => ({
        unlocked: row.unlocked,
        gameFactionId: factionMaps.gameFactionIdByDbId.get(row.faction_id),
      }))
      .filter((row): row is { unlocked: boolean | null; gameFactionId: FactionId } =>
        Boolean(row.gameFactionId),
      )
      .filter((row) => row.unlocked)
      .map((row) => row.gameFactionId) ?? [];

  if (!unlockedFactionIds.includes('lizardman')) {
    unlockedFactionIds.unshift('lizardman');
  }

  const activeFactionId =
    (factionsResult.data as ProfileFactionRow[] | null)?.find(
      (row) => row.progress?.activeFaction,
    )?.faction_id ?? '';

  const mappedActiveFactionId = factionMaps.gameFactionIdByDbId.get(activeFactionId) ?? 'lizardman';

  const championLevels = Object.fromEntries(
    championDefinitions.map((champion) => [champion.id, 0]),
  ) as GameState['championLevels'];

  (championsResult.data as ProfileChampionRow[] | null)?.forEach((row) => {
    const gameChampionId = championMaps.gameChampionIdByDbId.get(row.champion_id);

    if (!gameChampionId || !(gameChampionId in championLevels)) {
      return;
    }

    championLevels[gameChampionId] = row.level ?? 0;
  });

  return {
    activeFactionId: isFactionId(mappedActiveFactionId) ? mappedActiveFactionId : 'lizardman',
    championLevels,
    resources,
    unlockedFactionIds,
  };
}
