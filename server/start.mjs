// Entry do servidor (`node server/start.mjs`, `node dist/server/start.mjs`).
// Sobe o servidor incondicionalmente: o Hostinger carrega este arquivo a partir
// de um wrapper, então uma guarda como `process.argv[1] === __filename` nunca
// seria verdadeira lá. server/index.mjs só define o app e pode ser importado
// pelos testes sem efeitos colaterais.
import { startServer } from './index.mjs';
import { prisma } from './shared/db/prisma.mjs';

const server = await startServer();

process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] SIGTERM recebido, encerrando...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
