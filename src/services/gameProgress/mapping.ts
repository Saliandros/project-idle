import { championDefinitions } from '../../data/champions';
import { factionDefinitions } from '../../data/factions';
import { FactionId } from '../../types/game';
import { supabase } from '../supabase';
import { ChampionMaps, ChampionRow, FactionMaps, FactionRow } from './types';

function normalizeLookupValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

const legacyFactionAliases: Record<FactionId, string[]> = {
  lizardman: ['Lizardmen', 'Lizardman', 'The Lizardmen'],
  human: ['Humen', 'Human', 'Humans', 'The Humen', 'The Humans'],
  elves: ['Elves', 'Elve', 'The Elves'],
};

const legacyChampionAliases: Record<string, string[]> = {
  saliandros: ['Saliandros'],
  kroxigar: ['Kroxigar'],
};

const factionNameAliases = factionDefinitions.reduce<Record<FactionId, string[]>>((aliases, faction) => {
  const singularLabel = faction.label.endsWith('s') ? faction.label.slice(0, -1) : faction.label;
  const lockedNameWithoutArticle = faction.lockedName.replace(/^the\s+/i, '');

  aliases[faction.id] = [
    faction.id,
    faction.label,
    singularLabel,
    faction.lockedName,
    lockedNameWithoutArticle,
    ...(legacyFactionAliases[faction.id] ?? []),
  ];

  return aliases;
}, {} as Record<FactionId, string[]>);

const championNameAliases = championDefinitions.reduce<Record<string, string[]>>((aliases, champion) => {
  aliases[champion.id] = [champion.id, champion.name, ...(legacyChampionAliases[champion.id] ?? [])];
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

function getMissingFactionMappings(dbFactionIdByGameId: Map<FactionId, string>) {
  return factionDefinitions
    .map((faction) => faction.id)
    .filter((factionId) => !dbFactionIdByGameId.has(factionId));
}

function getMissingChampionMappings(dbChampionIdByGameId: Map<string, string>) {
  return championDefinitions
    .map((champion) => champion.id)
    .filter((championId) => !dbChampionIdByGameId.has(championId));
}

function assertLookupTablesAvailable(factionMaps: FactionMaps, championMaps: ChampionMaps) {
  const hasNoFactionRows = factionMaps.availableDbFactionNames.length === 0;
  const hasNoChampionRows = championMaps.availableDbChampionNames.length === 0;

  if (!hasNoFactionRows && !hasNoChampionRows) {
    return;
  }

  const errors: string[] = [];

  if (hasNoFactionRows) {
    errors.push(
      'Tabellen public.factions returnerede 0 raekker for den aktuelle session. ' +
        'Det skyldes naesten altid enten manglende seed-data eller RLS/policies, der skjuler raekkerne.',
    );
  }

  if (hasNoChampionRows) {
    errors.push(
      'Tabellen public.champions returnerede 0 raekker for den aktuelle session. ' +
        'Det skyldes naesten altid enten manglende seed-data eller RLS/policies, der skjuler raekkerne.',
    );
  }

  throw new Error(errors.join(' '));
}

export function assertCompleteMappings(factionMaps: FactionMaps, championMaps: ChampionMaps) {
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
    : '[ingen raekker fundet]';
  const availableChampionNames = championMaps.availableDbChampionNames.length
    ? championMaps.availableDbChampionNames.join(', ')
    : '[ingen raekker fundet]';
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

export async function getFactionMaps(): Promise<FactionMaps> {
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

export async function getChampionMaps(): Promise<ChampionMaps> {
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
