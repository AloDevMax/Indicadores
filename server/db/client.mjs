export const createPgClient = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('[DATABASE] DATABASE_URL não definida - usando fallback em memória');
    return null;
  }

  try {
    const { Client } = await import('pg');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
    });
    await client.connect();
    return client;
  } catch (error) {
    console.error('[DATABASE] ❌ Falha ao conectar PostgreSQL:');
    console.error(`   Erro: ${error.message}`);
    console.error('   ℹ️  Verifique:');
    console.error('      - DATABASE_URL está correto no render.yaml');
    console.error('      - Banco PostgreSQL está acessível');
    console.error('      - Credenciais estão corretas');
    console.error('')
    console.warn('   ⚠️  Usando fallback em memória (DADOS NÃO SERÃO PERSISTIDOS!)');
    return null;
  }
};
