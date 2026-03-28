/**
 * Server-only Supabase client using the service role key.
 * NEVER import this in client components — it bypasses RLS.
 * Only used in API routes (src/app/api/**).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServerSupabaseReady = !!(url && serviceKey);

export const supabaseServer = createClient(
  url || "https://placeholder.supabase.co",
  serviceKey || "placeholder",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
