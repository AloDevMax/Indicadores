import crypto from 'node:crypto';
import { prisma } from '../shared/db/prisma.mjs';
import { findUserById } from '../auth/repository.mjs';

const REVIEWER_ROLES = ['admin', 'developer', 'supervisor'];

const SUBMISSION_SELECT = {
  id: true,
  user_id: true,
  badge_id: true,
  proof_url: true,
  description: true,
  status: true,
  submitted_at: true,
  reviewed_by: true,
  reviewed_at: true,
  feedback: true,
};

const USER_BADGE_SELECT = { id: true, user_id: true, badge_id: true, awarded_at: true, awarded_by: true, tone: true };

const isRecordNotFound = (error) => error?.code === 'P2025';

const ensureReviewer = async (reviewerId, message) => {
  const reviewer = await findUserById(reviewerId);
  if (!reviewer || !REVIEWER_ROLES.includes(reviewer.role)) {
    throw new Error(message);
  }
};

const mapSubmission = (row) => ({
  id: row.id,
  user_id: row.user_id,
  badge_id: row.badge_id,
  proof_url: row.proof_url || undefined,
  description: row.description || undefined,
  status: row.status,
  submitted_at: row.submitted_at,
  reviewed_by: row.reviewed_by || undefined,
  reviewed_at: row.reviewed_at || undefined,
  feedback: row.feedback || undefined,
  user_name: row.user_name || undefined,
  badge_name: row.badge_name || undefined,
});

// Recebe o client da transação: dentro dela, toda query passa por tx.
const buildAwardPayload = async (db, { userId, badgeId, awardedBy, tone, id, awardedAt }) => {
  const targetUser = await db.user.findUnique({ where: { id: userId }, select: { productive_unit_id: true } });
  const resolvedAwardedAt = awardedAt || new Date().toISOString();

  return {
    id: id || crypto.randomUUID(),
    user_id: userId,
    badge_id: badgeId,
    awarded_at: resolvedAwardedAt,
    created_at: resolvedAwardedAt,
    awarded_by: awardedBy,
    tone,
    productive_unit_id: targetUser?.productive_unit_id,
  };
};

const replaceAward = async (tx, { userId, badgeId, awardedBy, tone }) => {
  await tx.userBadge.deleteMany({ where: { user_id: userId, badge_id: badgeId } });
  const inserted = await tx.userBadge.create({
    data: { user_id: userId, badge_id: badgeId, awarded_by: awardedBy, tone },
    select: USER_BADGE_SELECT,
  });

  return buildAwardPayload(tx, {
    userId, badgeId, awardedBy, tone, id: inserted.id, awardedAt: inserted.awarded_at,
  });
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
  sent_at: new Date(),
  read: false,
});

const persistAwardNotifications = async (tx, { userIds, badgeName, tone }) => {
  const users = await Promise.all(userIds.map((userId) => tx.user.findUnique({
    where: { id: userId },
    select: { id: true, full_name: true },
  })));

  for (const user of users.filter(Boolean)) {
    const notification = createAwardNotification({ fullName: user.full_name, badgeName, tone });
    await tx.notification.create({ data: { ...notification, user_id: user.id } });
  }
};

// Unidade produtiva do dono da submissão, ou null se a submissão não existe.
export const findSubmissionOwnerUnit = async (submissionId) => {
  const submission = await prisma.badgeSubmission.findUnique({
    where: { id: submissionId },
    select: { user: { select: { productive_unit_id: true } } },
  });

  return submission ? { productive_unit_id: submission.user.productive_unit_id } : null;
};

export const createSubmission = async ({ userId, badgeId, description, proofUrl }) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const submission = await prisma.badgeSubmission.create({
    data: { user_id: userId, badge_id: badgeId, proof_url: proofUrl || null, description, status: 'pending' },
    select: SUBMISSION_SELECT,
  });

  return mapSubmission({ ...submission, user_name: user.full_name });
};

const markSubmissionReviewed = async (tx, { submissionId, reviewerId, status }) => {
  try {
    return await tx.badgeSubmission.update({
      where: { id: submissionId },
      data: { status, reviewed_by: reviewerId, reviewed_at: new Date() },
      select: SUBMISSION_SELECT,
    });
  } catch (error) {
    if (isRecordNotFound(error)) throw new Error('Solicitação não encontrada.', { cause: error });
    throw error;
  }
};

export const reviewSubmission = async ({ submissionId, reviewerId, status }) => {
  await ensureReviewer(reviewerId, 'Apenas administradores e supervisores podem revisar solicitações.');

  const { submission, awardedBadge } = await prisma.$transaction(async (tx) => {
    const reviewed = await markSubmissionReviewed(tx, { submissionId, reviewerId, status });
    const award = status === 'approved'
      ? await replaceAward(tx, { userId: reviewed.user_id, badgeId: reviewed.badge_id, awardedBy: reviewerId, tone: 'bronze' })
      : null;

    return { submission: reviewed, awardedBadge: award };
  });

  const user = await findUserById(submission.user_id);
  return {
    submission: mapSubmission({ ...submission, user_name: user?.full_name }),
    awardedBadge,
  };
};

