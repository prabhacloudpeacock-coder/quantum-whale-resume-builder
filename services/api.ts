import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { ResumeData } from '../types';

/**
 * BACKEND SERVICE API
 * Mimics a server-side API for resume data management.
 */
export const ResumeService = {
  /**
   * Fetches all resumes from the backend
   */
  async getAll(): Promise<ResumeData[]> {
    if (!isSupabaseConfigured()) return [];
    
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('lastModified', { ascending: false });

    if (error) {
      console.error('[Backend] Fetch Error:', error);
      throw new Error(error.message);
    }

    return data as ResumeData[];
  },

  /**
   * Saves or updates a resume in the database
   */
  async upsert(resume: ResumeData): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabase();
    // Ensure lastModified is updated on server-side sync
    const payload = { 
      ...resume, 
      lastModified: new Date().toLocaleDateString() 
    };

    const { error } = await supabase
      .from('resumes')
      .upsert(payload);

    if (error) {
      console.error('[Backend] Save Error:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Deletes a resume from the database
   */
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabase();
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Backend] Delete Error:', error);
      throw new Error(error.message);
    }
  }
};