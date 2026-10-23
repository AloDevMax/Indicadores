import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from './Settings';
import type { Profile } from '@/shared/types';

vi.mock('@/shared/api', () => ({
  updateOwnProfileWithApi: vi.fn(),
}));

import { updateOwnProfileWithApi } from '@/shared/api';

const mockedUpdate = vi.mocked(updateOwnProfileWithApi);

const baseUser: Profile = {
  id: 'user-1',
  email: 'ana@empresa.com',
  full_name: 'Ana Souza',
  role: 'supervisor',
  created_at: '2024-01-01T00:00:00Z',
  must_change_password: false,
};

const renderSettings = (user: Profile = baseUser) => {
  const setUser = vi.fn();
  render(<Settings user={user} setUser={setUser} />);
  return { setUser, user: userEvent.setup() };
};

const fillPasswordForm = async (
  user: ReturnType<typeof userEvent.setup>,
  { current, next, confirm }: { current: string; next: string; confirm: string },
) => {
  await user.type(screen.getByLabelText('Senha atual'), current);
  await user.type(screen.getByLabelText('Nova senha'), next);
  await user.type(screen.getByLabelText('Confirmar nova senha'), confirm);
  await user.click(screen.getByRole('button', { name: 'Trocar senha' }));
};

describe('Settings (Meu perfil)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the e-mail as read-only text and the supervisor role label', () => {
    renderSettings();

    expect(screen.getByRole('heading', { name: 'Meu perfil' })).toBeInTheDocument();
    expect(screen.getByText('ana@empresa.com')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('ana@empresa.com')).not.toBeInTheDocument();
    expect(screen.getByText('Supervisor')).toBeInTheDocument();
  });

  it('saves a new name and hands the updated profile to setUser', async () => {
    const updated = { ...baseUser, full_name: 'Ana Maria Souza' };
    mockedUpdate.mockResolvedValue(updated);
    const { setUser, user } = renderSettings();

    const nameInput = screen.getByLabelText('Nome completo');
    await user.clear(nameInput);
    await user.type(nameInput, 'Ana Maria Souza');
    await user.click(screen.getByRole('button', { name: 'Salvar nome' }));

    expect(mockedUpdate).toHaveBeenCalledWith({ full_name: 'Ana Maria Souza' });
    await waitFor(() => expect(setUser).toHaveBeenCalledWith(updated));
    expect(screen.getByText('Nome atualizado.')).toBeInTheDocument();
  });

  it('does not call the API when the new passwords do not match', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, { current: 'senha-atual', next: 'nova-senha-1', confirm: 'nova-senha-2' });

    expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument();
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('does not call the API when the new password is shorter than 8 characters', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, { current: 'senha-atual', next: 'curta', confirm: 'curta' });

    expect(screen.getByText('A nova senha deve ter pelo menos 8 caracteres.')).toBeInTheDocument();
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('changes the password with the current one, then clears the fields', async () => {
    mockedUpdate.mockResolvedValue(baseUser);
    const { setUser, user } = renderSettings();

    await fillPasswordForm(user, { current: 'senha-atual', next: 'nova-senha-123', confirm: 'nova-senha-123' });

    expect(mockedUpdate).toHaveBeenCalledWith({ current_password: 'senha-atual', new_password: 'nova-senha-123' });
    await waitFor(() => expect(setUser).toHaveBeenCalledWith(baseUser));
    expect(screen.getByText('Senha alterada.')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha atual')).toHaveValue('');
    expect(screen.getByLabelText('Nova senha')).toHaveValue('');
  });

  it('shows the server error, e.g. a wrong current password', async () => {
    mockedUpdate.mockRejectedValue(new Error('Senha atual incorreta.'));
    const { setUser, user } = renderSettings();

    await fillPasswordForm(user, { current: 'errada', next: 'nova-senha-123', confirm: 'nova-senha-123' });

    expect(await screen.findByText('Senha atual incorreta.')).toBeInTheDocument();
    expect(setUser).not.toHaveBeenCalled();
  });

  it('with a pending password change, explains it and shows only the password form', () => {
    renderSettings({ ...baseUser, must_change_password: true });

    expect(screen.getByText(/Defina uma nova senha para continuar/)).toBeInTheDocument();
    expect(screen.queryByLabelText('Nome completo')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trocar senha' })).toBeInTheDocument();
  });
});
