import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

/**
 * Server-only Supabase client using the Secret key (Admin privileges, bypasses RLS).
 * Strictly protected by the 'server-only' package to ensure it cannot be bundled into client components.
 * 
 * Never expose SUPABASE_SECRET_KEY to the browser or through NEXT_PUBLIC_ variables.
 */
export function getServiceSupabase() {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      'Missing Supabase server credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in your environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
