import crypto from 'node:crypto';
import { prisma } from '../shared/db/prisma.mjs';
import { hashPassword } from '../auth/crypto.mjs';
import { deleteUploadedFile } from '../uploads/uploadService.mjs';

const randomId = () => crypto.randomUUID().slice(0, 8);

const BADGE_SELECT = {
  id: true, name: true, description: true, category: true, icon_name: true, image_url: true, points: true,
};

const PROFILE_SELECT = {
  id: true,
  email: true,
  full_name: true,
  avatar_url: true,
  role: true,
  productive_unit_id: true,
  email_verified: true,
  created_at: true,
};

const USER_SELECT = { ...PROFILE_SELECT, is_active: true };

const isRecordNotFound = (error) => error?.code === 'P2025';

export const saveBadge = async (badge) => {
  const id = badge.id || randomId();
  const fields = {
    name: badge.name,
    description: badge.description,
    category: badge.category,
    icon_name: badge.icon_name,
    image_url: badge.image_url || null,
    points: badge.points,
  };

  return prisma.badge.upsert({
    where: { id },
    create: { id, ...fields },
    update: fields,
    select: BADGE_SELECT,
  });
};

const INDICATOR_BADGES = [
  { id: 'ind-nps', name: 'NPS', description: 'Net Promoter Score', category: 'Qualidade', icon_name: '⭐', points: 0 },
  { id: 'ind-vol-nps', name: 'Volume NPS', description: 'Quantidade de avaliações NPS', category: 'Qualidade', icon_name: '📊', points: 0 },
  { id: 'ind-recoletas', name: 'Recoletas', description: 'Taxa de recoletas por paciente', category: 'Qualidade', icon_name: '🔬', points: 0 },
  { id: 'ind-5s', name: 'Auditoria 5S', description: 'Resultado da auditoria 5S', category: 'Qualidade', icon_name: '🏠', points: 0 },
  { id: 'ind-docs', name: 'Leitura de Documentos', description: 'Leitura de documentos do mês', category: 'Qualidade', icon_name: '📄', points: 0 },
  { id: 'ind-nc', name: 'Não Conformidades', description: 'Ausência de NCs vencidas', category: 'Qualidade', icon_name: '✅', points: 0 },
  { id: 'ind-ponto', name: 'Ajuste de Ponto', description: 'Registros de ponto ajustados', category: 'RH', icon_name: '⏰', points: 0 },
  { id: 'ind-iapp', name: 'IAPP', description: 'Erros de baixa com impacto logístico', category: 'Logística', icon_name: '🚚', points: 0 },
  { id: 'ind-curso', name: 'Curso Extra', description: 'Certificado de curso extra', category: 'Desenvolvimento', icon_name: '🎓', points: 0 },
  { id: 'ind-aceleradoras', name: 'Atitudes Aceleradoras', description: 'Ações além das funções normais', category: 'Comportamental', icon_name: '🚀', points: 0 },
  { id: 'ind-faturamento', name: 'Faturamento', description: 'Pendência de guia no faturamento', category: 'Qualidade', icon_name: '💰', points: 0 },
  { id: 'ind-advertencia', name: 'Advertência', description: 'Advertência recebida no mês', category: 'Comportamental', icon_name: '⚠️', points: 0 },
  { id: 'ind-reincidente', name: 'Critério Reincidente', description: 'Critério não pontuado por 2 meses consecutivos', category: 'Qualidade', icon_name: '🔁', points: 0 },
];

export const seedIndicatorBadges = async () => {
  const { image_url: _imageUrl, ...indicatorSelect } = BADGE_SELECT;
  const results = [];

  for (const { id, ...fields } of INDICATOR_BADGES) {
    results.push(await prisma.badge.upsert({
      where: { id },
      create: { id, ...fields },
      update: fields,
      select: indicatorSelect,
    }));
  }

  return results;
};

// Uma URL de upload pode estar em mais de uma linha (avatar_url aceita qualquer valor no perfil).
// Só apaga o arquivo quando a última referência some, para não remover o arquivo de outra pessoa.
const deleteUploadIfUnreferenced = async (url) => {
  if (!url) return;
  const references = await Promise.all([
    prisma.user.count({ where: { avatar_url: url } }),
    prisma.badge.count({ where: { image_url: url } }),
    prisma.badgeSubmission.count({ where: { proof_url: url } }),
  ]);
  if (references.some((count) => count > 0)) return;
  await deleteUploadedFile(url);
};

