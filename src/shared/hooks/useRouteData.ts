import { useEffect, useState, useCallback } from 'react';
import { getCache, setCache } from '@/shared/lib/resourceCache';

interface UseRouteDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for fetching and caching per-route data.
 * Supports cache hits and refresh-on-demand.
 */
export function useRouteData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
): UseRouteDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      setCache(cacheKey, result);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetchFn]);

  useEffect(() => {
    // Try cache first
    const cached = getCache<T>(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Otherwise fetch
    refresh();
  }, [cacheKey, refresh]);

  return { data, loading, error, refresh };
}
