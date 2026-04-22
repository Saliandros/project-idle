import { ResourceId } from '../types/game';

const resourcePrecision: Record<ResourceId, number> = {
  clicks: 1,
  gold: 1,
  iron: 10,
  meat: 10,
};

export function getResourcePrecision(resourceId: ResourceId) {
  return resourcePrecision[resourceId];
}

export function toRawResourceAmount(resourceId: ResourceId, amount: number) {
  return Math.round(amount * getResourcePrecision(resourceId));
}

export function fromRawResourceAmount(resourceId: ResourceId, amount: number) {
  return amount / getResourcePrecision(resourceId);
}
