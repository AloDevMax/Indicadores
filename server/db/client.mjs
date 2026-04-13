// Importação estática para garantir que erro aparece se pg não estiver disponível
let PgClient = null;

try {
  const pgModule = await import('pg');
  PgClient = pgModule.Client;
  console.log('[DATABASE] ✅ Módulo pg carregado com sucesso');
} catch (error) {
  console.error('[DATABASE] ❌ Falha ao carregar módulo pg');
  console.error(`   Erro: ${error.message}`);
  console.error('   Verifique se npm install foi executado');
}

export const createPgClient = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn('[DATABASE] DATABASE_URL não definida - usando fallback em memória');
    return null;
  }

  if (!PgClient) {
    console.warn('[DATABASE] Módulo pg não disponível - usando fallback em memória');
    console.warn('   DADOS NÃO SERÃO PERSISTIDOS');
    return null;
  }

  try {
    const client = new PgClient({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      // Adiciona timeout para evitar travamentos
      statement_timeout: 30000,
      idle_in_transaction_session_timeout: 30000,
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('[DATABASE] ❌ Erro ao conectar:');
    console.error(`   Tipo: ${error.code ?? error.name}`);
    console.error(`   Mensagem: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   Causa: Banco de dados não está acessível');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   Causa: Host não encontrado - verifique a URL');
    } else if (error.message.includes('password authentication failed')) {
      console.error('   Causa: Senha ou usuário incorrect');
    }
    
    console.warn('   ⚠️  Usando fallback em memória (DADOS NÃO SERÃO PERSISTIDOS!)');
    return null;
  }
};
