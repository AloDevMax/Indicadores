import crypto from 'node:crypto';
import { createPgClient } from '../db/client.mjs';
import { memoryStore } from '../data/memoryStore.mjs';
import { appendMemoryNotification, findUserById } from '../auth/repository.mjs';
import { memoryAdminStore } from '../admin/repository.mjs';

const mapSubmission = (row) => ({
  id: row.id,
  user_id: row.user_id,
  badge_id: row.badge_id,
  proof_url: row.proof_url ?? undefined,
  description: row.description ?? undefined,
  status: row.status,
  submitted_at: row.submitted_at,
  reviewed_by: row.reviewed_by ?? undefined,
  reviewed_at: row.reviewed_at ?? undefined,
  feedback: row.feedback ?? undefined,
  user_name: row.user_name ?? undefined,
  badge_name: row.badge_name ?? undefined,
});

const upsertMemoryBadgeAward = ({ userId, badgeId, awardedBy, tone }) => {
  const award = {
    id: crypto.randomUUID(),
    user_id: userId,
    badge_id: badgeId,
    awarded_at: new Date().toISOString(),
    awarded_by: awardedBy,
    tone,
  };
  memoryStore.userBadges = memoryStore.userBadges.filter(
    (entry) => !(entry.user_id === userId && entry.badge_id === badgeId),
  );
  memoryStore.userBadges.push(award);
  return award;
};

const BADGE_TONE_LABELS = {
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
  loss_1: 'Vermelho',
  loss_2: 'Vermelho intenso',
};

const createAwardNotification = ({ fullName, badgeName, tone }) => ({
  id: crypto.randomUUID(),
  title: 'Selo concedido',
  message: `Parabens ${fullName}, voce recebeu o selo ${badgeName} com marcacao ${BADGE_TONE_LABELS[tone]}.`,
  sent_at: new Date().toISOString(),
  read: false,
});

const persistAwardNotifications = async ({ client, userIds, badgeName, tone }) => {
  const users = await Promise.all(userIds.map((userId) => findUserById(userId)));
  const validUsers = users.filter(Boolean);

  if (!client) {
    await Promise.all(validUsers.map((user) => appendMemoryNotification(
      user.id,
      createAwardNotification({ fullName: user.full_name, badgeName, tone }),
    )));
    return;
  }

  for (const user of validUsers) {
    const notification = createAwardNotification({
      fullName: user.full_name,
      badgeName,
      tone,
    });

    await client.query(
      `insert into notifications (id, user_id, title, message, sent_at, read)
       values ($1, $2, $3, $4, $5, $6)`,
      [notification.id, user.id, notification.title, notification.message, notification.sent_at, notification.read],
    );
  }
};

export const createSubmission = async ({ userId, badgeId, description, proofUrl }) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const client = await createPgClient();

  if (!client) {
    const submission = {
      id: crypto.randomUUID(),
      user_id: userId,
      badge_id: badgeId,
      proof_url: proofUrl ?? null,
      description,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      reviewed_by: null,
      reviewed_at: null,
      feedback: null,
      user_name: user.full_name,
    };
    memoryStore.submissions.unshift(submission);
    return mapSubmission(submission);
  }

  try {
    const result = await client.query(
      `insert into badge_submissions (
        user_id,
        badge_id,
        proof_url,
        description,
        status
      ) values ($1, $2, $3, $4, 'pending')
      returning
        id,
        user_id,
        badge_id,
        proof_url,
        description,
        status,
        submitted_at,
        reviewed_by,
        reviewed_at,
        feedback`,
      [userId, badgeId, proofUrl ?? null, description],
    );

    return mapSubmission({
      ...result.rows[0],
      user_name: user.full_name,
    });
  } finally {
    await client.end();
  }
};

