import { describe, expect, it } from 'vitest';
import { prisma } from './prisma.mjs';

// O Postgres não indexa foreign keys sozinho; sem estes índices, ranking,
// dashboard e exclusões em cascata viram varreduras completas das tabelas.
const EXPECTED_INDEXES = [
  ['users', 'users_productive_unit_id_idx', 'productive_unit_id'],
  ['auth_sessions', 'auth_sessions_user_id_idx', 'user_id'],
  ['user_badges', 'user_badges_user_id_badge_id_idx', 'user_id, badge_id'],
  ['user_badges', 'user_badges_badge_id_idx', 'badge_id'],
  ['user_badges', 'user_badges_awarded_at_idx', 'awarded_at'],
  ['badge_submissions', 'badge_submissions_user_id_idx', 'user_id'],
  ['badge_submissions', 'badge_submissions_badge_id_idx', 'badge_id'],
  ['badge_submissions', 'badge_submissions_status_idx', 'status'],
  ['notifications', 'notifications_user_id_idx', 'user_id'],
  ['import_run_rows', 'import_run_rows_import_run_id_idx', 'import_run_id'],
];

describe('índices das migrations', () => {
  it.each(EXPECTED_INDEXES)('%s tem o índice %s em (%s)', async (table, indexName, columns) => {
    const rows = await prisma.$queryRaw`
      select indexdef from pg_indexes
      where schemaname = current_schema() and tablename = ${table} and indexname = ${indexName}
    `;

    expect(rows).toHaveLength(1);
    expect(rows[0].indexdef).toMatch(new RegExp(`^CREATE INDEX ${indexName} ON .*USING btree \\(${columns}\\)$`));
  });
});
