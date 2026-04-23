import { supabase } from './supabase';
import { TestUser } from '../types';

type RegisterInput = {
  username: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
};

type ProfileRow = {
  id: string;
  created_at: string | null;
  username: string | null;
  income?: number | null;
};

function normalizeValue(value: string): string {
  return value.trim();
}

// Vi lader fortsat UI bruge "username" som login-felt.
// Hvis feltet ikke er en email, mapper vi den til en stabil pseudo-email til Supabase Auth.
function toAuthEmail(usernameOrEmail: string): string {
  const normalized = normalizeValue(usernameOrEmail).toLowerCase();

  if (normalized.includes('@')) {
    return normalized;
  }

  return `${normalized}@project-idle.local`;
}

function getLocalPartFromEmail(value: string): string {
  const normalized = normalizeValue(value).toLowerCase();
  const separatorIndex = normalized.indexOf('@');

  if (separatorIndex <= 0) {
    return '';
  }

  return normalized.slice(0, separatorIndex);
}

async function ensureProfile(profileId: string, username: string): Promise<void> {
  const { data: existingProfile, error: existingProfileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', profileId)
    .maybeSingle();

  if (existingProfileError) {
    throw new Error(`Kunne ikke hente profil til synkronisering: ${existingProfileError.message}`);
  }

  const existingUsername = normalizeValue(existingProfile?.username ?? '');

  if (existingUsername.length > 0) {
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: profileId, username }, { onConflict: 'id' });

  if (error) {
    throw new Error(`Kunne ikke oprette/vedligeholde profil: ${error.message}`);
  }
}

async function ensureDefaultResources(profileId: string): Promise<void> {
  const defaultTypes = ['gold', 'wood', 'iron', 'meat'] as const;

  const { data: existingRows, error: selectError } = await supabase
    .from('resources')
    .select('type')
    .eq('profile_id', profileId);

  if (selectError) {
    throw new Error(`Kunne ikke hente ressourcer: ${selectError.message}`);
  }

  const existingTypes = new Set((existingRows ?? []).map((row) => row.type));
  const rowsToInsert = defaultTypes
    .filter((type) => !existingTypes.has(type))
    .map((type) => ({ profile_id: profileId, type, amount: 0 }));

  if (!rowsToInsert.length) {
    return;
  }

  const { error: insertError } = await supabase.from('resources').insert(rowsToInsert);

  if (insertError) {
    throw new Error(`Kunne ikke initialisere ressourcer: ${insertError.message}`);
  }
}

async function ensureDefaultProfileFactions(profileId: string): Promise<void> {
  // Vi opretter profile_factions én gang per profil ved at skippe, hvis der allerede findes data.
  const { count, error: countError } = await supabase
    .from('profile_factions')
    .select('id', { count: 'exact', head: true })
    .eq('profile_id', profileId);

  if (countError) {
    throw new Error(`Kunne ikke tjekke profile_factions: ${countError.message}`);
  }

  if ((count ?? 0) > 0) {
    return;
  }

  const { data: factions, error: factionsError } = await supabase.from('factions').select('id');

  if (factionsError) {
    throw new Error(`Kunne ikke hente factions: ${factionsError.message}`);
  }

  if (!factions?.length) {
    return;
  }

  const rows = factions.map((faction) => ({
    profile_id: profileId,
    faction_id: faction.id,
    unlocked: false,
    progress: {},
  }));

  const { error: insertError } = await supabase.from('profile_factions').insert(rows);

  if (insertError) {
    throw new Error(`Kunne ikke initialisere profile_factions: ${insertError.message}`);
  }
}

async function getProfileAsUser(profileId: string): Promise<TestUser> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, created_at, username, income')
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    throw new Error(`Kunne ikke hente profil: ${error.message}`);
  }

  const row = data as ProfileRow | null;

  if (!row) {
    throw new Error('Profil blev ikke fundet for brugeren.');
  }

  return {
    id: row.id,
    created_at: row.created_at,
    username: row.username ?? '',
    income: row.income ?? 0,
  };
}

export async function registerUser(input: RegisterInput): Promise<TestUser> {
  const email = normalizeValue(input.email).toLowerCase();
  const username = normalizeValue(input.username).toLowerCase();
  const authEmail = toAuthEmail(username);
  const password = input.password;

  if (!email || !username || !password) {
    throw new Error('Udfyld venligst alle felter.');
  }

  // 1) Opret auth-bruger i Supabase Auth.
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: authEmail,
    password,
    options: {
      data: {
        display_name: username,
        username,
        email,
      },
    },
  });

  if (signUpError) {
    throw new Error(`Kunne ikke oprette auth-bruger: ${signUpError.message}`);
  }

  const userId = signUpData.user?.id;

  if (!userId) {
    throw new Error('Kunne ikke hente bruger-id efter registrering.');
  }

  // 2) Opret/synk profil i profiles.
  await ensureProfile(userId, username);

  // 3) Initialiser standard-spillerdata.
  await ensureDefaultResources(userId);
  await ensureDefaultProfileFactions(userId);

  // 4) Returner den profilform, resten af appen bruger.
  return getProfileAsUser(userId);
}

export async function loginUser(usernameInput: string, passwordInput: string): Promise<TestUser> {
  const username = normalizeValue(usernameInput).toLowerCase();
  const password = passwordInput;
  const email = toAuthEmail(username);

  if (!username || !password) {
    throw new Error('Udfyld venligst brugernavn og password.');
  }

  // Login sker mod Supabase Auth (ikke mod en users-tabel).
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    throw new Error(`Kunne ikke logge ind: ${signInError.message}`);
  }

  const userId = signInData.user?.id;

  if (!userId) {
    throw new Error('Login lykkedes, men bruger-id mangler.');
  }

  // Sikr at profil findes, hvis den mangler fra ældre dataflow.
  // Hvis login sker med email, bruger vi metadata-username for ikke at overskrive med email.
  const metadataUsername =
    typeof signInData.user?.user_metadata?.username === 'string'
      ? normalizeValue(signInData.user.user_metadata.username).toLowerCase()
      : '';
  const isEmailLogin = username.includes('@');
  const usernameFromEmail = isEmailLogin ? getLocalPartFromEmail(username) : '';
  const profileUsername = isEmailLogin ? metadataUsername || usernameFromEmail : username;

  if (profileUsername) {
    await ensureProfile(userId, profileUsername);
  }

  return getProfileAsUser(userId);
}

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Kunne ikke logge ud: ${error.message}`);
  }
}
