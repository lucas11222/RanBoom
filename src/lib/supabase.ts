import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createSupabaseClient(
    import.meta.env.SUPABASE_URL!,
    import.meta.env.SUPABASE_ANON_KEY!
  )
}

