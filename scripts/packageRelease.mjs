#!/usr/bin/env node
// Gera o .zip para o deploy manual no Hostinger (hPanel → Node.js → upload), enquanto o deploy via GitHub
// estiver desligado. Empacota o commit da branch production, que o CI só avança depois de migrar o Supabase.
// Uso: npm run release:zip  →  releases/labquest-<data>-<sha>.zip
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const shortSha = (sha) => sha.slice(0, 7);

// git(args) roda o git e devolve o stdout; os testes injetam um fake.
export const packageRelease = async ({ git, outDir, now = new Date() }) => {
  try {
    await git(['fetch', 'origin', 'main', 'production']);
  } catch (error) {
    return { ok: false, error: `git fetch falhou: ${error.message}` };
  }

  const production = (await git(['rev-parse', 'origin/production'])).trim();
  const main = (await git(['rev-parse', 'origin/main'])).trim();

  // production atrás da main = o release do CI (migrations no Supabase) ainda não rodou para o código novo.
  if (production !== main) {
    return {
      ok: false,
      error: `production (${shortSha(production)}) difere da main (${shortSha(main)}): `
        + 'espere o job "Migrate Supabase and release" do CI terminar',
    };
  }

  const date = now.toISOString().slice(0, 10);
  const file = path.join(outDir, `labquest-${date}-${shortSha(production)}.zip`);
  await git(['archive', '--format=zip', '-o', file, production]);
  return { ok: true, sha: production, file };
};

const main = async () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const outDir = path.join(repoRoot, 'releases');
  fs.mkdirSync(outDir, { recursive: true });

  const run = promisify(execFile);
  const git = async (args) => (await run('git', args, { cwd: repoRoot })).stdout;

  const result = await packageRelease({ git, outDir });
  if (!result.ok) {
    console.error(`❌ ${result.error}`);
    process.exit(1);
  }

  const sizeKb = Math.round(fs.statSync(result.file).size / 1024);
  console.log(`✅ ${path.relative(repoRoot, result.file)} (${sizeKb} KB) — commit ${shortSha(result.sha)} da production`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
