import { prisma } from '../shared/db/prisma.mjs';

/**
 * Per-route resource fetching functions.
 */

const DEFAULT_BADGE_LEGENDS = {
  bronze: 'Bronze - Boa performance',
  silver: 'Prata - Excelente performance',
  gold: 'Ouro - Desempenho excepcional',
  loss_1: 'Perda 1 - Expectativa não atendida',
  loss_2: 'Perda 2 - Falha grave',
};

export const listBadges = async () => prisma.badge.findMany({
  select: { id: true, name: true, description: true, category: true, icon_name: true, image_url: true, points: true },
  orderBy: { name: 'asc' },
});

export const listProductiveUnits = async () => prisma.productiveUnit.findMany({
  select: { id: true, name: true },
  orderBy: { name: 'asc' },
});

export const listUsers = async () => prisma.user.findMany({
  select: {
    id: true,
    email: true,
    full_name: true,
    role: true,
    productive_unit_id: true,
    avatar_url: true,
    email_verified: true,
    is_active: true,
    created_at: true,
  },
  orderBy: { full_name: 'asc' },
});

export const listUserBadges = async () => prisma.userBadge.findMany({
  select: { id: true, user_id: true, badge_id: true, tone: true, awarded_at: true },
  orderBy: { awarded_at: 'desc' },
});

// Mesmos pesos de src/features/badges/badgeMetrics.ts (BADGE_TONE_WEIGHTS).
const BADGE_TONE_WEIGHTS = { bronze: 1, silver: 2, gold: 3, loss_1: -1, loss_2: -2 };

const emptyRankingEntry = (userId) => ({ user_id: userId, monthly_score: 0, positive_count: 0, loss_count: 0, category_scores: {} });

const addAwardToEntry = (entry, { tone, badge: { category } }) => {
  const weight = BADGE_TONE_WEIGHTS[tone];
  return {
    ...entry,
    monthly_score: entry.monthly_score + weight,
    positive_count: entry.positive_count + (weight > 0 ? 1 : 0),
    loss_count: entry.loss_count + (weight < 0 ? 1 : 0),
    category_scores: { ...entry.category_scores, [category]: (entry.category_scores[category] || 0) + weight },
  };
};

/**
 * Saldo de cada usuário no mês (UTC), sem as concessões individuais: o ranking
 * compara todas as unidades, mas o detalhe dos selos fica restrito à unidade.
 */
export const listMonthlyRanking = async ({ year, month }) => {
  const awards = await prisma.userBadge.findMany({
    where: { awarded_at: { gte: new Date(Date.UTC(year, month - 1, 1)), lt: new Date(Date.UTC(year, month, 1)) } },
    select: { user_id: true, tone: true, badge: { select: { category: true } } },
  });

  const byUser = new Map();
  awards.forEach((award) => {
    byUser.set(award.user_id, addAwardToEntry(byUser.get(award.user_id) || emptyRankingEntry(award.user_id), award));
  });

  return [...byUser.values()];
};

export const listSubmissions = async () => prisma.$queryRaw`
  select s.id, s.user_id, u.full_name as user_name, s.badge_id, b.name as badge_name, s.description, s.status::text as status, s.submitted_at, s.proof_url
  from badge_submissions s
  left join users u on u.id = s.user_id
  left join badges b on b.id = s.badge_id
  order by s.submitted_at desc`;

export const getBadgeLegends = async () => {
  const legends = await prisma.badgeLegendSetting.findFirst({
    select: { bronze: true, silver: true, gold: true, loss_1: true, loss_2: true },
    orderBy: { updated_at: 'desc' },
  });

  return legends || DEFAULT_BADGE_LEGENDS;
};
