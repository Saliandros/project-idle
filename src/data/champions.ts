import { ChampionDefinition } from '../types/game';

export const championDefinitions: ChampionDefinition[] = [
  {
    id: 'saliandros',
    factionId: 'lizardman',
    name: 'Saliandros',
    costResourceId: 'meat',
    costAmount: 25,
    previewImage: require('../../assets/images/Factions/Lizardman/Saliandros.png'),
  },
  {
    id: 'kroxigar',
    factionId: 'lizardman',
    name: 'Kroxigar',
    costResourceId: 'meat',
    costAmount: 500,
  },
];
