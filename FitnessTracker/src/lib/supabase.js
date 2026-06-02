import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// 🌐 Environment Web Guard: Forces the server compiler to skip missing .wasm modules
const safeLocalStorage = typeof window !== 'undefined' 
  ? window.localStorage 
  : { getItem: () => null, setItem: () => null, removeItem: () => null };

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: safeLocalStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);