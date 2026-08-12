import { createClient } from '@supabase/supabase-js';

// Funciona tanto en Expo (EXPO_PUBLIC_*) como en Next.js (NEXT_PUBLIC_*)
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'lavaya-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});