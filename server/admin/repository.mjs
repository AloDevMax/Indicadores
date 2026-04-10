import crypto from 'node:crypto';
import { createPgClient } from '../db/client.mjs';
import { deleteMemoryUser, findUserByEmail, upsertMemoryUser } from '../auth/repository.mjs';
import { hashPassword } from '../auth/crypto.mjs';
import { seedData } from '../data/seed.mjs';
import { deleteUploadedFile } from '../uploads/uploadService.mjs';

export const memoryAdminStore = {
  badges: [...seedData.badges],
  companies: [...seedData.companies],
  productiveUnits: [...seedData.productiveUnits],
  importSources: [...seedData.importSources],
};

const randomId = () => crypto.randomUUID().slice(0, 8);

export const saveBadge = async (badge) => {
  const client = await createPgClient();

  if (!client) {
    const normalized = { ...badge, id: badge.id || randomId() };
    memoryAdminStore.badges = memoryAdminStore.badges.some((entry) => entry.id === normalized.id)
      ? memoryAdminStore.badges.map((entry) => (entry.id === normalized.id ? normalized : entry))
      : [...memoryAdminStore.badges, normalized];
    return normalized;
  }

  try {
    const id = badge.id || randomId();
    const result = await client.query(
      `insert into badges (id, name, description, category, icon_name, image_url, points)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (id) do update
       set name = excluded.name,
           description = excluded.description,
           category = excluded.category,
           icon_name = excluded.icon_name,
           image_url = excluded.image_url,
           points = excluded.points
       returning id, name, description, category, icon_name, image_url, points`,
      [id, badge.name, badge.description, badge.category, badge.icon_name, badge.image_url || null, badge.points],
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
};

export const deleteBadge = async (badgeId) => {
  const client = await createPgClient();

  if (!client) {
    const badge = memoryAdminStore.badges.find(b => b.id === badgeId);
    if (badge?.image_url) {
      await deleteUploadedFile(badge.image_url);
    }
    memoryAdminStore.badges = memoryAdminStore.badges.filter((badge) => badge.id !== badgeId);
    return { success: true };
  }

  try {
    // Buscar imagem do selo antes de deletar
    const result = await client.query('select image_url from badges where id = $1', [badgeId]);
    if (result.rows[0]?.image_url) {
      await deleteUploadedFile(result.rows[0].image_url);
    }
    
    await client.query('delete from badges where id = $1', [badgeId]);
    return { success: true };
  } finally {
    await client.end();
  }
};

export const saveCompany = async (company) => {
  const client = await createPgClient();

  if (!client) {
    const normalized = { ...company, id: company.id || randomId() };
    memoryAdminStore.companies = memoryAdminStore.companies.some((entry) => entry.id === normalized.id)
      ? memoryAdminStore.companies.map((entry) => (entry.id === normalized.id ? normalized : entry))
      : [...memoryAdminStore.companies, normalized];
    return normalized;
  }

  try {
    const id = company.id || randomId();
    const result = await client.query(
      `insert into companies (id, name, logo_url)
       values ($1, $2, $3)
       on conflict (id) do update
       set name = excluded.name,
           logo_url = excluded.logo_url
       returning id, name, logo_url`,
      [id, company.name, company.logo_url || null],
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
};

export const deleteCompany = async (companyId) => {
  const client = await createPgClient();

  if (!client) {
    const company = memoryAdminStore.companies.find(c => c.id === companyId);
    if (company?.logo_url) {
      await deleteUploadedFile(company.logo_url);
    }
    memoryAdminStore.companies = memoryAdminStore.companies.filter((company) => company.id !== companyId);
    return { success: true };
  }

  try {
    // Buscar logo da empresa antes de deletar
    const result = await client.query('select logo_url from companies where id = $1', [companyId]);
    if (result.rows[0]?.logo_url) {
      await deleteUploadedFile(result.rows[0].logo_url);
    }
    
    await client.query('delete from companies where id = $1', [companyId]);
    return { success: true };
  } finally {
    await client.end();
  }
};

export const saveProductiveUnit = async (productiveUnit) => {
  const client = await createPgClient();

  if (!client) {
    const normalized = { ...productiveUnit, id: productiveUnit.id || randomId() };
    memoryAdminStore.productiveUnits = memoryAdminStore.productiveUnits.some((entry) => entry.id === normalized.id)
      ? memoryAdminStore.productiveUnits.map((entry) => (entry.id === normalized.id ? normalized : entry))
      : [...memoryAdminStore.productiveUnits, normalized];
    return normalized;
  }

  try {
    const id = productiveUnit.id || randomId();
    const result = await client.query(
      `insert into productive_units (id, name, company_id)
       values ($1, $2, $3)
       on conflict (id) do update
       set name = excluded.name,
           company_id = excluded.company_id
       returning id, name, company_id`,
      [id, productiveUnit.name, productiveUnit.company_id],
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
};

export const updateUserProfile = async (userId, updates) => {
  const client = await createPgClient();

  if (!client) {
    // For memory store, find and update the user
    const userIndex = memory.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }

    memory.users[userIndex] = {
      ...memory.users[userIndex],
      ...updates,
      id: userId, // Ensure ID doesn't change
    };

    return sanitizeUser(memory.users[userIndex]);
  }

  try {
    const updateFields = [];
    const updateValues = [userId];
    let paramIndex = 2;

    if (updates.full_name !== undefined) {
      updateFields.push(`full_name = $${paramIndex++}`);
      updateValues.push(updates.full_name);
    }

    if (updates.email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`);
      updateValues.push(updates.email);
    }

    if (updates.avatar_url !== undefined) {
      updateFields.push(`avatar_url = $${paramIndex++}`);
      updateValues.push(updates.avatar_url);
    }

    if (updates.password !== undefined) {
      const passwordHash = await hashPassword(updates.password);
      updateFields.push(`password_hash = $${paramIndex++}`);
      updateValues.push(passwordHash);
    }

    updateFields.push('updated_at = now()');

    const result = await client.query(
      `update users
       set ${updateFields.join(', ')}
       where id = $1
       returning id, email, full_name, avatar_url, role, company_id, productive_unit_id, level, xp, email_verified, created_at`,
      updateValues,
    );

    if (result.rows.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    return result.rows[0];
  } finally {
    await client.end();
  }
};

export const saveUser = async (user, password) => {
  const client = await createPgClient();

  if (!client) {
    const normalized = {
      ...user,
      id: user.id || crypto.randomUUID(),
      level: user.level ?? 1,
      xp: user.xp ?? 0,
      email_verified: user.email_verified ?? false,
      created_at: user.created_at || new Date().toISOString(),
      password: password,
    };
    return upsertMemoryUser(normalized);
  }

  try {
    if (user.id) {
      // Update existing user if it already exists
      const updateFields = [
        'email = $2',
        'full_name = $3',
        'role = $4',
        'company_id = $5',
        'productive_unit_id = $6',
        'level = $7',
        'xp = $8',
        'updated_at = now()'
      ];
      const updateValues = [
        user.id,
        user.email,
        user.full_name,
        user.role,
        user.company_id || null,
        user.productive_unit_id || null,
        user.level ?? 1,
        user.xp ?? 0,
      ];

      if (user.avatar_url !== undefined) {
        updateFields.push(`avatar_url = $${updateValues.length + 1}`);
        updateValues.push(user.avatar_url);
      }

      if (password) {
        const passwordHash = await hashPassword(password);
        updateFields.push(`password_hash = $${updateValues.length + 1}`);
        updateValues.push(passwordHash);
      }

      const result = await client.query(
        `update users
         set ${updateFields.join(', ')}
         where id = $1
         returning id, email, full_name, avatar_url, role, company_id, productive_unit_id, level, xp, email_verified, created_at`,
        updateValues,
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }
      // Fall through to create new user when the provided id does not exist.
    }

    const passwordHash = password ? await hashPassword(password) : await hashPassword('changeme123');
    const userId = crypto.randomUUID(); // Gera UUID no Node
    const result = await client.query(
      `insert into users (
        id,
        email,
        password_hash,
        full_name,
        avatar_url,
        role,
        company_id,
        productive_unit_id,
        level,
        xp,
        email_verified
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false)
      returning id, email, full_name, avatar_url, role, company_id, productive_unit_id, level, xp, email_verified, created_at`,
      [
        userId,
        user.email,
        passwordHash,
        user.full_name,
        user.avatar_url || null,
        user.role,
        user.company_id || null,
        user.productive_unit_id || null,
        user.level ?? 1,
        user.xp ?? 0,
      ],
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
};

export const deleteUser = async (userId) => {
  const client = await createPgClient();

  if (!client) {
    const user = (await findUserByEmail('')) || null;
    // Para memory store, iterar pelos usuários para encontrar o avatar
    const memoryUsers = await findUserByEmail('');
    await deleteMemoryUser(userId);
    return { success: true };
  }

  try {
    // Buscar avatar do usuário antes de deletar
    const result = await client.query('select avatar_url from users where id = $1', [userId]);
    if (result.rows[0]?.avatar_url) {
      await deleteUploadedFile(result.rows[0].avatar_url);
    }
    
    await client.query('delete from users where id = $1', [userId]);
    return { success: true };
  } finally {
    await client.end();
  }
};

export const saveImportSource = async (importSource) => {
  const client = await createPgClient();

  if (!client) {
    const normalized = { ...importSource, id: importSource.id || randomId() };
    memoryAdminStore.importSources = memoryAdminStore.importSources.some((entry) => entry.id === normalized.id)
      ? memoryAdminStore.importSources.map((entry) => (entry.id === normalized.id ? normalized : entry))
      : [...memoryAdminStore.importSources, normalized];
    return normalized;
  }

  try {
    const id = importSource.id || randomId();
    const result = await client.query(
      `insert into import_sources (
        id,
        name,
        description,
        company_column,
        productive_unit_column,
        user_column,
        badge_column,
        tone_column,
        award_column
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      on conflict (id) do update
      set name = excluded.name,
          description = excluded.description,
          company_column = excluded.company_column,
          productive_unit_column = excluded.productive_unit_column,
          user_column = excluded.user_column,
          badge_column = excluded.badge_column,
          tone_column = excluded.tone_column,
          award_column = excluded.award_column
      returning
        id,
        name,
        description,
        company_column,
        productive_unit_column,
        user_column,
        badge_column,
        tone_column,
        award_column`,
      [
        id,
        importSource.name,
        importSource.description || null,
        importSource.columns.company,
        importSource.columns.productive_unit,
        importSource.columns.user,
        importSource.columns.badge,
        importSource.columns.tone,
        importSource.columns.award,
      ],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      columns: {
        company: row.company_column,
        productive_unit: row.productive_unit_column,
        user: row.user_column,
        badge: row.badge_column,
        tone: row.tone_column,
        award: row.award_column,
      },
    };
  } finally {
    await client.end();
  }
};

export const bulkInviteUsers = async ({ emails, companyId, productiveUnitId }) => {
  const normalizedEmails = [...new Set(
    emails
      .map((email) => email.toLowerCase().trim())
      .filter(Boolean),
  )];

  const client = await createPgClient();

  if (!client) {
    const createdUsers = [];
    const skippedEmails = [];

    for (const email of normalizedEmails) {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        skippedEmails.push(email);
        continue;
      }

      createdUsers.push(await upsertMemoryUser({
        id: crypto.randomUUID(),
        email,
        full_name: email.split('@')[0],
        role: 'user',
        company_id: companyId || undefined,
        productive_unit_id: productiveUnitId || undefined,
        level: 1,
        xp: 0,
        email_verified: false,
        notifications: [],
        created_at: new Date().toISOString(),
      }));
    }

    return { createdUsers, skippedEmails };
  }

  try {
    if (productiveUnitId) {
      const productiveUnitCheck = await client.query(
        `select id
         from productive_units
         where id = $1
           and company_id = $2
         limit 1`,
        [productiveUnitId, companyId || null],
      );

      if (!productiveUnitCheck.rows[0]) {
        throw new Error('A unidade produtiva informada nao pertence a empresa selecionada.');
      }
    }

    await client.query('begin');

    const createdUsers = [];
    const skippedEmails = [];
    const passwordHash = await hashPassword('changeme123');

    for (const email of normalizedEmails) {
      const userId = crypto.randomUUID(); // Gera UUID no Node
      const result = await client.query(
        `insert into users (
          id,
          email,
          password_hash,
          full_name,
          role,
          company_id,
          productive_unit_id,
          level,
          xp,
          email_verified
        ) values ($1, $2, $3, $4, 'user', $5, $6, 1, 0, false)
        on conflict (email) do nothing
        returning id, email, full_name, role, company_id, productive_unit_id, level, xp, email_verified, created_at`,
        [
          userId,
          email,
          passwordHash,
          email.split('@')[0],
          companyId || null,
          productiveUnitId || null,
        ],
      );

      if (result.rows[0]) {
        createdUsers.push(result.rows[0]);
      } else {
        skippedEmails.push(email);
      }
    }

    await client.query('commit');
    return { createdUsers, skippedEmails };
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
};
