/**
 * Simple in-memory cache for per-route data fetching.
 * Supports cache invalidation by key.
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > MAX_AGE_MS) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(key: string): void {
  cache.delete(key);
}

export function clearAllCache(): void {
  cache.clear();
}
