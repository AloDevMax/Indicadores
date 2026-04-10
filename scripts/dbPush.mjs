import { exec } from 'node:child_process';
import { checkDatabaseConnection } from '../server/db/checkConnection.mjs';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não foi definido. Pulando prisma db push.');
  console.error('⚠️  Dados adicionados ao site NÃO serão persistidos!');
  process.exit(0);
}

console.log('📦 DATABASE_URL encontrada.');
console.log('🔍 Verificando conexão com o banco de dados...');

// Primeiro, verifica a conexão
const isConnected = await checkDatabaseConnection(false);

if (!isConnected) {
  console.error('❌ Não foi possível conectar ao banco de dados.');
  console.error('⚠️  Verifique as credenciais no arquivo render.yaml');
  console.error('⚠️  Dados adicionados ao site NÃO serão persistidos após o deploy!');
  process.exit(1);
}

console.log('🚀 Executando prisma db push...');

const child = exec('npx prisma db push --schema=prisma/schema.prisma', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Falha ao executar prisma db push:', error.message);
    console.error(stderr);
    process.exit(error.code || 1);
  }
  console.log(stdout);
  console.log('✅ Schema do banco atualizado com sucesso!');
});

child.stdout?.pipe(process.stdout);
child.stderr?.pipe(process.stderr);
