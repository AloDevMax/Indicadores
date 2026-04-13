import { seedData } from '../data/seed.mjs';
import { memoryStore } from '../data/memoryStore.mjs';
import { listUsers } from '../auth/repository.mjs';
import { memoryAdminStore } from '../admin/repository.mjs';
import { createPgClient } from './client.mjs';

const mapRows = (rows, mapper) => rows.map(mapper);

const filterDataForManager = (payload, currentUser) => {
  if (!currentUser ?? currentUser.role !== 'admin' ?? !currentUser.company_id) {
    return payload;
  }

  const companyId = currentUser.company_id;
  const productiveUnits = payload.productiveUnits.filter((unit) => unit.company_id === companyId);
  const productiveUnitIds = new Set(productiveUnits.map((unit) => unit.id));
  const users = payload.users.filter((user) => user.company_id === companyId);
  const userIds = new Set(users.map((user) => user.id));

  return {
    ...payload,
    companies: payload.companies.filter((company) => company.id === companyId),
    productiveUnits,
    users,
    userBadges: payload.userBadges.filter((badge) => userIds.has(badge.user_id)),
    submissions: payload.submissions.filter((submission) => userIds.has(submission.user_id)),
    importSources: payload.importSources,
    badgeLegends: payload.badgeLegends,
    badges: payload.badges,
  };
};

export const loadBootstrapData = async (currentUser = null) => {
  const client = await createPgClient();

  if (!client) {
    const users = await listUsers();
    return filterDataForManager({
      source: 'seed',
      ...seedData,
      badges: memoryAdminStore.badges,
      companies: memoryAdminStore.companies,
      productiveUnits: memoryAdminStore.productiveUnits,
      importSources: memoryAdminStore.importSources,
      users,
      userBadges: memoryStore.userBadges,
      submissions: memoryStore.submissions.map((submission) => ({
        ...submission,
        badge_name: memoryAdminStore.badges.find((badge) => badge.id === submission.badge_id)?.name ?? submission.badge_name,
      })),
    }, currentUser);
  }

  try {
    const [badges, companies, productiveUnits, badgeLegends, importSources, users, notifications, userBadges, submissions] = await Promise.all([
      client.query(
        'select id, name, description, icon_name, category, points, image_url from badges order by created_at asc',
      ),
      client.query('select id, name, logo_url from companies order by name asc'),
      client.query(
        'select id, name, company_id from productive_units order by company_id asc, name asc',
      ),
      client.query(
        'select bronze, silver, gold, loss_1, loss_2 from badge_legend_settings order by updated_at desc limit 1',
      ),
      client.query(
        `select
          id,
          name,
          description,
          company_column,
          productive_unit_column,
          user_column,
          badge_column,
          tone_column,
          award_column
        from import_sources
        where archived_at is null
        order by created_at asc`,
      ),
      client.query(
        `select
          id,
          email,
          full_name,
          avatar_url,
          role,
          company_id,
          productive_unit_id,
          level,
          xp,
          email_verified,
          created_at
        from users
        order by created_at asc`,
      ),
      client.query(
        `select
          id,
          user_id,
          title,
          message,
          sent_at,
          read
        from notifications
        order by sent_at desc`,
      ),
      client.query(
        `select id, user_id, badge_id, awarded_at, awarded_by, tone
         from user_badges
         order by awarded_at desc`,
      ),
      client.query(
        `select
          s.id,
          s.user_id,
          s.badge_id,
          s.proof_url,
          s.description,
          s.status,
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
      ),
    ]);

    const notificationsByUserId = notifications.rows.reduce((accumulator, notification) => {
      const nextEntries = accumulator.get(notification.user_id) ?? [];
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

    return filterDataForManager({
      source: 'database',
      badges: badges.rows,
      companies: companies.rows,
      productiveUnits: productiveUnits.rows,
      badgeLegends: badgeLegends.rows[0] ?? seedData.badgeLegends,
      users: users.rows.map((user) => ({
        ...user,
        notifications: notificationsByUserId.get(user.id) ?? [],
      })),
      userBadges: userBadges.rows,
      submissions: submissions.rows,
      importSources: mapRows(importSources.rows, (row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        columns: {
          company: row.company_column,
          productive_unit: row.productive_unit_column,
          user: row.user_column,
          badge: row.badge_column,
          tone: row.tone_column,
          award: row.award_column,
        },
      })),
    }, currentUser);
  } finally {
    await client.end();
  }
};
