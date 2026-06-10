import crypto from 'node:crypto';
import { config } from 'dotenv';
config();
import { createPgClient } from '../dist/server/db/client.mjs';

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
  return `scrypt:${salt}:${Buffer.from(derivedKey).toString('hex')}`;
};

const COMPANY_ID = 'hv7w1ev4x';
const PRODUCTIVE_UNIT_ID = 'stmytzerl';
const DEFAULT_PASSWORD = 'teste123';

const USERS = [
  { full_name: 'Alanis Cibele',              email: 'alanis.cibele@labvw.com.br' },
  { full_name: 'Artur Fiamoncini',            email: 'artur.fiamoncini@labvw.com.br' },
  { full_name: 'Bianca Kammers',             email: 'bianca.kammers@labvw.com.br' },
  { full_name: 'Flávia Alessandra Krul',     email: 'flavia.krul@labvw.com.br' },
  { full_name: 'Maria Julia Schramm',        email: 'maria.schramm@labvw.com.br' },
  { full_name: 'Mariana Vieira',             email: 'mariana.vieira@labvw.com.br' },
  { full_name: 'Sueelen Cristina Stricker',  email: 'sueelen.stricker@labvw.com.br' },
  { full_name: 'Thais Cristina Rodrigues',   email: 'thais.rodrigues@labvw.com.br' },
  { full_name: 'Thaís Fontes',              email: 'thais.fontes@labvw.com.br' },
];

const client = await createPgClient();
if (!client) {
  console.error('Sem conexão com o banco de dados.');
  process.exit(1);
}

try {
  for (const user of USERS) {
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    const result = await client.query(
      `insert into users (id, email, password_hash, full_name, role, company_id, productive_unit_id, level, xp, email_verified)
       values ($1, $2, $3, $4, 'user', $5, $6, 1, 0, true)
       on conflict (email) do nothing
       returning id, email, full_name`,
      [id, user.email, passwordHash, user.full_name, COMPANY_ID, PRODUCTIVE_UNIT_ID],
    );

    if (result.rows[0]) {
      console.log(`✓ ${result.rows[0].full_name} <${result.rows[0].email}>`);
    } else {
      console.log(`- ${user.full_name} <${user.email}> — já existe, ignorado`);
    }
  }
  console.log('\nConcluído.');
} finally {
  await client.end();
}
