#!/usr/bin/env node
// Copia os arquivos de uma pasta local de uploads para o Supabase Storage e
// reescreve as URLs /uploads/<nome> no banco para a URL pública do bucket.
// Uso: node --env-file=.env scripts/migrateUploadsToStorage.mjs --dir <pasta> [--apply]
// Sem --apply roda em dry-run: nada é enviado nem alterado. Rodar de novo é seguro.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LOCAL_PREFIX = '/uploads/';

// Colunas que guardam URLs de arquivos enviados (modelo Prisma → coluna).
const TARGETS = [
  { model: 'user', label: 'users.avatar_url', column: 'avatar_url' },
  { model: 'badge', label: 'badges.image_url', column: 'image_url' },
  { model: 'badgeSubmission', label: 'badge_submissions.proof_url', column: 'proof_url' },
];

const MIME_BY_EXT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

const readLocalFile = async (dir, name) => {
  try {
    return await fs.promises.readFile(path.join(dir, name));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
};

// storage: { exists(name), put(name, buffer, mimeType) → url, urlFor(name) }
const migrateRow = async ({ prisma, storage, dir, apply, target, row }) => {
  // basename impede ler fora da pasta (/uploads/../x)
  const name = path.basename(row[target.column]);
  const buffer = await readLocalFile(dir, name);
  if (!buffer) return 'ausentes';
  if (!apply) return 'migrados';

  const url = (await storage.exists(name))
    ? storage.urlFor(name)
    : await storage.put(name, buffer, MIME_BY_EXT[path.extname(name).toLowerCase()] ?? 'application/octet-stream');

  await prisma[target.model].update({ where: { id: row.id }, data: { [target.column]: url } });
  return 'migrados';
};

export const migrateUploads = async ({ prisma, storage, dir, apply, log = console.log }) => {
  const summary = { migrados: 0, pulados: 0, ausentes: 0, falhas: 0 };

  for (const target of TARGETS) {
    const rows = await prisma[target.model].findMany({
      where: { [target.column]: { not: null } },
      select: { id: true, [target.column]: true },
    });

    for (const row of rows) {
      const value = row[target.column];
      if (!value) continue;
      if (!value.startsWith(LOCAL_PREFIX)) {
        summary.pulados += 1;
        continue;
      }

      try {
        const outcome = await migrateRow({ prisma, storage, dir, apply, target, row });
        summary[outcome] += 1;
        if (outcome === 'ausentes') log(`ausente: ${target.label} id=${row.id} ${value}`);
      } catch (error) {
        summary.falhas += 1;
        log(`falha: ${target.label} id=${row.id} ${value}: ${error.message}`);
      }
    }
  }

  return summary;
};

const parseArgs = (argv) => {
  const dirIndex = argv.indexOf('--dir');
  return { dir: dirIndex >= 0 ? argv[dirIndex + 1] : undefined, apply: argv.includes('--apply') };
};

const main = async () => {
  const { dir, apply } = parseArgs(process.argv.slice(2));
  if (!dir || !fs.existsSync(dir)) {
    console.error('Uso: node --env-file=.env scripts/migrateUploadsToStorage.mjs --dir <pasta-com-uploads> [--apply]');
    process.exit(1);
  }

  const { parseEnv } = await import('../server/config/env.mjs');
  const { createSupabaseStorageFromEnv } = await import('../server/uploads/storage/supabaseStorage.mjs');
  const { prisma } = await import('../server/shared/db/prisma.mjs');
  // Força a validação das variáveis do Supabase, qualquer que seja o STORAGE_DRIVER do .env.
  const storage = createSupabaseStorageFromEnv(parseEnv({ ...process.env, STORAGE_DRIVER: 'supabase' }));

  console.log(apply ? 'Modo --apply: enviando arquivos e atualizando o banco.' : 'Dry-run: nada será alterado.');
  try {
    const summary = await migrateUploads({ prisma, storage, dir, apply });
    console.log(`migrados: ${summary.migrados} / pulados: ${summary.pulados} / ausentes: ${summary.ausentes} / falhas: ${summary.falhas}`);
    process.exitCode = summary.falhas > 0 ? 1 : 0;
  } finally {
    await prisma.$disconnect();
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
