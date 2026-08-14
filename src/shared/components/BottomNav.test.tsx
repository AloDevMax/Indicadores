import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from './BottomNav';
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

describe('BottomNav', () => {
  it('renders the admin links (Comando/Pedidos/Ranking) for an admin in management mode', () => {
    render(
      <MemoryRouter>
        <BottomNav user={makeProfile({ role: 'admin' })} adminViewMode="management" onOpenSolicitation={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Comando/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Pedidos/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ranking/ })).toBeInTheDocument();
    expect(screen.queryByText('Progresso')).not.toBeInTheDocument();
    expect(screen.queryByText('Solicitar')).not.toBeInTheDocument();
  });

  it('renders the user links (Progresso/Ranking) plus the floating Solicitar button for a plain user', () => {
    render(
      <MemoryRouter>
        <BottomNav user={makeProfile({ role: 'user' })} adminViewMode="management" onOpenSolicitation={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Progresso/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ranking/ })).toBeInTheDocument();
    expect(screen.getByText('Solicitar')).toBeInTheDocument();
    expect(screen.queryByText('Comando')).not.toBeInTheDocument();
    expect(screen.queryByText('Pedidos')).not.toBeInTheDocument();
  });

  it('renders the user links for an admin viewing their personal panel', () => {
    render(
      <MemoryRouter>
        <BottomNav user={makeProfile({ role: 'admin' })} adminViewMode="personal" onOpenSolicitation={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Progresso/ })).toBeInTheDocument();
    expect(screen.getByText('Solicitar')).toBeInTheDocument();
    expect(screen.queryByText('Comando')).not.toBeInTheDocument();
  });

  it('calls onOpenSolicitation when the floating Solicitar button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenSolicitation = vi.fn();

    render(
      <MemoryRouter>
        <BottomNav user={makeProfile({ role: 'user' })} adminViewMode="management" onOpenSolicitation={onOpenSolicitation} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button'));

    expect(onOpenSolicitation).toHaveBeenCalledTimes(1);
  });
});
