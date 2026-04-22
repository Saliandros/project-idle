import { create } from 'zustand';

import { embassyResourceOptions } from '../data/embassy';
import { factionDefinitions } from '../data/factions';
import { GameState, ResourceId } from '../types/game';

type GameStore = GameState & {
  exchangeResource: (resourceId: ResourceId, amount: number) => boolean;
  performClick: () => void;
  setActiveFaction: (factionId: GameState['activeFactionId']) => void;
  setResource: (resourceId: ResourceId, value: number) => void;
};

const initialState: GameState = {
  activeFactionId: 'lizardman',
  unlockedFactionIds: ['lizardman'],
  championLevels: {
    saliandros: 0,
    kroxigar: 0,
  },
  resources: {
    clicks: 0,
    gold: 0,
    iron: 0,
    meat: 0,
  },
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  exchangeResource: (resourceId, amount) => {
    let didExchange = false;

    set((state) => {
      const option = embassyResourceOptions.find((entry) => entry.id === resourceId);
      const safeAmount = Math.max(0, Math.floor(amount));
      const exchangeCount = option ? Math.floor(safeAmount / option.exchangeAmount) : 0;
      const resourceCost = option ? exchangeCount * option.exchangeAmount : 0;

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
          gold: state.resources.gold + exchangeCount * option.goldYield,
        },
      };
    });

    return didExchange;
  },
  performClick: () =>
    set((state) => {
      const activeFaction =
        factionDefinitions.find((faction) => faction.id === state.activeFactionId) ??
        factionDefinitions[0];

      return {
        resources: {
          ...state.resources,
          [activeFaction.clickResourceId]:
            state.resources[activeFaction.clickResourceId] + activeFaction.clickValue,
        },
      };
    }),
  setActiveFaction: (factionId) =>
    set(() => ({
      activeFactionId: factionId,
    })),
  setResource: (resourceId, value) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [resourceId]: value,
      },
    })),
}));
