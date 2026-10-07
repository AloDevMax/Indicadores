import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from '../shared/db/prisma.mjs';
import { ensureBuiltInDeveloper } from '../auth/repository.mjs';

// Dados de demonstração para o banco local. Nunca entram em produção:
// só são gravados com `--demo` (npm run db:seed -- --demo).
export const DEMO_DATA = Object.freeze({
  badges: [
    { id: '1', name: 'Mestre de Processos', description: 'Documentou 10 processos sem erros', icon_name: '📋', category: 'Qualidade', points: 50 },
    { id: '2', name: 'Segurança em Primeiro Lugar', description: 'Zero incidentes por 30 dias consecutivos', icon_name: '🦺', category: 'Segurança', points: 30 },
    { id: '3', name: 'Ninja da Eficiência', description: 'Reduziu desperdícios em 15% na produção', icon_name: '🥷', category: 'Eficiência', points: 40 },
    { id: '4', name: 'Herói do Cliente', description: 'Recebeu 5 feedbacks positivos de clientes', icon_name: '🦸', category: 'Serviço', points: 20 },
  ],
  productiveUnits: [
    { id: 'pu1', name: 'Fábrica Campinas' },
    { id: 'pu2', name: 'Centro de Distribuição SP' },
    { id: 'pu3', name: 'Obra Matriz' },
  ],
  importSources: [
    {
      id: 'source-default',
      name: 'Planilha Operacional',
      description: 'Modelo base para importar unidade, colaborador e selo.',
      productive_unit_column: 'unidade_produtiva',
      user_column: 'colaborador',
      badge_column: 'selo',
      tone_column: 'marcacao',
      award_column: 'premio',
    },
  ],
});

const upsertAll = async (delegate, rows) => {
  for (const { id, ...fields } of rows) {
    await delegate.upsert({ where: { id }, create: { id, ...fields }, update: fields });
  }
};

const seedDemoData = async () => {
  await upsertAll(prisma.productiveUnit, DEMO_DATA.productiveUnits);
  await upsertAll(prisma.badge, DEMO_DATA.badges);
  await upsertAll(prisma.importSource, DEMO_DATA.importSources);
};

/** Idempotente: pode rodar a cada deploy. */
export const runSeed = async ({ demo = false } = {}) => {
  await ensureBuiltInDeveloper();
  if (demo) await seedDemoData();
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const demo = process.argv.includes('--demo');
  try {
    await runSeed({ demo });
    console.log(`[SEED] Conta developer garantida${demo ? ' e dados de demonstração gravados' : ''}.`);
  } catch (error) {
    console.error('[SEED] Falhou:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
