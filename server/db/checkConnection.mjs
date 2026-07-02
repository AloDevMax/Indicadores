import { createPgClient } from './client.mjs';

export const checkDatabaseConnection = async (exitOnFailure = false) => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ [DATABASE] DATABASE_URL não está definida');
    if (exitOnFailure) process.exit(1);
    return false;
  }

  try {
    console.log('[DATABASE] Testando conexão com PostgreSQL...');
    const client = await createPgClient();
    
    if (!client) {
      console.error('❌ [DATABASE] Falha ao criar cliente PostgreSQL');
      if (exitOnFailure) process.exit(1);
      return false;
    }

    const result = await client.query('SELECT NOW()');
    console.log('✅ [DATABASE] Conexão com PostgreSQL estabelecida com sucesso');
    console.log(`   Timestamp do banco: ${result.rows[0].now}`);
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ [DATABASE] Erro ao conectar:', error.message);
    if (exitOnFailure) process.exit(1);
    return false;
  }
};

// Execute se rodado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDatabaseConnection(true).catch(err => {
    console.error('Erro crítico:', err);
    process.exit(1);
  });
}
