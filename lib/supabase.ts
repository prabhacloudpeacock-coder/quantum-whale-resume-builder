import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  return supabase
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}

export function updateSupabaseConfig(url: string, anonKey: string) {
  if (!url || !anonKey) return
  supabase = createClient(url, anonKey)
}

export function getStoredProjectInfo() {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  }
}

export function updateProjectInfo(
  supabaseUrl: string,
  supabaseAnonKey: string
) {
  updateSupabaseConfig(supabaseUrl, supabaseAnonKey)
}

// Auto-init if env vars exist
if (isSupabaseConfigured()) {
  updateSupabaseConfig(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}
