import { checkDatabaseConnection } from './server/db/checkConnection.mjs';

const databaseConnected = await checkDatabaseConnection(false);

if (!databaseConnected) {
  console.warn('\n⚠️  [AVISO CRÍTICO]');
  console.warn('⚠️  A aplicação está rodando EM MODO DE FALLBACK (memória)');
  console.warn('⚠️  Dados adicionados ao site NÃO serão persistidos após reiniciar o servidor!');
  console.warn('⚠️  Isso é normal em desenvolvimento, mas em PRODUÇÃO é um problema.\n');
  
  console.warn('ℹ️  Verifique:\n');
  console.warn('   1. Se a variável DATABASE_URL está definida corretamente');
  console.warn('   2. Se o banco de dados PostgreSQL está acessível');
  console.warn('   3. Se as credenciais estão corretas\n');
}
