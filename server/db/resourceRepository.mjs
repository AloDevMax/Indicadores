import { createPgClient } from './client.mjs';
import { memoryAdminStore } from '../admin/repository.mjs';
import { memoryStore } from '../data/memoryStore.mjs';

/**
 * Per-route resource fetching functions.
 * These handle both PostgreSQL and in-memory fallback.
 */

export const listBadges = async () => {
  const client = await createPgClient();

  if (!client) {
    return memoryAdminStore.badges;
  }

  try {
    const result = await client.query(
      'select id, name, description, category, icon_name, image_url, points from badges order by name asc'
    );
    return result.rows;
  } finally {
    await client.end();
  }
};

export const listUsers = async () => {
  const client = await createPgClient();

  if (!client) {
    return memoryStore.users || [];
  }

  try {
    const result = await client.query(
      `select id, email, full_name, role, productive_unit_id, avatar_url, email_verified, created_at
       from users
       order by full_name asc`
    );
    return result.rows;
  } finally {
    await client.end();
  }
};

export const listUserBadges = async () => {
  const client = await createPgClient();

  if (!client) {
    return memoryStore.userBadges || [];
  }

  try {
    const result = await client.query(
      `select id, user_id, badge_id, tone, awarded_at, awarded_by
       from user_badges
       order by awarded_at desc`
    );
    return result.rows;
  } finally {
    await client.end();
  }
};

export const listSubmissions = async () => {
  const client = await createPgClient();

  if (!client) {
    return memoryStore.submissions || [];
  }

  try {
    const result = await client.query(
      `select s.id, s.user_id, s.badge_id, b.name as badge_name, s.description, s.status, s.submitted_at, s.proof_url
       from badge_submissions s
       left join badges b on b.id = s.badge_id
       order by s.submitted_at desc`
    );
    return result.rows;
  } finally {
    await client.end();
  }
};

export const getBadgeLegends = async () => {
  const client = await createPgClient();

  if (!client) {
    return memoryStore.badgeLegends || {
      bronze: 'Bronze - Boa performance',
      silver: 'Prata - Excelente performance',
      gold: 'Ouro - Desempenho excepcional',
      loss_1: 'Perda 1 - Expectativa não atendida',
      loss_2: 'Perda 2 - Falha grave',
    };
  }

  try {
    const result = await client.query(
      'select bronze, silver, gold, loss_1, loss_2 from badge_legend_settings order by updated_at desc limit 1'
    );
    if (result.rows.length === 0) {
      return {
        bronze: 'Bronze - Boa performance',
        silver: 'Prata - Excelente performance',
        gold: 'Ouro - Desempenho excepcional',
        loss_1: 'Perda 1 - Expectativa não atendida',
        loss_2: 'Perda 2 - Falha grave',
      };
    }
    return result.rows[0];
  } finally {
    await client.end();
  }
};

export const listImportSources = async () => {
  const client = await createPgClient();

  if (!client) {
    return memoryAdminStore.importSources || [];
  }

  try {
    const result = await client.query(
      `select
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
       order by created_at asc`
    );
    return result.rows;
  } finally {
    await client.end();
  }
};