export const awardBadges = async ({ reviewerId, userIds, badgeId, tone }) => {
  await ensureReviewer(reviewerId, 'Apenas administradores e supervisores podem conceder badges.');

  return prisma.$transaction(async (tx) => {
    const badge = await tx.badge.findUnique({ where: { id: badgeId }, select: { name: true } });
    const results = [];

    for (const userId of userIds) {
      results.push(await replaceAward(tx, { userId, badgeId, awardedBy: reviewerId, tone }));
    }

    try {
      await persistAwardNotifications(tx, { userIds, badgeName: badge?.name || 'Badge', tone });
    } catch (notifError) {
      console.error('[awardBadges] falha ao enviar notificações (badges já concedidos):', notifError.message);
    }

    return results;
  });
};

export const removeUserBadge = async ({ reviewerId, userId, badgeId }) => {
  await ensureReviewer(reviewerId, 'Apenas administradores e supervisores podem remover badges.');

  await prisma.userBadge.deleteMany({ where: { user_id: userId, badge_id: badgeId } });
  return { success: true };
};

const recordImportRow = async (tx, { importRunId, rowNumber, row }) => {
  await tx.importRunRow.create({
    data: {
      import_run_id: importRunId,
      row_number: rowNumber,
      raw_payload: row.row,
      normalized_payload: {
        user_id: row.user_id || null,
        badge_id: row.badge_id || null,
        tone: row.tone || null,
      },
      status: row.status === 'valid' ? 'imported' : row.status,
      reason: row.reason || null,
    },
  });
};

const awardImportedRow = async (tx, { row, reviewerId }) => {
  // Substitui só o selo deste mês.
  await tx.$executeRaw`
    delete from user_badges
    where user_id = ${row.user_id}::uuid
      and badge_id = ${row.badge_id}
      and date_trunc('month', awarded_at) = date_trunc('month', now())`;

  const inserted = await tx.userBadge.create({
    data: { user_id: row.user_id, badge_id: row.badge_id, awarded_by: reviewerId, tone: row.tone },
    select: USER_BADGE_SELECT,
  });

  return buildAwardPayload(tx, {
    userId: row.user_id,
    badgeId: row.badge_id,
    awardedBy: reviewerId,
    tone: row.tone,
    id: inserted.id,
    awardedAt: inserted.awarded_at,
  });
};

export const persistImportRun = async ({
  reviewerId,
  sourceId,
  sourceName,
  matchedColumns,
  rows,
}) => {
  await ensureReviewer(reviewerId, 'Apenas administradores e supervisores podem processar importações.');

  const validRows = rows.filter((row) => row.status === 'valid');
  const summary = {
    total: rows.length,
    valid: validRows.length,
    invalid: rows.length - validRows.length,
  };

  return prisma.$transaction(async (tx) => {
    const importRun = await tx.importRun.create({
      data: {
        source_id: sourceId,
        source_name: sourceName,
        imported_by: reviewerId,
        status: 'completed',
        matched_columns: matchedColumns,
        summary,
      },
      select: {
        id: true,
        source_id: true,
        source_name: true,
        imported_by: true,
        imported_at: true,
        status: true,
        matched_columns: true,
        summary: true,
      },
    });

    const awardedBadges = [];
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      await recordImportRow(tx, { importRunId: importRun.id, rowNumber: index + 1, row });

      if (row.status === 'valid') {
        awardedBadges.push(await awardImportedRow(tx, { row, reviewerId }));
      }
    }

    return { importRun, awardedBadges, summary };
  });
};

// awards: [{ userId, badgeId, tone }] — only non-zero values
export const importMonthlyBadges = async ({ reviewerId, awards, month, year }) => {
  await ensureReviewer(reviewerId, 'Apenas administradores e supervisores podem importar badges mensais.');

  // Pares (usuário, selo) importados, para apagar os registros anteriores deste mês.
  const uniquePairs = [...new Map(awards.map((a) => [`${a.userId}:${a.badgeId}`, a])).values()];

  return prisma.$transaction(async (tx) => {
    for (const { userId, badgeId } of uniquePairs) {
      await tx.$executeRaw`
        delete from user_badges
        where user_id = ${userId}::uuid
          and badge_id = ${badgeId}
          and date_trunc('month', awarded_at) = date_trunc('month', make_date(${year}::int, ${month}::int, 1)::timestamp)`;
    }

    const inserted = [];
    for (const { userId, badgeId, tone } of uniquePairs) {
      const rows = await tx.$queryRaw`
        insert into user_badges (id, user_id, badge_id, awarded_by, tone, awarded_at)
        values (gen_random_uuid(), ${userId}::uuid, ${badgeId}, ${reviewerId}::uuid, ${tone}::"BadgeTone", make_date(${year}::int, ${month}::int, 1)::timestamp)
        returning id, user_id, badge_id, awarded_at, awarded_by, tone::text as tone`;
      inserted.push(rows[0]);
    }

    return { awardedCount: inserted.length, awardedBadges: inserted };
  });
};
