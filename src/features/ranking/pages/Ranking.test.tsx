import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Badge, Profile, RankingEntry, UserBadge } from '@/shared/types';
import { DEFAULT_BADGE_LEGENDS } from '@/shared/types';
import { clearAllCache } from '@/shared/lib/resourceCache';
import * as api from '@/shared/api';
import Ranking from './Ranking';

vi.mock('@/shared/api', () => ({
  fetchUsersWithApi: vi.fn(),
  fetchBadgesWithApi: vi.fn(),
  fetchUserBadgesWithApi: vi.fn(),
  fetchBadgeLegendsWithApi: vi.fn(),
  fetchRankingWithApi: vi.fn(),
}));

const currentUser: Profile = {
  id: 'me', email: 'me@example.com', full_name: 'Eu Mesmo', role: 'user', productive_unit_id: 'pu-a', created_at: '2026-01-01', is_active: true,
};
vi.mock('@/shared/contexts/AuthContext', () => ({ useAuth: () => ({ user: currentUser }) }));

const person = (id: string, full_name: string, productive_unit_id: string): Profile => ({
  id, email: `${id}@example.com`, full_name, role: 'user', productive_unit_id, created_at: '2026-01-01', is_active: true,
});

const users = [currentUser, person('colleague', 'Colega Unidade', 'pu-a'), person('stranger', 'Outra Unidade', 'pu-b')];

const badges = [
  { id: 'b1', name: 'Mestre de Processos', description: '', category: 'Qualidade', icon_name: '📋', points: 1 },
] as Badge[];

const now = new Date();

// Concessões já filtradas pelo servidor: só a própria unidade (pu-a).
const scopedAwards: UserBadge[] = [
  { id: 'a1', user_id: 'colleague', badge_id: 'b1', tone: 'loss_2', awarded_at: now.toISOString() },
];

const ranking: RankingEntry[] = [
  { user_id: 'stranger', monthly_score: 7, positive_count: 3, loss_count: 1, category_scores: { Qualidade: 2, 'Segurança': 5 } },
  { user_id: 'colleague', monthly_score: -2, positive_count: 0, loss_count: 1, category_scores: { Qualidade: -2 } },
  { user_id: 'me', monthly_score: 4, positive_count: 2, loss_count: 0, category_scores: { Qualidade: 4 } },
];

beforeEach(() => {
  clearAllCache();
  vi.mocked(api.fetchUsersWithApi).mockResolvedValue(users);
  vi.mocked(api.fetchBadgesWithApi).mockResolvedValue(badges);
  vi.mocked(api.fetchUserBadgesWithApi).mockResolvedValue(scopedAwards);
  vi.mocked(api.fetchBadgeLegendsWithApi).mockResolvedValue(DEFAULT_BADGE_LEGENDS);
  vi.mocked(api.fetchRankingWithApi).mockResolvedValue(ranking);
});

afterEach(() => vi.clearAllMocks());

// O pódio renderiza na ordem 2º, 1º, 3º (a posição visual vem do CSS).
const podiumDomOrder = () => screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

const openProfile = async (name: RegExp) => {
  await userEvent.click(await screen.findByRole('button', { name }));
  return screen.getByText('Fechar Perfil').closest('div') as HTMLElement;
};

describe('Ranking', () => {
  it('asks the API for the selected month (1-based) and ranks every unit by the returned score', async () => {
    render(<Ranking />);
    await screen.findByRole('button', { name: /Outra Unidade/ });

    expect(api.fetchRankingWithApi).toHaveBeenCalledWith(now.getUTCFullYear(), now.getUTCMonth() + 1);
    expect(podiumDomOrder()).toEqual(['Eu Mesmo', 'Outra Unidade', 'Colega Unidade']);
  });

  it('ranks by the selected category score', async () => {
    render(<Ranking />);
    await screen.findByRole('button', { name: /Outra Unidade/ });

    await userEvent.click(screen.getByRole('button', { name: 'Qualidade' }));

    expect(podiumDomOrder()).toEqual(['Outra Unidade', 'Eu Mesmo', 'Colega Unidade']);
    // O score fica num <span>; o "2" da posição no pódio é um <div>.
    expect(within(screen.getByRole('button', { name: /Outra Unidade/ })).getByText('2', { selector: 'span' })).toBeInTheDocument();
  });

  it('shows only the totals for someone from another unit', async () => {
    render(<Ranking />);

    const dialog = await openProfile(/Outra Unidade/);

    expect(within(dialog).getByText('Saldo do Mês').previousSibling).toHaveTextContent('7');
    expect(within(dialog).getByText('Selos Positivos').previousSibling).toHaveTextContent('3');
    expect(within(dialog).getByText('Perdas').previousSibling).toHaveTextContent('1');
    expect(within(dialog).getByText('Os selos individuais só aparecem para a unidade do colaborador.')).toBeInTheDocument();
    expect(within(dialog).queryByText('Mestre de Processos')).not.toBeInTheDocument();
  });

  it('lists each award, penalties included, for a colleague from the same unit', async () => {
    render(<Ranking />);

    const dialog = await openProfile(/Colega Unidade/);

    const awardCard = within(dialog).getByText('Mestre de Processos').parentElement?.parentElement as HTMLElement;
    expect(within(awardCard).getByText('Perda 2')).toBeInTheDocument();
    expect(within(awardCard).getByText('-2')).toBeInTheDocument();
  });
});
