#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

console.log('🔍 Diagnóstico de Dependências\n');

// Checando se pg está em node_modules
const pgPath = new URL('../node_modules/pg/package.json', import.meta.url);

console.log(`📍 Procurando pg em: ${pgPath}\n`);

try {
  const pgPackageJson = JSON.parse(fs.readFileSync(pgPath.pathname, 'utf-8'));
  console.log(`✅ Módulo pg está instalado!`);
  console.log(`   Versão: ${pgPackageJson.version}`);
  console.log(`   Descrição: ${pgPackageJson.description}\n`);
} catch (error) {
  console.error(`❌ Módulo pg NÃO foi encontrado em node_modules`);
  console.error(`   Erro: ${error.message}\n`);
  console.error('💡 Solução: Execute npm install');
  process.exit(1);
}

// Checando se consegue fazer import
console.log('🧪 Tentando importar pg...');
try {
  const pg = await import('pg');
  console.log(`✅ Importação bem-sucedida!`);
  console.log(`   Client disponível: ${!!pg.Client}`);
  console.log(`   Pool disponível: ${!!pg.Pool}\n`);
} catch (error) {
  console.error(`❌ Falha ao importar pg`);
  console.error(`   Erro: ${error.message}\n`);
  process.exit(1);
}

console.log('✅ Diagnóstico concluído - pg está disponível!');
