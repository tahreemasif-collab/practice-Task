import { useRef, useState, useCallback } from 'react';
import { retrieveManual } from '../data/manuals.js';

export function useManualCache() {
  const cacheRef = useRef(new Map());
  const [stats, setStats] = useState({ hits: 0, lookups: 0 });

  const search = useCallback((query) => {
    const key = query.trim().toLowerCase();
    if (!key) return { result: null, cached: false };
    const cached = cacheRef.current.has(key);
    const result = cached ? cacheRef.current.get(key) : retrieveManual(query);
    if (!cached) cacheRef.current.set(key, result);
    setStats((s) => ({ hits: s.hits + (cached ? 1 : 0), lookups: s.lookups + 1 }));
    return { result, cached };
  }, []);

  return { search, stats };
}
