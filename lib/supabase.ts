import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Quantum Whale Supabase Configuration
 */

let supabaseInstance: SupabaseClient<any> | null = null;

const getStoredUrl = () => 
  localStorage.getItem('QW_SUPABASE_URL') || 
  (window as any).process?.env?.SUPABASE_URL || 
  '';

const getStoredKey = () => 
  localStorage.getItem('QW_SUPABASE_KEY') || 
  (window as any).process?.env?.SUPABASE_ANON_KEY || 
  '';

export const getSupabase = (): SupabaseClient<any> => {
    const url = getStoredUrl();
    const key = getStoredKey();

    if (!supabaseInstance && url && key) {
        supabaseInstance = createClient(url, key, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storageKey: 'quantum-whale-auth-token'
            }
        });
    }

    if (!supabaseInstance) {
        return createClient('https://placeholder.supabase.co', 'dummy-key');
    }

    return supabaseInstance;
};

export const isSupabaseConfigured = () => {
    const url = getStoredUrl();
    const key = getStoredKey();
    return url && 
           key && 
           url.startsWith('https://') && 
           url.includes('.supabase.co') &&
           key.length > 20;
};

export const updateSupabaseConfig = (url: string, key: string) => {
    if (!url || !key) return;
    localStorage.setItem('QW_SUPABASE_URL', url.trim());
    localStorage.setItem('QW_SUPABASE_KEY', key.trim());
    supabaseInstance = null;
};

export const getStoredProjectInfo = () => ({
    name: localStorage.getItem('QW_PROJECT_NAME') || 'Quantum Whale',
    id: localStorage.getItem('QW_PROJECT_ID') || 'quantumwhale-main'
});

export const updateProjectInfo = (name: string, id: string) => {
    localStorage.setItem('QW_PROJECT_NAME', name);
    localStorage.setItem('QW_PROJECT_ID', id);
};