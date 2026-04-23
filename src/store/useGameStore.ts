import { create } from 'zustand';

import { championDefinitions } from '../data/champions';
import { embassyResourceOptions } from '../data/embassy';
import { factionDefinitions } from '../data/factions';
import { GameState, ResourceId } from '../types/game';
import { toRawResourceAmount } from '../utils/resources';

type GameStore = GameState & {
  applyIdleTick: (seconds: number) => void;
  exchangeResource: (resourceId: ResourceId, amount: number) => boolean;
  hydrateGameState: (state: Partial<GameState>) => void;
  performClick: () => void;
  resetGameState: () => void;
  unlockFaction: (factionId: GameState['activeFactionId']) => boolean;
  upgradeChampion: (championId: string) => boolean;
  setActiveFaction: (factionId: GameState['activeFactionId']) => void;
  setResource: (resourceId: ResourceId, value: number) => void;
};

const CHAMPION_COST_MULTIPLIER = 1.5;

function getChampionProductionPerSecond(championId: string, level: number) {
  const champion = championDefinitions.find((entry) => entry.id === championId);

  if (!champion || level <= 0) {
    return null;
  }

  return {
    resourceId: champion.productionResourceId,
    amountPerSecond:
      champion.baseProductionPerSecond +
      champion.productionScalingPerLevel * (level - 1),
  };
}

function createInitialState(): GameState {
  return {
    activeFactionId: 'lizardman',
    unlockedFactionIds: ['lizardman'],
    championLevels: {
      saliandros: 0,
      kroxigar: 0,
    },
    resources: {
      clicks: 0,
      gold: 0,
      iron: toRawResourceAmount('iron', 50),
      meat: 0,
    },
  };
}

const initialState = createInitialState();

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  applyIdleTick: (seconds) =>
    set((state) => {
      if (seconds <= 0) {
        return state;
      }

      const nextResources = { ...state.resources };
      let hasProduction = false;

      Object.entries(state.championLevels).forEach(([championId, level]) => {
        const production = getChampionProductionPerSecond(championId, level);

        if (!production) {
          return;
        }

        hasProduction = true;
        nextResources[production.resourceId] += toRawResourceAmount(
          production.resourceId,
          production.amountPerSecond * seconds,
        );
      });

      if (!hasProduction) {
        return state;
      }

      return {
        resources: nextResources,
      };
    }),
  exchangeResource: (resourceId, amount) => {
    let didExchange = false;

    set((state) => {
      const option = embassyResourceOptions.find((entry) => entry.id === resourceId);
      const safeAmount = Math.max(0, Math.floor(amount));
      const exchangeCount = option ? Math.floor(safeAmount / option.exchangeAmount) : 0;
      const resourceCost = option
        ? toRawResourceAmount(resourceId, exchangeCount * option.exchangeAmount)
        : 0;

      if (
        !option ||
        resourceId === 'gold' ||
        exchangeCount <= 0 ||
        state.resources[resourceId] < resourceCost
      ) {
        return state;
      }

      didExchange = true;

      return {
        resources: {
          ...state.resources,
          [resourceId]: state.resources[resourceId] - resourceCost,
          gold:
            state.resources.gold + toRawResourceAmount('gold', exchangeCount * option.goldYield),
        },
      };
    });

    return didExchange;
  },
  hydrateGameState: (nextState) =>
    set((state) => ({
      activeFactionId: nextState.activeFactionId ?? state.activeFactionId,
      unlockedFactionIds: nextState.unlockedFactionIds ?? state.unlockedFactionIds,
      championLevels: nextState.championLevels
        ? { ...state.championLevels, ...nextState.championLevels }
        : state.championLevels,
      resources: nextState.resources
        ? { ...state.resources, ...nextState.resources }
        : state.resources,
    })),
  performClick: () =>
    set((state) => {
      const activeFaction =
        factionDefinitions.find((faction) => faction.id === state.activeFactionId) ??
        factionDefinitions[0];

      return {
        resources: {
          ...state.resources,
          [activeFaction.clickResourceId]:
            state.resources[activeFaction.clickResourceId] +
            toRawResourceAmount(activeFaction.clickResourceId, activeFaction.clickValue),
        },
      };
    }),
  upgradeChampion: (championId) => {
    let didUpgrade = false;

    set((state) => {
      const champion = championDefinitions.find((entry) => entry.id === championId);

      if (!champion) {
        return state;
      }

      const currentLevel = state.championLevels[championId] ?? 0;
      const nextCost = Math.round(
        champion.baseCost * Math.pow(CHAMPION_COST_MULTIPLIER, currentLevel),
      );
      const nextCostRaw = toRawResourceAmount(champion.costResourceId, nextCost);

      if (state.resources[champion.costResourceId] < nextCostRaw) {
        return state;
      }

      didUpgrade = true;

      return {
        championLevels: {
          ...state.championLevels,
          [championId]: currentLevel + 1,
        },
        resources: {
          ...state.resources,
          [champion.costResourceId]: state.resources[champion.costResourceId] - nextCostRaw,
        },
      };
    });

    return didUpgrade;
  },
  setActiveFaction: (factionId) =>
    set(() => ({
      activeFactionId: factionId,
    })),
  setResource: (resourceId, value) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceId]: toRawResourceAmount(resourceId, value),
      },
    })),
  resetGameState: () => set(() => createInitialState()),
  unlockFaction: (factionId) => {
    let didUnlock = false;

    set((state) => {
      const faction = factionDefinitions.find((entry) => entry.id === factionId);

      if (!faction || state.unlockedFactionIds.includes(factionId)) {
        return state;
      }

      const unlockCostRaw = toRawResourceAmount('gold', faction.unlockCostGold);

      if (state.resources.gold < unlockCostRaw) {
        return state;
      }

      didUnlock = true;

      return {
        unlockedFactionIds: [...state.unlockedFactionIds, factionId],
        resources: {
          ...state.resources,
          gold: state.resources.gold - unlockCostRaw,
        },
      };
    });

    return didUnlock;
  },
}));
