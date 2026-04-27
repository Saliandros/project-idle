import { FactionDefinition } from '../types/game';

export const factionDefinitions: FactionDefinition[] = [
  {
    id: 'lizardman',
    label: 'Lizardmen',
    clickResourceId: 'meat',
    clickValue: 1,
    lockedName: 'The Lizardmen',
    unlockCostGold: 0,
    route: '/(tabs)/stronghold',
  },
  {
    id: 'human',
    label: 'Humans',
    clickResourceId: 'clicks',
    clickValue: 1,
    lockedName: 'The Humans',
    unlockCostGold: 5,
    route: null,
  },
  {
    id: 'elves',
    label: 'Elves',
    clickResourceId: 'clicks',
    clickValue: 1,
    lockedName: 'The Elves',
    unlockCostGold: 5,
    route: null,
  },
];
