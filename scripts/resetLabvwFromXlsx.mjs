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

const DEFAULT_PASSWORD = 'labvw@2026';

// Unidades derivadas 1-para-1 dos 13 arquivos em docs/xlsx (IZILAB e SJB são a
// mesma unidade — o título interno do arquivo IZILAB.xlsx está incorreto).
const PRODUCTIVE_UNITS = [
  { id: 'labvw-area-tecnica-blumenau', name: 'Área Técnica Blumenau' },
  { id: 'labvw-area-tecnica-brusque', name: 'Área Técnica Brusque' },
  { id: 'labvw-angeloni', name: 'Angeloni' },
  { id: 'labvw-azambuja-mais', name: 'Azambuja +' },
  { id: 'labvw-azambuja', name: 'Azambuja' },
  { id: 'labvw-blumenau', name: 'Blumenau' },
  { id: 'labvw-guabiruba', name: 'Guabiruba' },
  { id: 'labvw-hc', name: 'HC' },
  { id: 'labvw-sjb', name: 'SJB' },
  { id: 'labvw-pst', name: 'PST' },
  { id: 'labvw-prime', name: 'Prime' },
  { id: 'labvw-salutar', name: 'Salutar' },
];

// Cada colaborador foi extraído da união dos meses Janeiro–Junho/2026 em cada
// planilha (Julho–Dezembro contêm dados de template copiados entre unidades
// e meses, não são reais) e casado por nome com os e-mails já cadastrados
// hoje (validados também contra docs/xlsx/Lista de Usuários.xls, aba
// "Usuarios"). Onde a mesma pessoa batia com mais de uma unidade por
// contaminação de cópia entre planilhas, prevaleceu a unidade que a pessoa já
// tem cadastrada atualmente.
const CONFIRMED_USERS = [
  { full_name: 'Adriana Ferreira Lima', email: 'adriana.lima@labvw.com.br', unit_id: 'labvw-guabiruba' },
  { full_name: 'Alanis Cibele Januario dos Santos', email: 'alanis.santos@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Aline Serpa', email: 'aline.serpa@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Alyne Alves da Maia', email: 'alyne.maia@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Amanda Soares Rodrigues', email: 'amanda.rodrigues@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Ana Cristina Diniz de Oliveira', email: 'ana.oliveira@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Anna Julia da Rocha', email: 'anna.rocha@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Annanda Beatryz Kotarski', email: 'annanda.kotarski@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Artur Fiamoncini', email: 'artur.fiamoncini@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Astrid Bodenmüller', email: 'astrid.bodenmuller@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Bianca Kammers', email: 'bianca.kammers@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Bruna Adriele Mendes', email: 'bruna.mendes@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Bruna Durante da Silva', email: 'bruna.durante@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Bruna Maria Kruze', email: 'bruna.kruze@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Bruna Reis', email: 'bruna.reis@labvw.com.br', unit_id: 'labvw-prime' },
  { full_name: 'Bruna Ries', email: 'bruna.ries@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Bruna Silva Milagre', email: 'bruna.milagre@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Bruna de Araujo', email: 'bruna.araujo@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Camilli Raiser Machado', email: 'camilli.machado@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Camily Moraes', email: 'camily.moraes@labvw.com.br', unit_id: 'labvw-angeloni' },
  { full_name: 'Carolina Zabel', email: 'carolina.zabel@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Caroline Ribeiro dos Santos', email: 'rib.santoscaroline@gmail.com', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Celine Cardoso', email: 'celine.cardoso@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Cletiane Lopes Araujo', email: 'cletiane.araujo@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Dafne Galvão Pereira', email: 'dafne.pereira@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Damaris Apolo de Oliveira', email: 'damaris.oliveira@labvw.com.br', unit_id: 'labvw-sjb' },
  { full_name: 'Daniel Brito', email: 'daniel.brito@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Daniela Thayse Schwartz', email: 'daniela.schwartz@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Dienifer Machado Teles', email: 'dienifer.teles@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Edineia Regina dos Santos', email: 'edneia.santos@labvw.com.br', unit_id: 'labvw-prime' },
  { full_name: 'Edna Melo Camargo', email: 'edymcamargo@gmail.com', unit_id: 'labvw-sjb' },
  { full_name: 'Eduarda Bernardes Minusculi Simon', email: 'eduarda.simon@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Eliza Salazar', email: 'eliza.salazar@labvw.com.br', unit_id: 'labvw-pst' },
  { full_name: 'Emilly da Rosa', email: 'emilly.rosa@labvw.com.br', unit_id: 'labvw-prime' },
  { full_name: 'Flavia Alessandra Krul', email: 'flavia.krul@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Francyellen Amanda Costa Moura Modesto', email: 'francyellen.modesto@labvw.com.br', unit_id: 'labvw-azambuja-mais' },
  { full_name: 'Francyelly Aleshandra Costa Moura Modesto', email: 'francyelly.modesto@labvw.com.br', unit_id: 'labvw-pst' },
  { full_name: 'Gabriela de Oliveira', email: 'gabriela.oliveira@labvw.com.br', unit_id: 'labvw-azambuja-mais' },
  { full_name: 'Gilma de Souza Silva', email: 'gilma.silva@labvw.com.br', unit_id: 'labvw-hc' },
  { full_name: 'Ian Nicoletti', email: 'ian.nicoletti@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Jamili de Barros Alves', email: 'jamili.alves@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Jamily Alexandrina Lanzarin', email: 'lanzarinjamily1@gmail.com', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Jaqueline Maria da Silva Sbardelatti', email: 'jaqueline.sbardelatti@labvw.com.br', unit_id: 'labvw-prime' },
  { full_name: 'Joice Beatriz Jaraceski', email: 'joice.jaraceski@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Julia Gabriely Vanolli', email: 'julia.vanolli@labvw.com.br', unit_id: 'labvw-azambuja-mais' },
  { full_name: 'Julia Mohr', email: 'julia.mohr@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Jullyanna Kathleen Andrade Evangelista Brandão', email: 'jullyanna.brandao@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Kamyle Silveira Simas', email: 'kamyle.simas@labvw.com.br', unit_id: 'labvw-sjb' },
  { full_name: 'Karen Gabrielly da Silva Pereira', email: 'karen.pereira@labvw.com.br', unit_id: 'labvw-salutar' },
  { full_name: 'Katia Vieira', email: 'katia.vieira@labvw.com.br', unit_id: 'labvw-salutar' },
  { full_name: 'Larissa Pavesi', email: 'larissa.pavesi@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Larissa Santana Guedes', email: 'larissa.guedes@labvw.com.br', unit_id: 'labvw-guabiruba' },
  { full_name: 'Lavínia Luiza Silva', email: 'lavinia.silva@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Laysa Vitória Santiago Cardozo', email: 'laysa.cardozo@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Lethiciellen Patrinne Reis da Silva', email: 'lethiciellen.silva@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Leticia Vitória Lino Botelho de Moraes', email: 'leticia.moraes@labvw.com.br', unit_id: 'labvw-prime' },
  { full_name: 'Lucas Nathan Kramatchek Bueno', email: 'lucas.bueno@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Luis Felipe Foster Cecon', email: 'luis.cecon@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Lukas Baumann', email: 'lukas.baumann@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Maria Clara Diniz', email: 'maria.diniz@labvw.com.br', unit_id: 'labvw-angeloni' },
  { full_name: 'Maria Eduarda Pereira de Oliveira', email: 'meduarda.oliveira@labvw.com.br', unit_id: 'labvw-pst' },
  { full_name: 'Maria Julia Schramm', email: 'maria.julia@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Maria Luiza de Oliveira', email: 'maria.oliveira@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Maria Odete Pereira', email: 'odete@labvw.com.br', unit_id: 'labvw-salutar' },
  { full_name: 'Maria Teresa Bambineti', email: 'domjoaquim@labvw.com.br', unit_id: 'labvw-angeloni' },
  { full_name: 'Mariana Maestri', email: 'mariana@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
  { full_name: 'Marleane Mendonça dos Santos', email: 'marleane.santos@labvw.com.br', unit_id: 'labvw-salutar' },
  { full_name: 'Mayara do Nascimento', email: 'mayara.nascimento@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Natalia Cristina dos Santos', email: 'natalia.santos@labvw.com.br', unit_id: 'labvw-prime' },
  { full_name: 'Pamela Regina Luis', email: 'pamela.luis@labvw.com.br', unit_id: 'labvw-hc' },
  { full_name: 'Patricia Leopoldo da Silva Oliveira', email: 'patricia.oliveira@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Rafaela Lisboa de Oliveira', email: 'rafaela.oliveira@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Raimundo do Socorro Costa Neto', email: 'raimundo.neto@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Renata Albuquerque', email: 'renata.albuquerque@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Rosiane Lopes', email: 'rosiane.lopes@labvw.com.br', unit_id: 'labvw-azambuja' },
  { full_name: 'Rosineri Alves Evangelista', email: 'sterezinha@labvw.com.br', unit_id: 'labvw-pst' },
  { full_name: 'Sabrina Tomaz Chaiben', email: 'sabrina.chaiben@labvw.com.br', unit_id: 'labvw-pst' },
  { full_name: 'Sarah Cristina Ramos da Silva', email: 'sarah.silva@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Sueelen Cristina Stricker', email: 'sueelen.stricker@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Suelen Alessandra Adolfo da Silva', email: 'suelen.adolfo@labvw.com.br', unit_id: 'labvw-salutar' },
  { full_name: 'Tamara Rezini', email: 'tamara.rezini@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Thagrady Nascimento da Silva', email: 'thagrady.silva@labvw.com.br', unit_id: 'labvw-sjb' },
  { full_name: 'Thais Portela da Costa Fontes', email: 'thais.fontes@labvw.com.br', unit_id: 'labvw-blumenau' },
  { full_name: 'Vania Regina Sagica Reis', email: 'vania.reis@labvw.com.br', unit_id: 'labvw-guabiruba' },
  { full_name: 'Victoria Schoenfelder Ladewig', email: 'victoria.ladewig@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Viviane Resende', email: 'viviane.resende@labvw.com.br', unit_id: 'labvw-guabiruba' },
  { full_name: 'Wilianne Santos da Costa', email: 'wilianne.costa@labvw.com.br', unit_id: 'labvw-area-tecnica-blumenau' },
  { full_name: 'Élvis Forbici', email: 'elvis.forbici@labvw.com.br', unit_id: 'labvw-area-tecnica-brusque' },
];

// Pessoas que aparecem nos XLSX (Jan–Jun) sem e-mail cadastrado hoje. Sem
// e-mail real disponível, usam o padrão nome.sobrenome@labvw.com.br a pedido
// do usuário — devem ser revisadas/atualizadas depois pelo painel admin.
// 'Emili dos Santos Antunes' levou um e-mail com o nome completo porque
// colidiria com 'Emili Antunes' (mesmo primeiro nome + sobrenome final,
// unidades diferentes — vale checar se não são a mesma pessoa duplicada).
// 'Maria Luiza K.' usa o primeiro+segundo nome pois o sobrenome real é
// desconhecido (só a inicial "K." aparece na planilha).
const PENDING_NEW_USERS = [
  { xlsx_name: 'Bruna Roza', unit_id: 'labvw-angeloni', email: 'bruna.roza@labvw.com.br' },
  { xlsx_name: 'Melissa Winter', unit_id: 'labvw-angeloni', email: 'melissa.winter@labvw.com.br' },
  { xlsx_name: 'Jessica Cristina Ramos Da Luz', unit_id: 'labvw-azambuja', email: 'jessica.luz@labvw.com.br' },
  { xlsx_name: 'Emili Antunes', unit_id: 'labvw-azambuja-mais', email: 'emili.antunes@labvw.com.br' },
  { xlsx_name: 'Thagrady Belchor', unit_id: 'labvw-azambuja-mais', email: 'thagrady.belchor@labvw.com.br' },
  { xlsx_name: 'Adriana Luciana dos Santos', unit_id: 'labvw-blumenau', email: 'adriana.santos@labvw.com.br' },
  { xlsx_name: 'Maria Eduarda de Paula', unit_id: 'labvw-blumenau', email: 'maria.paula@labvw.com.br' },
  { xlsx_name: 'Mariana Vieira', unit_id: 'labvw-blumenau', email: 'mariana.vieira@labvw.com.br' },
  { xlsx_name: 'Mayara Ribeiro', unit_id: 'labvw-blumenau', email: 'mayara.ribeiro@labvw.com.br' },
  { xlsx_name: 'Mylena Freire de Carvalho Pires', unit_id: 'labvw-blumenau', email: 'mylena.pires@labvw.com.br' },
  { xlsx_name: 'Rosane de Souza Leão', unit_id: 'labvw-blumenau', email: 'rosane.leao@labvw.com.br' },
  { xlsx_name: 'Thais Cristina Rodrigues', unit_id: 'labvw-blumenau', email: 'thais.rodrigues@labvw.com.br' },
  { xlsx_name: 'Aline Araujo', unit_id: 'labvw-pst', email: 'aline.araujo@labvw.com.br' },
  { xlsx_name: 'Aline Costa', unit_id: 'labvw-pst', email: 'aline.costa@labvw.com.br' },
  { xlsx_name: 'Bruna Aparecida Miór', unit_id: 'labvw-sjb', email: 'bruna.mior@labvw.com.br' },
  { xlsx_name: 'Emili dos Santos Antunes', unit_id: 'labvw-sjb', email: 'emili.santos.antunes@labvw.com.br' },
  { xlsx_name: 'Jucilane Motta Zandonai do Amaral', unit_id: 'labvw-sjb', email: 'jucilane.amaral@labvw.com.br' },
  { xlsx_name: 'Larissa Messagi da Silva Rodrigues', unit_id: 'labvw-sjb', email: 'larissa.rodrigues@labvw.com.br' },
  { xlsx_name: 'Mylene Gabriele da Silva de Jesus', unit_id: 'labvw-sjb', email: 'mylene.jesus@labvw.com.br' },
  { xlsx_name: 'Amanda Gabriela', unit_id: 'labvw-area-tecnica-blumenau', email: 'amanda.gabriela@labvw.com.br' },
  { xlsx_name: 'Andressa T. Klabunde', unit_id: 'labvw-area-tecnica-blumenau', email: 'andressa.klabunde@labvw.com.br' },
  { xlsx_name: 'Luisa Mahnke Ruysam', unit_id: 'labvw-area-tecnica-blumenau', email: 'luisa.ruysam@labvw.com.br' },
  { xlsx_name: 'Maria Luiza K.', unit_id: 'labvw-area-tecnica-blumenau', email: 'maria.luiza@labvw.com.br' },
  { xlsx_name: 'Thaynara C. Dupilar', unit_id: 'labvw-area-tecnica-brusque', email: 'thaynara.dupilar@labvw.com.br' },
  { xlsx_name: 'Álvaro B. Netto', unit_id: 'labvw-area-tecnica-brusque', email: 'alvaro.netto@labvw.com.br' },
];

const client = await createPgClient();
if (!client) {
  console.error('❌ Sem conexão com o banco de dados. Defina DATABASE_URL no .env');
  process.exit(1);
}

try {
  console.log('🗑️  Resetando usuários (role=user) e unidades produtivas...');
  await client.query(`delete from auth_sessions where user_id in (select id from users where role = 'user')`);
  await client.query(`delete from user_badges where user_id in (select id from users where role = 'user')`);
  await client.query(`delete from badge_submissions where user_id in (select id from users where role = 'user')`);
  await client.query(`delete from notifications where user_id in (select id from users where role = 'user')`);
  const deletedUsers = await client.query("delete from users where role = 'user'");
  const deletedUnits = await client.query('delete from productive_units');
  console.log(`  ${deletedUsers.rowCount} usuários removidos, ${deletedUnits.rowCount} unidades removidas`);
  console.log('  (contas admin/developer preservadas — não têm productive_unit_id)');

  console.log('\n🏢 Criando unidades produtivas...');
  for (const unit of PRODUCTIVE_UNITS) {
    await client.query(
      `insert into productive_units (id, name, created_at) values ($1, $2, now())`,
      [unit.id, unit.name],
    );
    console.log(`  ✓ ${unit.name}`);
  }

  console.log('\n🔑 Gerando hash da senha padrão...');
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  console.log('\n👤 Criando usuários confirmados...');
  let created = 0;
  for (const user of CONFIRMED_USERS) {
    const id = crypto.randomUUID();
    const result = await client.query(
      `insert into users (id, email, password_hash, full_name, role, productive_unit_id, email_verified, created_at, updated_at)
       values ($1, $2, $3, $4, 'user', $5, true, now(), now())
       on conflict (email) do nothing
       returning email`,
      [id, user.email, passwordHash, user.full_name, user.unit_id],
    );
    if (result.rows[0]) {
      console.log(`  ✓ ${user.full_name} <${user.email}>`);
      created++;
    } else {
      console.log(`  - ${user.full_name} <${user.email}> — e-mail duplicado, ignorado`);
    }
  }

  console.log('\n⏳ Verificando pendentes (sem e-mail preenchido)...');
  let pendingInserted = 0;
  const stillPending = [];
  for (const user of PENDING_NEW_USERS) {
    if (!user.email || !user.unit_id) {
      stillPending.push(user);
      continue;
    }
    const id = crypto.randomUUID();
    const result = await client.query(
      `insert into users (id, email, password_hash, full_name, role, productive_unit_id, email_verified, created_at, updated_at)
       values ($1, $2, $3, $4, 'user', $5, true, now(), now())
       on conflict (email) do nothing
       returning email`,
      [id, user.email, passwordHash, user.xlsx_name, user.unit_id],
    );
    if (result.rows[0]) {
      console.log(`  ✓ ${user.xlsx_name} <${user.email}>`);
      pendingInserted++;
    }
  }

  console.log(`\n✅ Concluído!`);
  console.log(`   Unidades criadas: ${PRODUCTIVE_UNITS.length}`);
  console.log(`   Usuários confirmados criados: ${created}/${CONFIRMED_USERS.length}`);
  console.log(`   Usuários pendentes criados agora: ${pendingInserted}/${PENDING_NEW_USERS.length}`);
  if (stillPending.length > 0) {
    console.log(`\n⚠️  Ainda faltam ${stillPending.length} pessoas sem e-mail/unidade confirmados:`);
    for (const p of stillPending) {
      console.log(`   - ${p.xlsx_name}${p.unit_id ? '' : ' (unidade também pendente)'}`);
    }
    console.log('   Preencha "email" (e "unit_id" quando marcado) em PENDING_NEW_USERS e rode o script de novo.');
  }
  console.log(`\n   Senha padrão: ${DEFAULT_PASSWORD}`);
} finally {
  await client.end();
}
