import { AppRoute } from '../constants/routes';
import { FactionDefinition } from '../types/game';

export const factionDefinitions: FactionDefinition[] = [
  {
    id: 'lizardman',
    label: 'Lizardmen',
    clickResourceId: 'meat',
    clickValue: 1,
    lockedName: 'The Lizardmen',
    unlockCostGold: 0,
    route: AppRoute.Champions,
  },
  {
    id: 'human',
    label: 'Humen',
    clickResourceId: 'clicks',
    clickValue: 1,
    lockedName: 'The Humen',
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
