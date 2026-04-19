export type ThemeColors = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
};

export type ResourceType = 'gold' | 'wood' | 'iron';

export type Profile = {
  id: string;
  username: string | null;
  income: number;
  created_at: string | null;
};

export type Resource = {
  id: string;
  profile_id: string;
  type: ResourceType;
  amount: number;
};

export type Faction = {
  id: string;
  name: string | null;
};

export type Minigame = {
  id: string;
  name: string | null;
  difficulty: number | null;
};

export type Champion = {
  id: string;
  name: string | null;
  faction_id: string | null;
  base_income: number | null;
};

export type ProfileFaction = {
  id: string;
  profile_id: string;
  faction_id: string;
  unlocked: boolean | null;
  progress: Record<string, unknown> | null;
};

export type ProfileChampion = {
  id: string;
  profile_id: string;
  champion_id: string;
  level: number;
};

export type ChampionMinigame = {
  champion_id: string;
  minigame_id: string;
};

export type TestUser = {
  id: string | number;
  created_at: string | null;
  username: string;
  firstname?: string;
  lastname?: string;
  income?: number;
};