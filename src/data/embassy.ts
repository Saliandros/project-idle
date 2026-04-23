import { EmbassyResourceOption, FactionId } from '../types/game';

export const embassyResourceOptions: EmbassyResourceOption[] = [
  { id: 'meat', label: 'Meat', exchangeAmount: 10, goldYield: 1 },
  { id: 'iron', label: 'Iron', exchangeAmount: 10, goldYield: 1 },
];

export const embassyUnlockOrder: FactionId[] = [
  'human',
  'lizardman',
  'elves',
];
