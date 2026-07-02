import { exec } from 'node:child_process';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('⚠️  DATABASE_URL não foi definido. Pulando prisma db push.');
  console.log('   Dados adicionados ao site NÃO serão persistidos.');
  process.exit(0);
}

console.log('📦 DATABASE_URL encontrada');
console.log('🚀 Sincronizando schema com o banco de dados...\n');

const child = exec('npx prisma db push --schema=prisma/schema.prisma --skip-generate --accept-data-loss', (error, stdout, stderr) => {
  if (error) {
    if (stderr.includes('does not exist') || stderr.includes('Connection refused')) {
      console.warn('\n⚠️  Aviso: Banco de dados não acessível durante build');
      console.warn('   Dados serão sincronizados quando a aplicação iniciar');
      process.exit(0);
    }
    console.error('\n❌ Erro ao sincronizar schema:');
    console.error(stderr);
    process.exit(error.code || 1);
  }
  console.log(stdout);
  console.log('\n✅ Schema sincronizado com sucesso!\n');
});

child.stdout?.pipe(process.stdout);
child.stderr?.pipe(process.stderr);
