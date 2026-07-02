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
       from profiles
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
      `select id, user_id, badge_id, tone, awarded_at, created_at, awarded_by, productive_unit_id
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
      `select id, user_id, badge_id, badge_name, description, status, submitted_at, proof_url
       from badge_submissions
       order by submitted_at desc`
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
    const result = await client.query('select legends from badge_legend_settings limit 1');
    if (result.rows.length === 0) {
      return {
        bronze: 'Bronze - Boa performance',
        silver: 'Prata - Excelente performance',
        gold: 'Ouro - Desempenho excepcional',
        loss_1: 'Perda 1 - Expectativa não atendida',
        loss_2: 'Perda 2 - Falha grave',
      };
    }
    return result.rows[0].legends;
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
      `select id, name, description, columns
       from import_source_configs
       order by name asc`
    );
    return result.rows.map(row => ({
      ...row,
      columns: typeof row.columns === 'string' ? JSON.parse(row.columns) : row.columns,
    }));
  } finally {
    await client.end();
  }
};
