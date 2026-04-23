import { championDefinitions } from '../data/champions';
import { factionDefinitions } from '../data/factions';
import { supabase } from './supabase';
import { FactionId, GameState, ResourceId } from '../types/game';

type ResourceRow = {
  amount: number | null;
  type: string | null;
};

type ProfileFactionRow = {
  faction_id: string;
  unlocked: boolean | null;
  progress?: { activeFaction?: boolean } | null;
};

type FactionRow = {
  id: string;
  name: string | null;
};

type ProfileChampionRow = {
  champion_id: string;
  level: number | null;
};

type ProfileChampionIdRow = {
  id: string;
};

type ProfileChampionSaveRow = {
  profile_id: string;
  champion_id: string;
  level: number;
};

type ChampionRow = {
  id: string;
  name: string | null;
};

type SaveMutationResult = {
  error: { message: string } | null;
};

type FactionMaps = {
  dbFactionIdByGameId: Map<FactionId, string>;
  gameFactionIdByDbId: Map<string, FactionId>;
  availableDbFactionNames: string[];
};

type ChampionMaps = {
  dbChampionIdByGameId: Map<string, string>;
  gameChampionIdByDbId: Map<string, string>;
  availableDbChampionNames: string[];
};

type PersistedGameState = Pick<
  GameState,
  'activeFactionId' | 'championLevels' | 'resources' | 'unlockedFactionIds'
>;

const gameResourceIds: ResourceId[] = ['gold', 'iron', 'meat'];

function normalizeLookupValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

const factionNameAliases = factionDefinitions.reduce<Record<FactionId, string[]>>((aliases, faction) => {
  const singularLabel = faction.label.endsWith('s') ? faction.label.slice(0, -1) : faction.label;
  const lockedNameWithoutArticle = faction.lockedName.replace(/^the\s+/i, '');

  aliases[faction.id] = [
    faction.id,
    faction.label,
    singularLabel,
    faction.lockedName,
    lockedNameWithoutArticle,
  ];

  return aliases;
}, {} as Record<FactionId, string[]>);

const championNameAliases = championDefinitions.reduce<Record<string, string[]>>((aliases, champion) => {
  aliases[champion.id] = [champion.id, champion.name];
  return aliases;
}, {});

function toGameFactionId(name: string): FactionId | null {
  const normalized = normalizeLookupValue(name);

  const matched = (Object.keys(factionNameAliases) as FactionId[]).find((factionId) =>
    factionNameAliases[factionId].some((alias) => normalizeLookupValue(alias) === normalized),
  );

  return matched ?? null;
}

function toGameChampionId(name: string): string | null {
  const normalized = normalizeLookupValue(name);
  const matched = championDefinitions.find((champion) =>
    championNameAliases[champion.id]?.some((alias) => normalizeLookupValue(alias) === normalized),
  );

  return matched?.id ?? null;
}

function getMissingFactionMappings(
  dbFactionIdByGameId: Map<FactionId, string>,
) {
  return factionDefinitions
    .map((faction) => faction.id)
    .filter((factionId) => !dbFactionIdByGameId.has(factionId));
}

function getMissingChampionMappings(
  dbChampionIdByGameId: Map<string, string>,
) {
  return championDefinitions
    .map((champion) => champion.id)
    .filter((championId) => !dbChampionIdByGameId.has(championId));
}

function assertLookupTablesAvailable(
  factionMaps: FactionMaps,
  championMaps: ChampionMaps,
) {
  const hasNoFactionRows = factionMaps.availableDbFactionNames.length === 0;
  const hasNoChampionRows = championMaps.availableDbChampionNames.length === 0;

  if (!hasNoFactionRows && !hasNoChampionRows) {
    return;
  }

  const errors: string[] = [];

  if (hasNoFactionRows) {
    errors.push(
      'Tabellen public.factions returnerede 0 rækker for den aktuelle session. ' +
        'Det skyldes næsten altid enten manglende seed-data eller RLS/policies, der skjuler rækkerne.',
    );
  }

  if (hasNoChampionRows) {
    errors.push(
      'Tabellen public.champions returnerede 0 rækker for den aktuelle session. ' +
        'Det skyldes næsten altid enten manglende seed-data eller RLS/policies, der skjuler rækkerne.',
    );
  }

  throw new Error(errors.join(' '));
}

