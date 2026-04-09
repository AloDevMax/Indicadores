/// <reference types="vite/client" />
import { AppBootstrapPayload, Badge, BadgeSubmission, BadgeTone, Company, ImportBindingSnapshot, ImportSourceConfig, ProductiveUnit, Profile, UserBadge } from '../types';

const AUTH_TOKEN_KEY = 'quest_auth_token';
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
  // Em desenvolvimento, usar proxy do Vite
  if (import.meta.env.DEV) {
    return '';
  }
  // Em produção, usar a URL configurada
  const configured = import.meta.env.VITE_API_BASE_URL?.trim() || process.env.VITE_API_BASE_URL?.trim();
  return configured ? trimTrailingSlash(configured) : '';
};

const createJsonHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const readErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const postJson = async <T>(path: string, body: unknown, token?: string): Promise<T> => {
  const apiBaseUrl = getApiBaseUrl();

  // Em desenvolvimento com proxy, a URL pode ser vazia
  if (!apiBaseUrl && !import.meta.env.DEV) {
    throw new Error('VITE_API_BASE_URL não configurada.');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: createJsonHeaders(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<T>;
};

export const fetchBootstrapData = async (): Promise<AppBootstrapPayload | null> => {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/api/bootstrap`);

  if (!response.ok) {
    throw new Error(`Bootstrap request failed with status ${response.status}`);
  }

  return response.json() as Promise<AppBootstrapPayload>;
};

export const storeAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getStoredAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const clearStoredAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const registerWithApi = async (email: string, password: string, fullName: string) => {
  const payload = await postJson<{ token: string; user: Profile }>('/api/auth/register', {
    email,
    password,
    full_name: fullName,
  });

  storeAuthToken(payload.token);
  return payload.user;
};

export const loginWithApi = async (email: string, password: string) => {
  const payload = await postJson<{ token: string; user: Profile }>('/api/auth/login', {
    email,
    password,
  });

  storeAuthToken(payload.token);
  return payload.user;
};

export const fetchCurrentUser = async () => {
  const apiBaseUrl = getApiBaseUrl();
  const token = getStoredAuthToken();

  if (!apiBaseUrl || !token) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
    headers: createJsonHeaders(token),
  });

  if (response.status === 401) {
    clearStoredAuthToken();
    return null;
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = (await response.json()) as { user: Profile };
  return payload.user;
};

export const logoutWithApi = async () => {
  const apiBaseUrl = getApiBaseUrl();
  const token = getStoredAuthToken();

  if (apiBaseUrl && token) {
    try {
      await postJson('/api/auth/logout', {}, token);
    } catch {
      // Best-effort logout on the API; local cleanup still happens.
    }
  }

  clearStoredAuthToken();
};

export const createSubmissionWithApi = async (badgeId: string, description: string, proofUrl?: string) => {
  const token = getStoredAuthToken();
  if (!token) {
    throw new Error('Sessão inválida ou expirada.');
  }

  const payload = await postJson<{ submission: BadgeSubmission }>(
    '/api/submissions',
    {
      badge_id: badgeId,
      description,
      proof_url: proofUrl,
    },
    token,
  );

  return payload.submission;
};

export const reviewSubmissionWithApi = async (submissionId: string, status: 'approved' | 'rejected') => {
  const token = getStoredAuthToken();
  if (!token) {
    throw new Error('Sessão inválida ou expirada.');
  }

  const payload = await postJson<{ submission: BadgeSubmission; awardedBadge?: UserBadge }>(
    `/api/submissions/${submissionId}/review`,
    { status },
    token,
  );

  return payload;
};

const requireAuthToken = () => {
  const token = getStoredAuthToken();
  if (!token) {
    throw new Error('Sessão inválida ou expirada.');
  }
  return token;
};

export const saveBadgeWithApi = async (badge: Badge) => {
  const payload = await postJson<{ badge: Badge }>('/api/admin/badges', badge, requireAuthToken());
  return payload.badge;
};

export const deleteBadgeWithApi = async (id: string) => {
  await postJson('/api/admin/badges/delete', { id }, requireAuthToken());
};

export const saveCompanyWithApi = async (company: Company) => {
  const payload = await postJson<{ company: Company }>('/api/admin/companies', company, requireAuthToken());
  return payload.company;
};

export const saveProductiveUnitWithApi = async (productiveUnit: ProductiveUnit) => {
  const payload = await postJson<{ productiveUnit: ProductiveUnit }>('/api/admin/productive-units', productiveUnit, requireAuthToken());
  return payload.productiveUnit;
};

export const saveUserWithApi = async (user: Profile) => {
  const payload = await postJson<{ user: Profile }>('/api/admin/users', user, requireAuthToken());
  return payload.user;
};

export const bulkInviteUsersWithApi = async (emails: string[], companyId?: string, productiveUnitId?: string) => {
  return postJson<{ createdUsers: Profile[]; skippedEmails: string[] }>(
    '/api/admin/users/bulk-invite',
    {
      emails,
      company_id: companyId,
      productive_unit_id: productiveUnitId,
    },
    requireAuthToken(),
  );
};

export const deleteUserWithApi = async (id: string) => {
  await postJson('/api/admin/users/delete', { id }, requireAuthToken());
};

export const saveImportSourceWithApi = async (importSource: ImportSourceConfig) => {
  const payload = await postJson<{ importSource: ImportSourceConfig }>(
    '/api/admin/import-sources',
    importSource,
    requireAuthToken(),
  );
  return payload.importSource;
};

export const awardBadgesWithApi = async (userIds: string[], badgeId: string, tone: BadgeTone) => {
  const payload = await postJson<{ awardedBadges: UserBadge[] }>(
    '/api/admin/award-badges',
    { user_ids: userIds, badge_id: badgeId, tone },
    requireAuthToken(),
  );
  return payload.awardedBadges;
};

export const removeUserBadgeWithApi = async (userId: string, badgeId: string) => {
  await postJson(
    '/api/admin/user-badges/remove',
    { user_id: userId, badge_id: badgeId },
    requireAuthToken(),
  );
};

interface ImportRowPayload {
  row: Record<string, string>;
  user_id?: string;
  badge_id?: string;
  tone: BadgeTone;
  status: 'valid' | 'invalid';
  reason?: string;
}

export const persistImportRunWithApi = async (
  sourceId: string,
  sourceName: string,
  matchedColumns: Partial<Record<string, string>>,
  rows: ImportRowPayload[],
) => {
  const payload = await postJson<{
    importRun: { imported_at?: string; importedAt?: string };
    awardedBadges: UserBadge[];
    summary: { valid: number };
  }>(
    '/api/admin/import-runs',
    {
      source_id: sourceId,
      source_name: sourceName,
      matched_columns: matchedColumns,
      rows,
    },
    requireAuthToken(),
  );

  const importedAt = payload.importRun.imported_at || payload.importRun.importedAt || new Date().toISOString();
  const bindingSnapshot: ImportBindingSnapshot = {
    sourceId,
    sourceName,
    matchedColumns,
    importedAt,
  };

  return {
    awardedBadges: payload.awardedBadges,
    summary: payload.summary,
    bindingSnapshot,
  };
};
