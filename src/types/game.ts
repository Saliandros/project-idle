import { AppRoute } from '../constants/routes';

export type FactionId = 'lizardman' | 'human' | 'elves';

export type ResourceId = 'clicks' | 'gold' | 'meat' | 'iron';

export type ResourceState = Record<ResourceId, number>;

export type EmbassyResourceOption = {
  id: ResourceId;
  label: string;
  exchangeAmount: number;
  goldYield: number;
};

export type FactionDefinition = {
  id: FactionId;
  label: string;
  clickResourceId: ResourceId;
  clickValue: number;
  lockedName: string;
  route: AppRoute | null;
};

export type ChampionDefinition = {
  id: string;
  factionId: FactionId;
  name: string;
  costResourceId: ResourceId;
  baseCost: number;
  productionResourceId: ResourceId;
  baseProductionPerSecond: number;
  productionScalingPerLevel: number;
  previewImage?: number;
};

export type GameState = {
  activeFactionId: FactionId;
  unlockedFactionIds: FactionId[];
  championLevels: Record<string, number>;
  resources: ResourceState;
};
