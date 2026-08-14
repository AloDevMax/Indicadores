import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { ComponentProps } from 'react';
import Sidebar from './Sidebar';
import type { Profile } from '@/shared/types';

function makeProfile(overrides: Partial<Profile>): Profile {
  return {
    id: 'user-1',
    email: 'user@example.com',
    full_name: 'Ana Silva',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function renderSidebar(props: Partial<ComponentProps<typeof Sidebar>>) {
  return render(
    <MemoryRouter>
      <Sidebar
        user={makeProfile({})}
        isOpen={false}
        onClose={vi.fn()}
        {...props}
      />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  it('renders nothing when there is no user', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar user={null as unknown as Profile} isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the collaborator menu for a plain user role', () => {
    renderSidebar({ user: makeProfile({ role: 'user' }) });

    expect(screen.getByText('Menu do Colaborador')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Meu Progresso/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Meus Selos/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ranking da Empresa/ })).toBeInTheDocument();
    expect(screen.queryByText('Gestão Operacional')).not.toBeInTheDocument();
  });

  it('shows "Ranking Global" for a developer viewing their personal menu', () => {
    renderSidebar({
      user: makeProfile({ role: 'developer' }),
      adminViewMode: 'personal',
      setAdminViewMode: vi.fn(),
    });

    expect(screen.getByText('Menu do Colaborador')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ranking Global/ })).toBeInTheDocument();
  });

  it('renders the operational management menu for an admin by default', () => {
    renderSidebar({
      user: makeProfile({ role: 'admin' }),
      setAdminViewMode: vi.fn(),
    });

    expect(screen.getByText('Gestão Operacional')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Visão Geral/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Premiar Selos/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Solicitações/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Colaboradores/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ranking da Empresa/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Biblioteca/ })).not.toBeInTheDocument();
  });

  it('shows the ranking label scoped to a supervisor\'s unit', () => {
    renderSidebar({
      user: makeProfile({ role: 'supervisor' }),
      setAdminViewMode: vi.fn(),
    });

    expect(screen.getByRole('link', { name: /Ranking da Unidade/ })).toBeInTheDocument();
  });

  it('includes "Biblioteca" in the management menu only for a developer', () => {
    renderSidebar({
      user: makeProfile({ role: 'developer' }),
      setAdminViewMode: vi.fn(),
    });

    expect(screen.getByText('Gestão Operacional')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Biblioteca/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ranking Global/ })).toBeInTheDocument();
  });

  it('calls onClose when the mobile backdrop overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <Sidebar user={makeProfile({})} isOpen onClose={onClose} />
      </MemoryRouter>,
    );

    // The backdrop is a non-interactive div with no accessible role, so it must be queried directly.
    const backdrop = document.querySelector('.fixed.inset-0');
    expect(backdrop).not.toBeNull();

    await user.click(backdrop as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls setAdminViewMode with "management" or "personal" when the view toggle buttons are clicked', async () => {
    const user = userEvent.setup();
    const setAdminViewMode = vi.fn();

    renderSidebar({
      user: makeProfile({ role: 'admin' }),
      adminViewMode: 'personal',
      setAdminViewMode,
    });

    await user.click(screen.getByRole('button', { name: 'Gestão Operacional' }));
    expect(setAdminViewMode).toHaveBeenCalledWith('management');

    await user.click(screen.getByRole('button', { name: 'Painel Pessoal' }));
    expect(setAdminViewMode).toHaveBeenCalledWith('personal');
  });
});
