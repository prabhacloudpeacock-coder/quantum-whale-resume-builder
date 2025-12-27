import { useState } from 'react';

export type PersistenceItem = { id: string } & Record<string, any>;

export function usePersistence<T extends PersistenceItem>(initial: T[]) {
  const [resumes, setResumes] = useState<T[]>(initial);
  const status: 'synced' | 'loading' | 'error' = 'synced';

  const updateResume = (id: string, fields: Partial<T>) => {
    setResumes(prev => prev.map(r => (r.id === id ? { ...r, ...fields } : r)));
  };

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  const addResume = (resume: T) => {
    setResumes(prev => [resume, ...prev]);
  };

  return { resumes, status, updateResume, deleteResume, addResume };
}
