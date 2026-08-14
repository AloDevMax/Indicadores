import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRouteData } from './useRouteData';
import { getCache, setCache } from '@/shared/lib/resourceCache';

vi.mock('@/shared/lib/resourceCache', () => ({
  getCache: vi.fn(),
  setCache: vi.fn(),
}));

const mockedGetCache = vi.mocked(getCache);
const mockedSetCache = vi.mocked(setCache);

describe('useRouteData', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('cache miss on mount', () => {
    it('starts with loading=true and calls fetchFn', async () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi.fn().mockResolvedValue({ id: 1 });

      const { result } = renderHook(() => useRouteData('badges', fetchFn));

      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('sets data, loading=false, error=null, and writes the cache on resolution', async () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi.fn().mockResolvedValue({ id: 1, name: 'Badge' });

      const { result } = renderHook(() => useRouteData('badges', fetchFn));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.data).toEqual({ id: 1, name: 'Badge' });
      expect(result.current.error).toBeNull();
      expect(mockedSetCache).toHaveBeenCalledWith('badges', { id: 1, name: 'Badge' });
    });
  });

  describe('cache hit on mount', () => {
    it('sets data from the cache immediately, loading=false, and never calls fetchFn', async () => {
      mockedGetCache.mockReturnValue({ id: 99, name: 'Cached Badge' });
      const fetchFn = vi.fn().mockResolvedValue({ id: 1, name: 'Fresh Badge' });

      const { result } = renderHook(() => useRouteData('badges', fetchFn));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.data).toEqual({ id: 99, name: 'Cached Badge' });
      expect(result.current.error).toBeNull();
      expect(fetchFn).not.toHaveBeenCalled();
    });
  });

  describe('cache miss on mount with rejecting fetchFn', () => {
    it('sets error to an Error with the rejection message, loading=false, data stays at initialValue', async () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi.fn().mockRejectedValue(new Error('network down'));

      const { result } = renderHook(() => useRouteData('badges', fetchFn, null));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('network down');
      expect(result.current.data).toBeNull();
    });

    it('wraps a non-Error rejection reason in an Error using its string representation', async () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi.fn().mockRejectedValue('plain string failure');

      const { result } = renderHook(() => useRouteData('badges', fetchFn));

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('plain string failure');
    });
  });

  describe('manual refresh', () => {
    it('re-invokes fetchFn and updates data/loading/error/cache after the initial mount settles', async () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi
        .fn()
        .mockResolvedValueOnce({ id: 1, name: 'First' })
        .mockResolvedValueOnce({ id: 2, name: 'Second' });

      const { result } = renderHook(() => useRouteData('badges', fetchFn));

      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.data).toEqual({ id: 1, name: 'First' });
      expect(fetchFn).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.refresh();
      });

      expect(fetchFn).toHaveBeenCalledTimes(2);
      expect(result.current.data).toEqual({ id: 2, name: 'Second' });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockedSetCache).toHaveBeenLastCalledWith('badges', { id: 2, name: 'Second' });
    });

    it('sets an error on refresh when fetchFn rejects, even though the initial mount succeeded', async () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi
        .fn()
        .mockResolvedValueOnce({ id: 1, name: 'First' })
        .mockRejectedValueOnce(new Error('refresh failed'));

      const { result } = renderHook(() => useRouteData('badges', fetchFn));

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('refresh failed');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('initialValue', () => {
    it('sets data to initialValue synchronously before the mount effect resolves', () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi.fn().mockResolvedValue({ id: 1 });
      const initialValue = { id: 0, name: 'Placeholder' };

      const { result } = renderHook(() => useRouteData('badges', fetchFn, initialValue));

      expect(result.current.data).toEqual({ id: 0, name: 'Placeholder' });
      expect(result.current.loading).toBe(true);
    });

    it('defaults data to null synchronously when no initialValue is passed', () => {
      mockedGetCache.mockReturnValue(null);
      const fetchFn = vi.fn().mockResolvedValue({ id: 1 });

      const { result } = renderHook(() => useRouteData('badges', fetchFn));

      expect(result.current.data).toBeNull();
    });
  });
});
