import { useState, useEffect, useCallback, useRef } from 'react';
import { ResumeData } from '../types';
import { ResumeService } from '../services/api';
import { isSupabaseConfigured } from '../lib/supabase';

export type SyncStatus = 'idle' | 'fetching' | 'syncing' | 'synced' | 'error';

export function usePersistence(initialData: ResumeData[]) {
  const [resumes, setResumes] = useState<ResumeData[]>(initialData);
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to resolve namespace error in browser environment
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial fetch from "Backend"
  const fetchAll = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    
    setStatus('fetching');
    try {
      const data = await ResumeService.getAll();
      if (data && data.length > 0) {
        setResumes(data);
      }
      setStatus('synced');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /**
   * Updates local state immediately (Frontend)
   * Then debounces the sync to the Backend
   */
  const updateResume = useCallback((id: string, updates: Partial<ResumeData>) => {
    setResumes(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      const target = updated.find(r => r.id === id);
      
      if (target) {
        // Clear existing timeout
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        // Debounce sync to "Backend"
        setStatus('syncing');
        saveTimeoutRef.current = setTimeout(async () => {
          try {
            await ResumeService.upsert(target);
            setStatus('synced');
          } catch (err: any) {
            console.error('Sync failed:', err);
            setStatus('error');
            setError(err.message);
          }
        }, 1000); // 1s debounce
      }
      
      return updated;
    });
  }, []);

  /**
   * Handles deletion in both local state and backend
   */
  const deleteResume = useCallback(async (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    try {
      await ResumeService.delete(id);
    } catch (err: any) {
      console.error('Remote delete failed:', err);
      setError(err.message);
    }
  }, []);

  /**
   * Local-only addition, then sync
   */
  const addResume = useCallback(async (newResume: ResumeData) => {
    setResumes(prev => [newResume, ...prev]);
    setStatus('syncing');
    try {
      await ResumeService.upsert(newResume);
      setStatus('synced');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  return {
    resumes,
    status,
    error,
    updateResume,
    deleteResume,
    addResume,
    refresh: fetchAll
  };
}
