import { ChampionDefinition } from '../types/game';

export const championDefinitions: ChampionDefinition[] = [
  {
    id: 'saliandros',
    factionId: 'lizardman',
    name: 'Saliandros',
    costResourceId: 'meat',
    baseCost: 25,
    productionResourceId: 'meat',
    baseProductionPerSecond: 0.1,
    productionScalingPerLevel: 0.1,
    previewImage: require('../../assets/images/Factions/Lizardman/Saliandros.png'),
  },
  {
    id: 'kroxigar',
    factionId: 'lizardman',
    name: 'Kroxigar',
    costResourceId: 'meat',
    baseCost: 500,
    productionResourceId: 'meat',
    baseProductionPerSecond: 1,
    productionScalingPerLevel: 0.1,
  },
];
