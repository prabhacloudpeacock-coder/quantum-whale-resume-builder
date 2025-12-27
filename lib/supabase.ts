import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface ProjectInfo {
  id: string
  name: string
  supabaseUrl: string
  supabaseAnonKey: string
}

let supabase: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}

export function getSupabase(): SupabaseClient | null {
  return supabase
}

export function updateSupabaseConfig(url: string, anonKey: string) {
  supabase = createClient(url, anonKey)
}

export function getStoredProjectInfo(): ProjectInfo {
  return {
    id: 'quantum-whale',
    name: 'Quantum Whale Resume Builder',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  }
}

export function updateProjectInfo(
  supabaseUrl: string,
  supabaseAnonKey: string
) {
  updateSupabaseConfig(supabaseUrl, supabaseAnonKey)
}

if (isSupabaseConfigured()) {
  updateSupabaseConfig(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
}

