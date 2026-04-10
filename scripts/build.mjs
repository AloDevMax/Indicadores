#!/usr/bin/env node

/**
 * Script de Build Seguro
 * Garante que npm install roda antes de qualquer coisa
 * Usado no Render para evitar falhas de dependências
 */

import { execSync } from 'node:child_process';
import process from 'node:process';

console.log('\n🚀 Build Report\n');
console.log('========================================');
console.log('1️⃣  Garantindo que npm install rodou...');
console.log('========================================\n');

try {
  execSync('npm install --production=false', { 
    stdio: 'inherit',
    cwd: process.cwd() 
  });
  console.log('\n✅ Dependências instaladas\n');
} catch (error) {
  console.error('\n❌ npm install falhou');
  process.exit(1);
}

console.log('2️⃣  Verificando módulo pg...');
console.log('----------------------------------------\n');

try {
  execSync('npm run db:diagnose', { 
    stdio: 'inherit',
    cwd: process.cwd() 
  });
} catch (error) {
  console.error('\n⚠️  Aviso: pg não está disponível');
  console.error('   Continuando build mesmo assim...\n');
}

console.log('\n3️⃣  Sincronizando schema do banco de dados...');
console.log('----------------------------------------\n');

try {
  execSync('npm run db:push', { 
    stdio: 'inherit',
    cwd: process.cwd() 
  });
} catch (error) {
  console.error('\n⚠️  db:push falhou, mas continuando\n');
}

console.log('\n4️⃣  Gerando cliente Prisma...');
console.log('----------------------------------------\n');

try {
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: process.cwd() 
  });
  console.log('\n✅ Prisma Client gerado\n');
} catch (error) {
  console.error('\n❌ Falha ao gerar Prisma Client');
  process.exit(1);
}

console.log('5️⃣  Compilando frontend (Vite + TypeScript)...');
console.log('----------------------------------------\n');

try {
  execSync('vite build', { 
    stdio: 'inherit',
    cwd: process.cwd() 
  });
  console.log('\n✅ Frontend compilado\n');
} catch (error) {
  console.error('\n❌ Falha ao compilar Vite');
  process.exit(1);
}

console.log('6️⃣  Type checking com TypeScript...');
console.log('----------------------------------------\n');

try {
  execSync('tsc --project tsconfig.json', { 
    stdio: 'inherit',
    cwd: process.cwd() 
  });
  console.log('\n✅ Type checking passou\n');
} catch (error) {
  console.error('\n❌ Falha no type checking');
  process.exit(1);
}

console.log('========================================');
console.log('✅ BUILD CONCLUÍDO COM SUCESSO!');
console.log('========================================\n');
