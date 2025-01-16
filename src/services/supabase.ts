import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://znxnhvrkxjguwiybqtjr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueG5odnJreGpndXdpeWJxdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5ODkzNjcsImV4cCI6MjA1MjU2NTM2N30.rfWbrN1nyvPGlXUk-76hO9v5RC9kByOUH2jZpkpxH7o';

const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'website-analyzer',
        'apikey': supabaseKey
      }
    }
  }
);

export const supabase = supabaseClient;