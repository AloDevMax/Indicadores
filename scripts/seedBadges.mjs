import { config } from 'dotenv';
config();
import { seedIndicatorBadges } from '../server/admin/repository.mjs';

const results = await seedIndicatorBadges();
for (const badge of results) {
  console.log(`✓ [${badge.id}] ${badge.name}`);
}
console.log(`\n${results.length} selos inseridos/atualizados.`);
