import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import type { Profile } from '@/shared/types';

vi.mock('@/shared/api', () => ({
  fetchCurrentUser: vi.fn(),
  loginWithApi: vi.fn(),
  registerWithApi: vi.fn(),
  logoutWithApi: vi.fn(),
}));

import { fetchCurrentUser, loginWithApi, registerWithApi, logoutWithApi } from '@/shared/api';

const mockedFetchCurrentUser = vi.mocked(fetchCurrentUser);
const mockedLoginWithApi = vi.mocked(loginWithApi);
const mockedRegisterWithApi = vi.mocked(registerWithApi);
const mockedLogoutWithApi = vi.mocked(logoutWithApi);

const baseProfile: Profile = {
  id: 'user-1',
  email: 'existing@example.com',
  full_name: 'Existing User',
  role: 'user',
  created_at: '2024-01-01T00:00:00Z',
};

const loggedInProfile: Profile = {
  id: 'user-2',
  email: 'logged-in@example.com',
  full_name: 'Logged In User',
  role: 'admin',
  created_at: '2024-02-01T00:00:00Z',
};

const registeredProfile: Profile = {
  id: 'user-3',
  email: 'new@example.com',
  full_name: 'New User',
  role: 'user',
  created_at: '2024-03-01T00:00:00Z',
};

function AuthConsumer() {
  const { user, isAuthLoading, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(isAuthLoading)}</span>
      <span data-testid="user-json">{user ? JSON.stringify(user) : 'null'}</span>
      <button onClick={() => login('login@example.com', 'secret')}>Login</button>
      <button onClick={() => register('register@example.com', 'secret', 'Register Name')}>Register</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchCurrentUser.mockResolvedValue(baseProfile);
    mockedLoginWithApi.mockResolvedValue(loggedInProfile);
    mockedRegisterWithApi.mockResolvedValue(registeredProfile);
    mockedLogoutWithApi.mockResolvedValue(undefined);
  });

  it('throws when useAuth is called outside an AuthProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Broken() {
      useAuth();
      return null;
    }

    expect(() => render(<Broken />)).toThrow('useAuth must be used within an AuthProvider');

    consoleErrorSpy.mockRestore();
  });

  it('sets user and clears loading when fetchCurrentUser resolves on mount', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('loading').textContent).toBe('true');

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    expect(mockedFetchCurrentUser).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('user-json').textContent).toBe(JSON.stringify(baseProfile));
  });

  it('sets user to null and clears loading when fetchCurrentUser rejects on mount', async () => {
    mockedFetchCurrentUser.mockRejectedValueOnce(new Error('network error'));

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    expect(screen.getByTestId('user-json').textContent).toBe('null');
  });

  it('login calls loginWithApi with the given credentials and updates the user', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() =>
      expect(screen.getByTestId('user-json').textContent).toBe(JSON.stringify(loggedInProfile)),
    );

    expect(mockedLoginWithApi).toHaveBeenCalledTimes(1);
    expect(mockedLoginWithApi).toHaveBeenCalledWith('login@example.com', 'secret');
  });

  it('register calls registerWithApi with the given details and updates the user', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() =>
      expect(screen.getByTestId('user-json').textContent).toBe(JSON.stringify(registeredProfile)),
    );

    expect(mockedRegisterWithApi).toHaveBeenCalledTimes(1);
    expect(mockedRegisterWithApi).toHaveBeenCalledWith('register@example.com', 'secret', 'Register Name');
  });

  it('logout calls logoutWithApi and clears the user', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('user-json').textContent).toBe(JSON.stringify(baseProfile));

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => expect(screen.getByTestId('user-json').textContent).toBe('null'));

    expect(mockedLogoutWithApi).toHaveBeenCalledTimes(1);
  });
});