export const reviewSubmission = async ({ submissionId, reviewerId, status }) => {
  const reviewer = await findUserById(reviewerId);
  if (!reviewer ?? (reviewer.role !== 'admin' && reviewer.role !== 'developer')) {
    throw new Error('Apenas administradores podem revisar solicitações.');
  }

  const client = await createPgClient();

  if (!client) {
    const submission = memoryStore.submissions.find((entry) => entry.id === submissionId);
    if (!submission) {
      throw new Error('Solicitação não encontrada.');
    }

    submission.status = status;
    submission.reviewed_by = reviewerId;
    submission.reviewed_at = new Date().toISOString();

    let awardedBadge = null;
    if (status === 'approved') {
      awardedBadge = {
        id: crypto.randomUUID(),
        user_id: submission.user_id,
        badge_id: submission.badge_id,
        awarded_at: new Date().toISOString(),
        awarded_by: reviewerId,
        tone: 'bronze',
      };
      memoryStore.userBadges = memoryStore.userBadges.filter(
        (entry) => !(entry.user_id === awardedBadge.user_id && entry.badge_id === awardedBadge.badge_id),
      );
      memoryStore.userBadges.push(awardedBadge);
    }

    return {
      submission: mapSubmission(submission),
      awardedBadge,
    };
  }

  try {
    await client.query('begin');

    const submissionResult = await client.query(
      `update badge_submissions
       set status = $2,
           reviewed_by = $3,
           reviewed_at = now()
       where id = $1
       returning id, user_id, badge_id, proof_url, description, status, submitted_at, reviewed_by, reviewed_at, feedback`,
      [submissionId, status, reviewerId],
    );

    const submission = submissionResult.rows[0];
    if (!submission) {
      throw new Error('Solicitação não encontrada.');
    }

    let awardedBadge = null;

    if (status === 'approved') {
      await client.query(
        `delete from user_badges
         where user_id = $1
           and badge_id = $2`,
        [submission.user_id, submission.badge_id],
      );

      const badgeResult = await client.query(
        `insert into user_badges (user_id, badge_id, awarded_by, tone)
         values ($1, $2, $3, 'bronze')
         returning id, user_id, badge_id, awarded_at, awarded_by, tone`,
        [submission.user_id, submission.badge_id, reviewerId],
      );
      awardedBadge = badgeResult.rows[0];
    }

    await client.query('commit');

    const user = await findUserById(submission.user_id);
    return {
      submission: mapSubmission({
        ...submission,
        user_name: user?.full_name,
      }),
      awardedBadge,
    };
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
};

export const awardBadges = async ({ reviewerId, userIds, badgeId, tone }) => {
  const reviewer = await findUserById(reviewerId);
  if (!reviewer ?? (reviewer.role !== 'admin' && reviewer.role !== 'developer')) {
    throw new Error('Apenas administradores podem conceder badges.');
  }

  const badgeName = memoryAdminStore.badges.find((badge) => badge.id === badgeId)?.name ?? 'Badge';
  const client = await createPgClient();

  if (!client) {
    const awardedBadges = userIds.map((userId) => upsertMemoryBadgeAward({ userId, badgeId, awardedBy: reviewerId, tone }));
    await persistAwardNotifications({ client: null, userIds, badgeName, tone });
    return awardedBadges;
  }

  try {
    await client.query('begin');
    const results = [];
    const badgeResult = await client.query(
      `select name
       from badges
       where id = $1
       limit 1`,
      [badgeId],
    );
    const resolvedBadgeName = badgeResult.rows[0]?.name ?? badgeName;

    for (const userId of userIds) {
      await client.query(
        `delete from user_badges
         where user_id = $1
           and badge_id = $2`,
        [userId, badgeId],
      );

      const inserted = await client.query(
        `insert into user_badges (user_id, badge_id, awarded_by, tone)
         values ($1, $2, $3, $4)
         returning id, user_id, badge_id, awarded_at, awarded_by, tone`,
        [userId, badgeId, reviewerId, tone],
      );
      results.push(inserted.rows[0]);
    }

    await persistAwardNotifications({ client, userIds, badgeName: resolvedBadgeName, tone });

    await client.query('commit');
    return results;
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
};

export const removeUserBadge = async ({ reviewerId, userId, badgeId }) => {
  const reviewer = await findUserById(reviewerId);
  if (!reviewer ?? (reviewer.role !== 'admin' && reviewer.role !== 'developer')) {
    throw new Error('Apenas administradores podem remover badges.');
  }

  const client = await createPgClient();

  if (!client) {
    memoryStore.userBadges = memoryStore.userBadges.filter(
      (entry) => !(entry.user_id === userId && entry.badge_id === badgeId),
    );
    return { success: true };
  }

  try {
    await client.query(
      `delete from user_badges
       where user_id = $1
         and badge_id = $2`,
      [userId, badgeId],
    );
    return { success: true };
  } finally {
    await client.end();
  }
};

export const persistImportRun = async ({
  reviewerId,
  sourceId,
  sourceName,
  matchedColumns,
  rows,
}) => {
  const reviewer = await findUserById(reviewerId);
  if (!reviewer ?? (reviewer.role !== 'admin' && reviewer.role !== 'developer')) {
    throw new Error('Apenas administradores podem processar importações.');
  }

  const validRows = rows.filter((row) => row.status === 'valid');
  const summary = {
    total: rows.length,
    valid: validRows.length,
    invalid: rows.length - validRows.length,
  };

  const client = await createPgClient();

  if (!client) {
    const importRun = {
      id: crypto.randomUUID(),
      source_id: sourceId,
      source_name: sourceName,
      imported_by: reviewerId,
      imported_at: new Date().toISOString(),
      status: 'completed',
      matched_columns: matchedColumns,
      summary,
    };
    memoryStore.importRuns.unshift(importRun);
    const awardedBadges = validRows.map((row) =>
      upsertMemoryBadgeAward({
        userId: row.user_id,
        badgeId: row.badge_id,
        awardedBy: reviewerId,
        tone: row.tone,
      }),
    );
    return { importRun, awardedBadges, summary };
  }

  try {
    await client.query('begin');

    const importRunResult = await client.query(
      `insert into import_runs (
        source_id,
        source_name,
        imported_by,
        status,
        matched_columns,
        summary
      ) values ($1, $2, $3, 'completed', $4::jsonb, $5::jsonb)
      returning id, source_id, source_name, imported_by, imported_at, status, matched_columns, summary`,
      [sourceId, sourceName, reviewerId, JSON.stringify(matchedColumns), JSON.stringify(summary)],
    );

    const importRun = importRunResult.rows[0];
    const awardedBadges = [];

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      await client.query(
        `insert into import_run_rows (import_run_id, row_number, raw_payload, normalized_payload, status, reason)
         values ($1, $2, $3::jsonb, $4::jsonb, $5, $6)`,
        [
          importRun.id,
          index + 1,
          JSON.stringify(row.row),
          JSON.stringify({
            user_id: row.user_id ?? null,
            badge_id: row.badge_id ?? null,
            tone: row.tone ?? null,
          }),
          row.status === 'valid' ? 'imported' : row.status,
          row.reason ?? null,
        ],
      );

      if (row.status === 'valid') {
        await client.query(
          `delete from user_badges
           where user_id = $1
             and badge_id = $2`,
          [row.user_id, row.badge_id],
        );

        const inserted = await client.query(
          `insert into user_badges (user_id, badge_id, awarded_by, tone)
           values ($1, $2, $3, $4)
           returning id, user_id, badge_id, awarded_at, awarded_by, tone`,
          [row.user_id, row.badge_id, reviewerId, row.tone],
        );
        awardedBadges.push(inserted.rows[0]);
      }
    }

    await client.query('commit');
    return { importRun, awardedBadges, summary };
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
};
