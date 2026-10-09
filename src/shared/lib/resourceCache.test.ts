import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAllCache, getCache, invalidateCache, invalidateCacheByPrefix, setCache } from './resourceCache';

describe('invalidateCacheByPrefix', () => {
  afterEach(() => clearAllCache());

  it('evicts every key starting with the prefix and keeps the others', () => {
    setCache('ranking:2026-3', [1]);
    setCache('ranking:2026-4', [2]);
    setCache('userBadges', [3]);

    invalidateCacheByPrefix('ranking:');

    expect(getCache('ranking:2026-3')).toBeNull();
    expect(getCache('ranking:2026-4')).toBeNull();
    expect(getCache('userBadges')).toEqual([3]);
  });
});

describe('resourceCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearAllCache();
  });

  afterEach(() => {
    clearAllCache();
    vi.useRealTimers();
  });

  describe('getCache', () => {
    it('returns null for a key that was never set (cache miss)', () => {
      expect(getCache('missing-key')).toBeNull();
    });

    it('returns the exact stored value for a key that was set (cache hit)', () => {
      setCache('badges', [{ id: 'badge-1' }]);

      expect(getCache('badges')).toEqual([{ id: 'badge-1' }]);
    });

    it('returns the same primitive value that was stored', () => {
      setCache('count', 42);

      expect(getCache('count')).toBe(42);
    });

    it('returns null and evicts the entry once the 5-minute TTL has elapsed', () => {
      setCache('users', ['ana']);

      vi.advanceTimersByTime(5 * 60 * 1000 + 1);

      expect(getCache('users')).toBeNull();
    });

    it('still returns the value at exactly the TTL boundary (age not yet greater than max)', () => {
      setCache('users', ['ana']);

      vi.advanceTimersByTime(5 * 60 * 1000);

      expect(getCache('users')).toEqual(['ana']);
    });

    it('returns the value just before the TTL expires', () => {
      setCache('units', ['unit-a']);

      vi.advanceTimersByTime(5 * 60 * 1000 - 1);

      expect(getCache('units')).toEqual(['unit-a']);
    });

    it('evicting an expired entry removes it so a later getCache call still misses', () => {
      setCache('stale', 'value');
      vi.advanceTimersByTime(5 * 60 * 1000 + 1);

      // First call triggers eviction.
      expect(getCache('stale')).toBeNull();
      // Second call confirms the entry is actually gone, not just expired-but-present.
      expect(getCache('stale')).toBeNull();
    });
  });

  describe('setCache', () => {
    it('overwrites a previous value stored under the same key', () => {
      setCache('profile', { name: 'Ana' });
      setCache('profile', { name: 'Bruno' });

      expect(getCache('profile')).toEqual({ name: 'Bruno' });
    });

    it('resets the TTL clock when a key is overwritten', () => {
      setCache('refreshed', 'first');
      vi.advanceTimersByTime(4 * 60 * 1000); // 4 minutes in, still fresh
      setCache('refreshed', 'second');
      vi.advanceTimersByTime(4 * 60 * 1000); // another 4 minutes: 8 total, but only 4 since overwrite

      expect(getCache('refreshed')).toBe('second');
    });

    it('stores independent values for different keys', () => {
      setCache('key-a', 'value-a');
      setCache('key-b', 'value-b');

      expect(getCache('key-a')).toBe('value-a');
      expect(getCache('key-b')).toBe('value-b');
    });
  });

  describe('invalidateCache', () => {
    it('removes the specified key so getCache reports a miss afterward', () => {
      setCache('badges', ['badge-1']);

      invalidateCache('badges');

      expect(getCache('badges')).toBeNull();
    });

    it('does not affect other keys in the cache', () => {
      setCache('badges', ['badge-1']);
      setCache('units', ['unit-1']);

      invalidateCache('badges');

      expect(getCache('badges')).toBeNull();
      expect(getCache('units')).toEqual(['unit-1']);
    });

    it('is a no-op when the key does not exist', () => {
      expect(() => invalidateCache('never-set')).not.toThrow();
      expect(getCache('never-set')).toBeNull();
    });
  });

  describe('clearAllCache', () => {
    it('removes every entry regardless of key', () => {
      setCache('a', 1);
      setCache('b', 2);
      setCache('c', 3);

      clearAllCache();

      expect(getCache('a')).toBeNull();
      expect(getCache('b')).toBeNull();
      expect(getCache('c')).toBeNull();
    });

    it('is a no-op on an already-empty cache', () => {
      expect(() => clearAllCache()).not.toThrow();
    });
  });
});
