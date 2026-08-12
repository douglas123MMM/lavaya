import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.warn('EXPO_PUBLIC_SUPABASE_ANON_KEY no esta configurada. Usa .env.local para desarrollo.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'lavaya-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
