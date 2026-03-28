import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = !!(url && key);

/**
 * Singleton Supabase client.
 *
 * Security notes:
 * - Uses the anon (publishable) key — never the service role key.
 * - `persistSession: false` → Supabase will NOT touch localStorage for auth state.
 *   Our app tracks identity via sessionStorage only.
 * - `autoRefreshToken: false` → no background token-refresh calls.
 * - `detectSessionInUrl: false` → no OAuth callback parsing.
 * - All requests are scoped to the `anon` Postgres role; RLS enforces row-level access.
 */
export const supabase = createClient(url || "https://placeholder.supabase.co", key || "placeholder", {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
