import 'react-native-url-polyfill'
import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install';

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY,
    {
        auth: {
            storage: localStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
)