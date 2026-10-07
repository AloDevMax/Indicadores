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
  select: { id: true, user_id: true, badge_id: true, tone: true, awarded_at: true, awarded_by: true },
  orderBy: { awarded_at: 'desc' },
});

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

export const listImportSources = async () => prisma.importSource.findMany({
  select: {
    id: true,
    name: true,
    description: true,
    productive_unit_column: true,
    user_column: true,
    badge_column: true,
    tone_column: true,
    award_column: true,
  },
  where: { archived_at: null },
  orderBy: { created_at: 'asc' },
});
