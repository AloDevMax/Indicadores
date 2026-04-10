#!/usr/bin/env node

import { createPgClient } from '../server/db/client.mjs';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function testConnection() {
  console.log('\n═══════════════════════════════════════════');
  console.log('🧪 Teste de Conexão com PostgreSQL');
  console.log('═══════════════════════════════════════════\n');

  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('⚠️  DATABASE_URL não está definida no ambiente.\n');
    console.log('Digite a URL de conexão (formato: postgresql://user:password@host:port/database)');
    databaseUrl = await question('DATABASE_URL > ');
    
    if (!databaseUrl) {
      console.error('❌ URL não fornecida. Abortando.');
      rl.close();
      process.exit(1);
    }
  }

  console.log(`\n📍 Testando conexão com: ${databaseUrl.replace(/:[^:]*@/, ':****@')}\n`);

  try {
    const { Client } = await import('pg');
    
    const client = new Client({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      statement_timeout: 5000, // timeout de 5 segundos
    });

    console.log('⏳ Conectando ao banco de dados...');
    await client.connect();
    
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Teste básico
    const result = await client.query('SELECT NOW() as timestamp, VERSION() as version');
    const { timestamp, version } = result.rows[0];
    
    console.log('📊 Informações do Banco de Dados:');
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   PostgreSQL: ${version.split(',')[0]}\n`);

    // Verificar tabelas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log('📋 Tabelas encontradas:');
      tablesResult.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('⚠️  Nenhuma tabela encontrada (banco pode estar vazio)');
    }

    await client.end();
    
    console.log('\n✅ Teste concluído com sucesso!');
    console.log('🎉 Os dados SERÃO persistidos no banco!\n');
    
  } catch (error) {
    console.error('\n❌ Erro ao conectar:\n');
    console.error(`   ${error.message}\n`);

    console.log('🔧 Dicas de Resolução:');
    console.log('   1. Verifique se a URL está no formato correto:');
    console.log('      postgresql://user:password@host:port/database\n');
    console.log('   2. Verifique as credenciais:');
    console.log('      - Usuário existe?');
    console.log('      - Senha está correta?');
    console.log('      - Host é acessível?\n');
    console.log('   3. Se está usando Render:');
    console.log('      - Vá ao banco PostgreSQL');
    console.log('      - Aba "Connections"');
    console.log('      - Copie a Connection String completa\n');

    rl.close();
    process.exit(1);
  }

  rl.close();
}

testConnection();
