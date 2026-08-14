import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Badge, BadgeTone, Profile } from '@/shared/types';
import {
  awardBadgesWithApi,
  clearStoredAuthToken,
  deleteUserWithApi,
  fetchCurrentUser,
  getApiBaseUrl,
  getStoredAuthToken,
  loginWithApi,
  logoutWithApi,
  saveBadgeWithApi,
  storeAuthToken,
} from './api';

const jsonResponse = (body: unknown, init?: Partial<{ ok: boolean; status: number }>) => ({
  ok: init?.ok ?? true,
  status: init?.status ?? 200,
  json: async () => body,
});

describe('api.ts', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    sessionStorage.clear();
  });

  describe('getApiBaseUrl', () => {
    it('strips a trailing slash from VITE_API_BASE_URL', () => {
      vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:4004/');

      expect(getApiBaseUrl()).toBe('http://localhost:4004');
    });
  });

  describe('auth token storage', () => {
    it('round-trips a token through storeAuthToken / getStoredAuthToken / clearStoredAuthToken', () => {
      expect(getStoredAuthToken()).toBeNull();

      storeAuthToken('token-abc-123');
      expect(getStoredAuthToken()).toBe('token-abc-123');

      clearStoredAuthToken();
      expect(getStoredAuthToken()).toBeNull();
    });
  });

  describe('loginWithApi', () => {
    it('stores the returned token and returns payload.user on a 200 response', async () => {
      const user: Profile = {
        id: 'user-1',
        email: 'ana@example.com',
        full_name: 'Ana Souza',
        role: 'user',
        created_at: '2026-01-01T00:00:00.000Z',
      };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        jsonResponse({ token: 'server-token-xyz', user }),
      );

      const result = await loginWithApi('ana@example.com', 'senha123');

      expect(result).toEqual(user);
      expect(getStoredAuthToken()).toBe('server-token-xyz');
    });

    it("throws the server's error message on a non-OK response with a JSON error body", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        jsonResponse({ error: 'Credenciais inválidas.' }, { ok: false, status: 401 }),
      );

      await expect(loginWithApi('ana@example.com', 'senha-errada')).rejects.toThrow(
        'Credenciais inválidas.',
      );
      expect(getStoredAuthToken()).toBeNull();
    });
  });

  describe('fetchCurrentUser', () => {
    it('returns null without calling fetch when no token is stored', async () => {
      const result = await fetchCurrentUser();

      expect(result).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });

    it('clears the stored token and returns null on a 401 response', async () => {
      storeAuthToken('stale-token');
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        jsonResponse({}, { ok: false, status: 401 }),
      );

      const result = await fetchCurrentUser();

      expect(result).toBeNull();
      expect(getStoredAuthToken()).toBeNull();
    });
  });

  describe('logoutWithApi', () => {
    it('clears the local token even when the network call rejects', async () => {
      vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:4004');
      storeAuthToken('token-to-clear');
      (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('network down'));

      await expect(logoutWithApi()).resolves.toBeUndefined();
      expect(getStoredAuthToken()).toBeNull();
    });
  });

  describe('requireAuthToken()-gated functions', () => {
    it('saveBadgeWithApi throws "Sessão inválida ou expirada." synchronously when no token is stored', async () => {
      const badge: Badge = {
        id: 'badge-1',
        name: 'Qualidade',
        description: 'Selo de qualidade',
        category: 'quality',
        icon_name: 'star',
        points: 10,
      };

      await expect(saveBadgeWithApi(badge)).rejects.toThrow('Sessão inválida ou expirada.');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('deleteUserWithApi throws "Sessão inválida ou expirada." synchronously when no token is stored', async () => {
      await expect(deleteUserWithApi('user-1')).rejects.toThrow('Sessão inválida ou expirada.');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('awardBadgesWithApi throws "Sessão inválida ou expirada." synchronously when no token is stored', async () => {
      const tone: BadgeTone = 'gold';

      await expect(awardBadgesWithApi(['user-1'], 'badge-1', tone)).rejects.toThrow(
        'Sessão inválida ou expirada.',
      );
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
