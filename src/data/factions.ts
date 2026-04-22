import { AppRoute } from '../constants/routes';
import { FactionDefinition } from '../types/game';

export const factionDefinitions: FactionDefinition[] = [
  {
    id: 'lizardman',
    label: 'Lizardmen',
    clickResourceId: 'meat',
    clickValue: 1,
    lockedName: 'The Lizardmen',
    route: AppRoute.Champions,
  },
  {
    id: 'human',
    label: 'Humans',
    clickResourceId: 'clicks',
    clickValue: 1,
    lockedName: 'The Humans',
    route: null,
  },
  {
    id: 'elves',
    label: 'Elves',
    clickResourceId: 'clicks',
    clickValue: 1,
    lockedName: 'The Elves',
    route: null,
  },
];
