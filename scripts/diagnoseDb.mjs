#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const pgPackagePath = path.resolve(projectRoot, 'node_modules', 'pg', 'package.json');

console.log('🔍 Diagnóstico de Dependências\n');
console.log(`📍 Procurando pg em: ${pgPackagePath}\n`);

try {
  const pgPackageJson = JSON.parse(fs.readFileSync(pgPackagePath, 'utf-8'));
  console.log(`✅ Módulo pg está instalado!`);
  console.log(`   Versão: ${pgPackageJson.version}`);
  console.log(`   Descrição: ${pgPackageJson.description}\n`);
} catch (error) {
  console.error(`❌ Módulo pg NÃO foi encontrado`);
  console.error(`   Caminho: ${pgPackagePath}`);
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
