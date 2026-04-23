import { championDefinitions } from '../../data/champions';
import { factionDefinitions } from '../../data/factions';
import { GameState } from '../../types/game';
import { supabase } from '../supabase';
import { assertCompleteMappings, getChampionMaps, getFactionMaps } from './mapping';
import {
  gameResourceIds,
  ProfileChampionIdRow,
  ProfileChampionSaveRow,
  SaveMutationResult,
} from './types';

async function saveProfileChampionRows(
  championRows: ProfileChampionSaveRow[],
): Promise<SaveMutationResult> {
  for (const championRow of championRows) {
    const existingResult = await supabase
      .from('profile_champions')
      .select('id')
      .eq('profile_id', championRow.profile_id)
      .eq('champion_id', championRow.champion_id)
      .limit(1)
      .maybeSingle();

    if (existingResult.error) {
      return { error: existingResult.error };
    }

    const existingRow = existingResult.data as ProfileChampionIdRow | null;
    const saveResult = existingRow
      ? await supabase
          .from('profile_champions')
          .update({ level: championRow.level })
          .eq('id', existingRow.id)
      : await supabase.from('profile_champions').insert(championRow);

    if (saveResult.error) {
      return { error: saveResult.error };
    }
  }

  return { error: null };
}

export async function saveGameProgress(
  profileId: string,
  state: Pick<
    GameState,
    'activeFactionId' | 'championLevels' | 'resources' | 'unlockedFactionIds'
  >,
): Promise<void> {
  const [factionMaps, championMaps] = await Promise.all([getFactionMaps(), getChampionMaps()]);
  assertCompleteMappings(factionMaps, championMaps);

  const resourceRows = gameResourceIds.map((resourceId) => ({
    profile_id: profileId,
    type: resourceId,
    amount: state.resources[resourceId],
  }));

  const factionRows = factionDefinitions
    .map((faction) => {
      const dbFactionId = factionMaps.dbFactionIdByGameId.get(faction.id);

      if (!dbFactionId) {
        return null;
      }

      return {
        profile_id: profileId,
        faction_id: dbFactionId,
        unlocked: state.unlockedFactionIds.includes(faction.id),
        progress: {
          activeFaction: state.activeFactionId === faction.id,
        },
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const championRows = championDefinitions
    .map((champion) => {
      const dbChampionId = championMaps.dbChampionIdByGameId.get(champion.id);

      if (!dbChampionId) {
        return null;
      }

      return {
        profile_id: profileId,
        champion_id: dbChampionId,
        level: state.championLevels[champion.id] ?? 0,
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const [resourcesResult, factionsResult, championsResult] = await Promise.all([
    supabase.from('resources').upsert(resourceRows, { onConflict: 'profile_id,type' }),
    supabase
      .from('profile_factions')
      .upsert(factionRows, { onConflict: 'profile_id,faction_id' }),
    saveProfileChampionRows(championRows),
  ]);

  if (resourcesResult.error) {
    throw new Error(`Kunne ikke gemme resources: ${resourcesResult.error.message}`);
  }

  if (factionsResult.error) {
    throw new Error(`Kunne ikke gemme factions-progress: ${factionsResult.error.message}`);
  }

  if (championsResult.error) {
    throw new Error(`Kunne ikke gemme champion-progress: ${championsResult.error.message}`);
  }
}
