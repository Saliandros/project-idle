import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

type ProcessEnv = {
  EXPO_PUBLIC_SUPABASE_URL?: string;
  EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
};

const env = (globalThis as { process?: { env?: ProcessEnv } }).process?.env;

const supabaseUrl = env?.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env?.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Tillad import selv uden env-variabler; fejl kommer når servicen bruges
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