function assertCompleteMappings(
  factionMaps: FactionMaps,
  championMaps: ChampionMaps,
) {
  assertLookupTablesAvailable(factionMaps, championMaps);

  const missingFactionMappings = getMissingFactionMappings(factionMaps.dbFactionIdByGameId);
  const missingChampionMappings = getMissingChampionMappings(championMaps.dbChampionIdByGameId);

  if (!missingFactionMappings.length && !missingChampionMappings.length) {
    return;
  }

  const errors: string[] = [];

  if (missingFactionMappings.length) {
    errors.push(`factions: ${missingFactionMappings.join(', ')}`);
  }

  if (missingChampionMappings.length) {
    errors.push(`champions: ${missingChampionMappings.join(', ')}`);
  }

  const availableFactionNames = factionMaps.availableDbFactionNames.length
    ? factionMaps.availableDbFactionNames.join(', ')
    : '[ingen rækker fundet]';
  const availableChampionNames = championMaps.availableDbChampionNames.length
    ? championMaps.availableDbChampionNames.join(', ')
    : '[ingen rækker fundet]';
  const expectedFactionAliases = (Object.keys(factionNameAliases) as FactionId[])
    .map((factionId) => `${factionId}: ${factionNameAliases[factionId].join('/')}`)
    .join(' | ');
  const expectedChampionAliases = championDefinitions
    .map((champion) => `${champion.id}: ${championNameAliases[champion.id].join('/')}`)
    .join(' | ');

  throw new Error(
    `Database mapping mangler for ${errors.join(' | ')}. ` +
      `DB factions: ${availableFactionNames}. ` +
      `DB champions: ${availableChampionNames}. ` +
      `Forventede faction aliases: ${expectedFactionAliases}. ` +
      `Forventede champion aliases: ${expectedChampionAliases}.`,
  );
}

async function getFactionMaps() {
  const factionsResult = await supabase.from('factions').select('id, name');

  if (factionsResult.error) {
    throw new Error(`Kunne ikke hente factions: ${factionsResult.error.message}`);
  }

  const dbFactionIdByGameId = new Map<FactionId, string>();
  const gameFactionIdByDbId = new Map<string, FactionId>();
  const availableDbFactionNames: string[] = [];

  (factionsResult.data as FactionRow[] | null)?.forEach((row) => {
    const name = row.name ?? '';
    availableDbFactionNames.push(name || `[null] ${row.id}`);
    const gameFactionId = toGameFactionId(name);

    if (!gameFactionId) {
      return;
    }

    dbFactionIdByGameId.set(gameFactionId, row.id);
    gameFactionIdByDbId.set(row.id, gameFactionId);
  });

  return {
    dbFactionIdByGameId,
    gameFactionIdByDbId,
    availableDbFactionNames,
  };
}

async function getChampionMaps() {
  const championsResult = await supabase.from('champions').select('id, name');

  if (championsResult.error) {
    throw new Error(`Kunne ikke hente champions: ${championsResult.error.message}`);
  }

  const dbChampionIdByGameId = new Map<string, string>();
  const gameChampionIdByDbId = new Map<string, string>();
  const availableDbChampionNames: string[] = [];

  (championsResult.data as ChampionRow[] | null)?.forEach((row) => {
    const name = row.name ?? '';
    availableDbChampionNames.push(name || `[null] ${row.id}`);
    const gameChampionId = toGameChampionId(name);

    if (!gameChampionId) {
      return;
    }

    dbChampionIdByGameId.set(gameChampionId, row.id);
    gameChampionIdByDbId.set(row.id, gameChampionId);
  });

  return {
    dbChampionIdByGameId,
    gameChampionIdByDbId,
    availableDbChampionNames,
  };
}

function isGameResourceId(value: string): value is ResourceId {
  return gameResourceIds.includes(value as ResourceId);
}

function isFactionId(value: string): value is FactionId {
  return factionDefinitions.some((faction) => faction.id === value);
}

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
