import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// --- Supabase Credentials ---
// The following credentials have been hardcoded to resolve the setup issue.
// For production environments, it is strongly recommended to use environment variables 
// to ensure your keys are not exposed in the client-side code.
export const supabaseUrl: string | undefined = 'https://onkwfruejsifzolsnhve.supabase.co';
const supabaseAnonKey: string | undefined = 'sb_publishable_2CJJm-cjT2JLnj5P1nstMA_u9a78sUp'; // This is the public 'anon' key

let supabase: SupabaseClient | null = null;
let supabaseError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  // This case should not be reached with hardcoded values, but serves as a safeguard.
  supabaseError = 'Supabase URL or Anon Key is missing in the configuration.';
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e: any) {
    supabaseError = `Failed to initialize Supabase client: ${e.message}`;
  }
}

export { supabase, supabaseError };
