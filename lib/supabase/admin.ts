import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

/**
 * Service-role Supabase client.
 *
 * Bypasses Row Level Security. Must ONLY be used from trusted
 * server-side code paths where the caller has already been
 * authenticated + authorized via the user client.
 *
 * Never expose this client to the browser or return data from it
 * without re-checking the user's identity.
 *
 * Used by:
 *   - /api/explain  → writing the ai_explanations cache after RLS
 *                     was tightened in migration 006 to block
 *                     authenticated-role writes (cache poisoning).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'createAdminClient: SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL must be set'
    )
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
