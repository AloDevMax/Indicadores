import { prisma } from '../shared/db/prisma.mjs';

// Legendas usadas quando nenhuma foi salva.
const DEFAULT_BADGE_LEGENDS = {
  bronze: '1 selo no mês',
  silver: '2 selos no mês',
  gold: '3 selos ou mais no mês',
  loss_1: 'perda de 1 selo',
  loss_2: 'perda de 2 selos',
};

const filterDataForAdmin = (payload) => {
  return payload;
};

const filterDataForSupervisor = (payload, currentUser) => {
  const unitId = currentUser.productive_unit_id;
  if (!unitId) return payload;

  const users = payload.users.filter((u) => u.productive_unit_id === unitId);
  const userIds = new Set(users.map((u) => u.id));

  return {
    ...payload,
    productiveUnits: payload.productiveUnits.filter((u) => u.id === unitId),
    users,
    userBadges: payload.userBadges.filter((ub) => userIds.has(ub.user_id)),
    submissions: payload.submissions.filter((s) => userIds.has(s.user_id)),
  };
};

const filterDataForUser = (payload, currentUser) => {
  const unitId = currentUser.productive_unit_id;
  const unitUsers = unitId
    ? payload.users.filter((u) => u.productive_unit_id === unitId)
    : payload.users.filter((u) => u.id === currentUser.id);

  return {
    ...payload,
    productiveUnits: unitId ? payload.productiveUnits.filter((u) => u.id === unitId) : [],
    users: unitUsers,
    userBadges: payload.userBadges.filter((ub) => ub.user_id === currentUser.id),
    submissions: payload.submissions.filter((s) => s.user_id === currentUser.id),
    importSources: [],
  };
};

const applyRoleFilter = (payload, currentUser) => {
  if (!currentUser) {
    return {
      source: payload.source,
      badges: payload.badges,
      productiveUnits: payload.productiveUnits,
      badgeLegends: payload.badgeLegends,
      users: [],
      userBadges: [],
      submissions: [],
      importSources: [],
    };
  }
  const { role } = currentUser;
  if (role === 'developer') return payload;
  if (role === 'admin') return filterDataForAdmin(payload, currentUser);
  if (role === 'supervisor') return filterDataForSupervisor(payload, currentUser);
  if (role === 'user') return filterDataForUser(payload, currentUser);
  return payload;
};

const groupNotificationsByUserId = (notifications) => notifications.reduce((accumulator, notification) => {
  const nextEntries = accumulator.get(notification.user_id) || [];
  nextEntries.push({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    sent_at: notification.sent_at,
    read: notification.read,
  });
  accumulator.set(notification.user_id, nextEntries);
  return accumulator;
}, new Map());

const mapImportSource = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  columns: {
    productive_unit: row.productive_unit_column,
    user: row.user_column,
    badge: row.badge_column,
    tone: row.tone_column,
    award: row.award_column,
  },
});

export const loadBootstrapData = async (currentUser = null) => {
  const [badges, productiveUnits, badgeLegends, importSources, users, notifications, userBadges, submissions] = await Promise.all([
    prisma.$queryRaw`
      select id, name, description, icon_name, category, points, image_url from badges order by created_at asc`,
    prisma.$queryRaw`
      select id, name from productive_units order by name asc`,
    prisma.$queryRaw`
      select bronze, silver, gold, loss_1, loss_2 from badge_legend_settings order by updated_at desc limit 1`,
    prisma.$queryRaw`
      select
        id,
        name,
        description,
        productive_unit_column,
        user_column,
        badge_column,
        tone_column,
        award_column
      from import_sources
      where archived_at is null
      order by created_at asc`,
    prisma.$queryRaw`
      select
        id,
        email,
        full_name,
        avatar_url,
        role::text as role,
        productive_unit_id,
        email_verified,
        is_active,
        created_at
      from users
      order by created_at asc`,
    prisma.$queryRaw`
      select
        id,
        user_id,
        title,
        message,
        sent_at,
        read
      from notifications
      order by sent_at desc`,
    prisma.$queryRaw`
      select id, user_id, badge_id, awarded_at, awarded_by, tone::text as tone
      from user_badges
      order by awarded_at desc`,
    prisma.$queryRaw`
      select
        s.id,
        s.user_id,
        s.badge_id,
        s.proof_url,
        s.description,
        s.status::text as status,
        s.submitted_at,
        s.reviewed_by,
        s.reviewed_at,
        s.feedback,
        u.full_name as user_name,
        b.name as badge_name
      from badge_submissions s
      left join users u on u.id = s.user_id
      left join badges b on b.id = s.badge_id
      order by s.submitted_at desc`,
  ]);

  const notificationsByUserId = groupNotificationsByUserId(notifications);

  return applyRoleFilter({
    source: 'database',
    badges,
    productiveUnits,
    badgeLegends: badgeLegends[0] || DEFAULT_BADGE_LEGENDS,
    users: users.map((user) => ({
      ...user,
      notifications: notificationsByUserId.get(user.id) || [],
    })),
    userBadges,
    submissions,
    importSources: importSources.map(mapImportSource),
  }, currentUser);
};