export const deleteBadge = async (badgeId) => {
  const badge = await prisma.badge.findUnique({ where: { id: badgeId }, select: { image_url: true } });
  await prisma.badge.deleteMany({ where: { id: badgeId } });

  await deleteUploadIfUnreferenced(badge?.image_url);

  return { success: true };
};

export const saveProductiveUnit = async (productiveUnit) => {
  const id = productiveUnit.id || randomId();

  return prisma.productiveUnit.upsert({
    where: { id },
    create: { id, name: productiveUnit.name },
    update: { name: productiveUnit.name },
    select: { id: true, name: true },
  });
};

export const updateUserProfile = async (userId, updates) => {
  const data = { updated_at: new Date() };

  if (updates.full_name !== undefined) data.full_name = updates.full_name;
  if (updates.email !== undefined) data.email = updates.email;
  if (updates.avatar_url !== undefined) data.avatar_url = updates.avatar_url;
  if (updates.password !== undefined) data.password_hash = await hashPassword(updates.password);

  try {
    return await prisma.user.update({ where: { id: userId }, data, select: PROFILE_SELECT });
  } catch (error) {
    if (isRecordNotFound(error)) throw new Error('Usuário não encontrado.', { cause: error });
    throw error;
  }
};

const updateExistingUser = async (user, password) => {
  const data = {
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    productive_unit_id: user.productive_unit_id || null,
    updated_at: new Date(),
  };

  if (user.avatar_url !== undefined) data.avatar_url = user.avatar_url;
  if (user.is_active !== undefined) data.is_active = user.is_active;
  if (password) data.password_hash = await hashPassword(password);

  try {
    return await prisma.user.update({ where: { id: user.id }, data, select: USER_SELECT });
  } catch (error) {
    if (isRecordNotFound(error)) return null;
    throw error;
  }
};

export const saveUser = async (user, password) => {
  if (user.id) {
    const updatedUser = await updateExistingUser(user, password);
    if (updatedUser) return updatedUser;
    // Sem usuário com esse id: cria um novo, com id novo.
  }

  return prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email: user.email,
      password_hash: await hashPassword(password || 'changeme123'),
      full_name: user.full_name,
      avatar_url: user.avatar_url || null,
      role: user.role,
      productive_unit_id: user.productive_unit_id || null,
      email_verified: false,
      is_active: user.is_active ?? true,
    },
    select: USER_SELECT,
  });
};

export const deleteUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatar_url: true } });
  await prisma.user.deleteMany({ where: { id: userId } });

  await deleteUploadIfUnreferenced(user?.avatar_url);

  return { success: true };
};

export const saveImportSource = async (importSource) => {
  const id = importSource.id || randomId();
  const fields = {
    name: importSource.name,
    description: importSource.description || null,
    productive_unit_column: importSource.columns.productive_unit,
    user_column: importSource.columns.user,
    badge_column: importSource.columns.badge,
    tone_column: importSource.columns.tone,
    award_column: importSource.columns.award,
  };

  const row = await prisma.importSource.upsert({
    where: { id },
    create: { id, ...fields },
    update: fields,
  });

  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    columns: {
      productive_unit: row.productive_unit_column,
      user: row.user_column,
      badge: row.badge_column,
      tone: row.tone_column,
      award: row.award_column,
    },
  };
};

export const bulkInviteUsers = async ({ emails, productiveUnitId }) => {
  const normalizedEmails = [...new Set(
    emails
      .map((email) => email.toLowerCase().trim())
      .filter(Boolean),
  )];
  const passwordHash = await hashPassword('changeme123');

  return prisma.$transaction(async (tx) => {
    const createdUsers = [];
    const skippedEmails = [];

    for (const email of normalizedEmails) {
      // on conflict (email) do nothing: e-mails já cadastrados são pulados.
      const rows = await tx.$queryRaw`
        insert into users (id, email, password_hash, full_name, role, productive_unit_id, email_verified)
        values (${crypto.randomUUID()}::uuid, ${email}, ${passwordHash}, ${email.split('@')[0]}, 'user', ${productiveUnitId || null}, false)
        on conflict (email) do nothing
        returning id, email, full_name, role::text as role, productive_unit_id, email_verified, created_at`;

      if (rows[0]) {
        createdUsers.push(rows[0]);
      } else {
        skippedEmails.push(email);
      }
    }

    return { createdUsers, skippedEmails };
  }, { maxWait: 10_000, timeout: 60_000 });
};
