import { exec } from 'node:child_process';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não foi definido. Pulando prisma db push.');
  console.error('⚠️  Dados adicionados ao site NÃO serão persistidos!');
  process.exit(0);
}

console.log('📦 DATABASE_URL encontrada.');
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
