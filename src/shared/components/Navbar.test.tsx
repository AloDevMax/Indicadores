import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
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

function renderNavbar(user: Profile, onLogout = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={<Navbar user={user} userBadges={[]} onLogout={onLogout} onToggleSidebar={vi.fn()} />}
        />
        <Route path="/admin" element={<Navbar user={user} userBadges={[]} onLogout={onLogout} onToggleSidebar={vi.fn()} />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Navbar', () => {
  it('renders the "Dev" pill and "Desenvolvedor" subtitle for a developer', () => {
    renderNavbar(makeProfile({ role: 'developer', full_name: 'Marcos Costa' }));

    expect(screen.getByText('Dev')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor')).toBeInTheDocument();
  });

  it('renders the "Supervisor" pill and "Supervisor de Unidade" subtitle for a supervisor', () => {
    renderNavbar(makeProfile({ role: 'supervisor', full_name: 'Marina Torres' }));

    expect(screen.getByText('Supervisor')).toBeInTheDocument();
    expect(screen.getByText('Supervisor de Unidade')).toBeInTheDocument();
  });

  it('renders the "Admin" pill and "Gestor" subtitle for an admin', () => {
    renderNavbar(makeProfile({ role: 'admin', full_name: 'Marina Torres' }));

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Gestor')).toBeInTheDocument();
  });

  it('renders no role pill and a monthly-score subtitle for a plain user', () => {
    renderNavbar(makeProfile({ role: 'user', full_name: 'Plain User' }));

    expect(screen.queryByText('Dev')).not.toBeInTheDocument();
    expect(screen.queryByText('Supervisor')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.getByText('+0 pts este mês')).toBeInTheDocument();
  });

  it('renders the initials of the first two names in the avatar', () => {
    renderNavbar(makeProfile({ full_name: 'Ana Maria Silva' }));

    expect(screen.getByText('AM')).toBeInTheDocument();
  });

  it('calls onLogout and navigates home when the logout button is clicked', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    renderNavbar(makeProfile({ role: 'user' }), onLogout);

    await user.click(screen.getByRole('button', { name: 'Sair' }));

    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('calls onToggleSidebar when the mobile menu button is clicked', async () => {
    const user = userEvent.setup();
    const onToggleSidebar = vi.fn();

    render(
      <MemoryRouter>
        <Navbar user={makeProfile({})} userBadges={[]} onLogout={vi.fn()} onToggleSidebar={onToggleSidebar} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
