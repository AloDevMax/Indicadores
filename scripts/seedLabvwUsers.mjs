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

const COMPANY_ID = 'labvw';
const DEFAULT_PASSWORD = 'labvw@2026';

const PRODUCTIVE_UNITS = [
  { id: 'labvw-administrativo',   name: 'Administrativo' },
  { id: 'labvw-angeloni',         name: 'Angeloni' },
  { id: 'labvw-azambuja',         name: 'Azambuja' },
  { id: 'labvw-azambuja-mais',    name: 'Azambuja Mais' },
  { id: 'labvw-blumenau',         name: 'Blumenau' },
  { id: 'labvw-guabiruba',        name: 'Guabiruba' },
  { id: 'labvw-hc',               name: 'HC' },
  { id: 'labvw-laboratorio',      name: 'Laboratório' },
  { id: 'labvw-prime',            name: 'Prime' },
  { id: 'labvw-sac',              name: 'SAC' },
  { id: 'labvw-salutar',          name: 'Salutar' },
  { id: 'labvw-santa-terezinha',  name: 'Santa Terezinha' },
  { id: 'labvw-sao-joao-batista', name: 'São João Batista' },
  { id: 'labvw-timbo-matriz',     name: 'Timbó Matriz' },
  { id: 'labvw-area-tecnica-1',   name: 'Área Técnica 1' },
  { id: 'labvw-area-tecnica-2',   name: 'Área Técnica 2' },
];

const USERS = [
  { full_name: 'Viviane Resende',                              email: 'viviane.resende@labvw.com.br',       unit_id: 'labvw-angeloni' },
  { full_name: 'Aloisio Cesario Pereira de Castro',            email: 'aloisio.castro@labvw.com.br',        unit_id: 'labvw-laboratorio' },
  { full_name: 'Romulo Gabriel Saavedra do Nascimento',        email: 'gabrielromulo513@gmail.com',         unit_id: 'labvw-laboratorio' },
  { full_name: 'Maria Teresa Bambineti',                       email: 'domjoaquim@labvw.com.br',            unit_id: 'labvw-angeloni' },
  { full_name: 'Daniela Thayse Schwartz',                      email: 'daniela.schwartz@labvw.com.br',     unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Anna Julia da Rocha',                          email: 'anna.rocha@labvw.com.br',            unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Maria Clara Diniz',                            email: 'maria.diniz@labvw.com.br',           unit_id: 'labvw-angeloni' },
  { full_name: 'Camily Moraes',                                email: 'camily.moraes@labvw.com.br',         unit_id: 'labvw-angeloni' },
  { full_name: 'Suelen Alessandra Adolfo da Silva',            email: 'suelen.adolfo@labvw.com.br',         unit_id: 'labvw-angeloni' },
  { full_name: 'Camilli Raiser Machado',                       email: 'camilli.machado@labvw.com.br',       unit_id: 'labvw-azambuja' },
  { full_name: 'Katia Vieira',                                 email: 'katia.vieira@labvw.com.br',          unit_id: 'labvw-azambuja' },
  { full_name: 'Jullyanna Kathleen Andrade Evangelista Brandão', email: 'jullyanna.brandao@labvw.com.br',  unit_id: 'labvw-azambuja' },
  { full_name: 'Astrid Bodenmüller',                           email: 'astrid.bodenmuller@labvw.com.br',   unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Julia Graciela Bernardo',                      email: 'julia.bernardo@labvw.com.br',        unit_id: 'labvw-azambuja' },
  { full_name: 'Renata Albuquerque',                           email: 'renata.albuquerque@labvw.com.br',    unit_id: 'labvw-azambuja' },
  { full_name: 'Rafaela Lisboa de Oliveira',                   email: 'rafaela.oliveira@labvw.com.br',     unit_id: 'labvw-azambuja' },
  { full_name: 'Ana Cristina Diniz de Oliveira',               email: 'ana.oliveira@labvw.com.br',          unit_id: 'labvw-azambuja' },
  { full_name: 'Jamili de Barros Alves',                       email: 'jamili.alves@labvw.com.br',          unit_id: 'labvw-azambuja' },
  { full_name: 'Érica Luiza Peters',                           email: 'erica.peters@labvw.com.br',          unit_id: 'labvw-administrativo' },
  { full_name: 'Rosiane Lopes',                                email: 'rosiane.lopes@labvw.com.br',         unit_id: 'labvw-azambuja' },
  { full_name: 'Caroline Ribeiro dos Santos',                  email: 'rib.santoscaroline@gmail.com',       unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Daniel Brito',                                 email: 'daniel.brito@labvw.com.br',          unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Bruna Durante da Silva',                       email: 'bruna.durante@labvw.com.br',         unit_id: 'labvw-azambuja' },
  { full_name: 'Eduarda Bernardes Minusculi Simon',            email: 'eduarda.simon@labvw.com.br',         unit_id: 'labvw-azambuja' },
  { full_name: 'Eduarda da Silva Galvão',                      email: 'eduarda.galvao@labvw.com.br',        unit_id: 'labvw-administrativo' },
  { full_name: 'Bruna Ries',                                   email: 'bruna.ries@labvw.com.br',            unit_id: 'labvw-azambuja' },
  { full_name: 'Joice Beatriz Jaraceski',                      email: 'joice.jaraceski@labvw.com.br',       unit_id: 'labvw-azambuja' },
  { full_name: 'Janice Maria Civinski',                        email: 'janice@labvw.com.br',                unit_id: 'labvw-azambuja' },
  { full_name: 'Adriana Helena Sedrez',                        email: 'adriana@labvw.com.br',               unit_id: 'labvw-azambuja' },
  { full_name: 'Élvis Forbici',                                email: 'elvis.forbici@labvw.com.br',         unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Renata Barbosa Porto',                         email: 'renata.porto@labvw.com.br',          unit_id: 'labvw-azambuja' },
  { full_name: 'Carolina Zabel',                               email: 'carolina.zabel@labvw.com.br',        unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Jennifer Cristine Ferreira',                   email: 'jennifer.ferreira@labvw.com.br',    unit_id: 'labvw-administrativo' },
  { full_name: 'Maria Luiza de Oliveira',                      email: 'maria.oliveira@labvw.com.br',        unit_id: 'labvw-azambuja' },
  { full_name: 'Wilianne Santos da Costa',                     email: 'wilianne.costa@labvw.com.br',        unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Yasmin Eccher Bertolini',                      email: 'yasmin.bertolini@labvw.com.br',     unit_id: 'labvw-sac' },
  { full_name: 'Werner Gustavo Vieira Willrich',               email: 'wernergustavo@labvw.com.br',         unit_id: 'labvw-azambuja' },
  { full_name: 'Dienifer Machado Teles',                       email: 'dienifer.teles@labvw.com.br',        unit_id: 'labvw-azambuja' },
  { full_name: 'Julia Gabriely Vanolli',                       email: 'julia.vanolli@labvw.com.br',         unit_id: 'labvw-azambuja-mais' },
  { full_name: 'Cletiane Lopes Araujo',                        email: 'cletiane.araujo@labvw.com.br',      unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Aline Santos de Silva',                        email: 'aline.santos@labvw.com.br',          unit_id: 'labvw-laboratorio' },
  { full_name: 'Thagrady Nascimento da Silva',                 email: 'thagrady.silva@labvw.com.br',        unit_id: 'labvw-azambuja-mais' },
  { full_name: 'Gabriela de Oliveira',                         email: 'gabriela.oliveira@labvw.com.br',    unit_id: 'labvw-azambuja-mais' },
  { full_name: 'Alyne Alves da Maia',                          email: 'alyne.maia@labvw.com.br',            unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Anieli Maria Busquirolli',                     email: 'anieli.busquirolli@labvw.com.br',   unit_id: 'labvw-sac' },
  { full_name: 'Sarah Cristina Ramos da Silva',                email: 'sarah.silva@labvw.com.br',           unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Francyellen Amanda Costa Moura Modesto',       email: 'francyellen.modesto@labvw.com.br',  unit_id: 'labvw-azambuja-mais' },
  { full_name: 'Thais Portela da Costa Fontes',                email: 'thais.fontes@labvw.com.br',          unit_id: 'labvw-blumenau' },
  { full_name: 'Dafne Galvão Pereira',                         email: 'dafne.pereira@labvw.com.br',         unit_id: 'labvw-blumenau' },
  { full_name: 'Alanis Cibele Januario dos Santos',            email: 'alanis.santos@labvw.com.br',         unit_id: 'labvw-blumenau' },
  { full_name: 'Mayara do Nascimento',                         email: 'mayara.nascimento@labvw.com.br',    unit_id: 'labvw-blumenau' },
  { full_name: 'Artur Fiamoncini',                             email: 'artur.fiamoncini@labvw.com.br',     unit_id: 'labvw-blumenau' },
  { full_name: 'Flavia Alessandra Krul',                       email: 'flavia.krul@labvw.com.br',           unit_id: 'labvw-blumenau' },
  { full_name: 'Tamara Rezini',                                email: 'tamara.rezini@labvw.com.br',         unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Laysa Vitória Santiago Cardozo',               email: 'laysa.cardozo@labvw.com.br',         unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Lukas Baumann',                                email: 'lukas.baumann@labvw.com.br',         unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Lavínia Luiza Silva',                          email: 'lavinia.silva@labvw.com.br',         unit_id: 'labvw-blumenau' },
  { full_name: 'Maria Julia Schramm',                          email: 'maria.julia@labvw.com.br',           unit_id: 'labvw-blumenau' },
  { full_name: 'Victoria Schoenfelder Ladewig',                email: 'victoria.ladewig@labvw.com.br',     unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Aline Serpa',                                  email: 'aline.serpa@labvw.com.br',           unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Matheus Henrique Fischer',                     email: 'matheus.fischer@labvw.com.br',       unit_id: 'labvw-laboratorio' },
  { full_name: 'Sueelen Cristina Stricker',                    email: 'sueelen.stricker@labvw.com.br',     unit_id: 'labvw-blumenau' },
  { full_name: 'Bianca Kammers',                               email: 'bianca.kammers@labvw.com.br',        unit_id: 'labvw-blumenau' },
  { full_name: 'Vania Regina Sagica Reis',                     email: 'vania.reis@labvw.com.br',            unit_id: 'labvw-guabiruba' },
  { full_name: 'Gilma de Souza Silva',                         email: 'gilma.silva@labvw.com.br',           unit_id: 'labvw-hc' },
  { full_name: 'Lethiciellen Patrinne Reis da Silva',          email: 'lethiciellen.silva@labvw.com.br',   unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Mariana Maestri',                              email: 'mariana@labvw.com.br',               unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Pamela Regina Luis',                           email: 'pamela.luis@labvw.com.br',           unit_id: 'labvw-hc' },
  { full_name: 'Natalia Cristina dos Santos',                  email: 'natalia.santos@labvw.com.br',        unit_id: 'labvw-prime' },
  { full_name: 'Bruna Reis',                                   email: 'bruna.reis@labvw.com.br',            unit_id: 'labvw-prime' },
  { full_name: 'Lais da Cunha',                                email: 'laisdacunha87@gmail.com',            unit_id: 'labvw-laboratorio' },
  { full_name: 'Leticia Vitória Lino Botelho de Moraes',      email: 'leticia.moraes@labvw.com.br',        unit_id: 'labvw-prime' },
  { full_name: 'Luis Felipe Foster Cecon',                     email: 'luis.cecon@labvw.com.br',            unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Julia Mohr',                                   email: 'julia.mohr@labvw.com.br',            unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Jaqueline Maria da Silva Sbardelatti',         email: 'jaqueline.sbardelatti@labvw.com.br', unit_id: 'labvw-prime' },
  { full_name: 'Emilly da Rosa',                               email: 'emilly.rosa@labvw.com.br',           unit_id: 'labvw-prime' },
  { full_name: 'HI Ti do Lab',                                 email: 'suporte@hisolucoes.com.br',          unit_id: 'labvw-administrativo' },
  { full_name: 'Marleane Mendonça dos Santos',                 email: 'marleane.santos@labvw.com.br',       unit_id: 'labvw-prime' },
  { full_name: 'Edineia Regina dos Santos',                    email: 'edneia.santos@labvw.com.br',         unit_id: 'labvw-prime' },
  { full_name: 'Bruna Adriele Mendes',                         email: 'bruna.mendes@labvw.com.br',          unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Maria Odete Pereira',                          email: 'odete@labvw.com.br',                 unit_id: 'labvw-salutar' },
  { full_name: 'Karen Gabrielly da Silva Pereira',             email: 'karen.pereira@labvw.com.br',         unit_id: 'labvw-salutar' },
  { full_name: 'Annanda Beatryz Kotarski',                     email: 'annanda.kotarski@labvw.com.br',     unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Larissa Santana Guedes',                       email: 'larissa.guedes@labvw.com.br',        unit_id: 'labvw-salutar' },
  { full_name: 'Adriana Ferreira Lima',                        email: 'adriana.lima@labvw.com.br',          unit_id: 'labvw-santa-terezinha' },
  { full_name: 'Kamyle Silveira Simas',                        email: 'kamyle.simas@labvw.com.br',          unit_id: 'labvw-santa-terezinha' },
  { full_name: 'Francyelly Aleshandra Costa Moura Modesto',   email: 'francyelly.modesto@labvw.com.br',   unit_id: 'labvw-santa-terezinha' },
  { full_name: 'Jamily Alexandrina Lanzarin',                  email: 'lanzarinjamily1@gmail.com',          unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Sabrina Tomaz Chaiben',                        email: 'sabrina.chaiben@labvw.com.br',       unit_id: 'labvw-santa-terezinha' },
  { full_name: 'Eliza Salazar',                                email: 'eliza.salazar@labvw.com.br',         unit_id: 'labvw-santa-terezinha' },
  { full_name: 'Raimundo do Socorro Costa Neto',               email: 'raimundo.neto@labvw.com.br',         unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Maria Eduarda Pereira de Oliveira',            email: 'meduarda.oliveira@labvw.com.br',    unit_id: 'labvw-santa-terezinha' },
  { full_name: 'Rosineri Alves Evangelista',                   email: 'sterezinha@labvw.com.br',            unit_id: 'labvw-santa-terezinha' },
  { full_name: 'Bruna de Araujo',                              email: 'bruna.araujo@labvw.com.br',          unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Damaris Apolo de Oliveira',                    email: 'damaris.oliveira@labvw.com.br',     unit_id: 'labvw-sao-joao-batista' },
  { full_name: 'Edna Melo Camargo',                            email: 'edymcamargo@gmail.com',              unit_id: 'labvw-sao-joao-batista' },
  { full_name: 'Lucas Nathan Kramatchek Bueno',                email: 'lucas.bueno@labvw.com.br',           unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Luan Roberto Ewers',                           email: 'luan.ewers@labvw.com.br',            unit_id: 'labvw-administrativo' },
  { full_name: 'Emelly Fagundes',                              email: 'emelly.fagundes@labotim.com.br',    unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Patricia Leopoldo da Silva Oliveira',          email: 'patricia.oliveira@labvw.com.br',    unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Michelly Thais Felippi',                       email: 'michelly.felippi@labotim.com.br',   unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Bruna Silva Milagre',                          email: 'bruna.milagre@labvw.com.br',         unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Lanna Jolinny Sousa Ferreira',                 email: 'lanna.ferreira@labotim.com.br',     unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Leiliane Naiara Bloedorn',                     email: 'leiliane.bloedorn@labotim.com.br',  unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Victoria Feitosa de Souza',                    email: 'victoria.souza@labvw.com.br',        unit_id: 'labvw-sac' },
  { full_name: 'Luciane de Oliveira Martim',                   email: 'luciane.martim@labotim.com.br',     unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Chayenne Uller',                               email: 'chayenne.uller@labotim.com.br',     unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Maria Telma Silva Wolff',                      email: 'maria.wolff@labotim.com.br',         unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Delair Aparecida Krauss',                      email: 'delair.krauss@labotim.com.br',      unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Micaela Keysi Bell',                           email: 'micaela.bell@labotim.com.br',        unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Josiane Souza',                                email: 'josiane.souza@labotim.com.br',       unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Larissa Pavesi',                               email: 'larissa.pavesi@labvw.com.br',        unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Maria Eduarda Capstrano',                      email: 'maria.capstrano@labotim.com.br',    unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Kauane Eduarda Kleinschmidt',                  email: 'kauane.kleinschmidt@labotim.com.br', unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Maria Aline da Graça',                         email: 'maria.graca@labvw.com.br',           unit_id: 'labvw-administrativo' },
  { full_name: 'Adriana Debastiani',                           email: 'adriana.debastiani@labotim.com.br', unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Gabriella Fernandes de Santana Farias',        email: 'gabriella.farias@labotim.com.br',   unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Camila Uller',                                 email: 'camila.uller@labotim.com.br',        unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Amanda Soares Rodrigues',                      email: 'amanda.rodrigues@labvw.com.br',     unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Celine Cardoso',                               email: 'celine.cardoso@labvw.com.br',        unit_id: 'labvw-area-tecnica-1' },
  { full_name: 'Cristiane de Sousa',                           email: 'cristiane.sousa@labvw.com.br',       unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Ana Julia Uler',                               email: 'ana.uler@labotim.com.br',            unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Simone Araujo',                                email: 'simone.araujo@labotim.com.br',       unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Amanda Santos de Oliveira',                    email: 'amanda.oliveira@labvw.com.br',       unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Ediana de Lima Pinheiro',                      email: 'ediana.pinheiro@labotim.com.br',    unit_id: 'labvw-timbo-matriz' },
  { full_name: 'Ian Nicoletti',                                email: 'ian.nicoletti@labvw.com.br',         unit_id: 'labvw-area-tecnica-2' },
  { full_name: 'Bruna Maria Kruze',                            email: 'bruna.kruze@labvw.com.br',           unit_id: 'labvw-area-tecnica-1' },
];

const client = await createPgClient();
if (!client) {
  console.error('❌ Sem conexão com o banco de dados. Defina DATABASE_URL no .env');
  process.exit(1);
}

console.log('🔑 Gerando hash da senha padrão...');
const passwordHash = await hashPassword(DEFAULT_PASSWORD);

try {
  // 1. Company
  console.log('\n📦 Criando empresa LabVW...');
  const companyResult = await client.query(
    `INSERT INTO companies (id, name, category, created_at)
     VALUES ($1, 'LabVW', 'Laboratório', NOW())
     ON CONFLICT (id) DO NOTHING
     RETURNING id`,
    [COMPANY_ID],
  );
  if (companyResult.rowCount > 0) {
    console.log('  ✓ Empresa criada: LabVW');
  } else {
    console.log('  - Empresa já existe, ignorada');
  }

  // 2. Productive Units
  console.log('\n🏢 Criando unidades produtivas...');
  let unitsCreated = 0;
  for (const unit of PRODUCTIVE_UNITS) {
    const result = await client.query(
      `INSERT INTO productive_units (id, company_id, name, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (company_id, name) DO NOTHING
       RETURNING id`,
      [unit.id, COMPANY_ID, unit.name],
    );
    if (result.rowCount > 0) {
      console.log(`  ✓ ${unit.name}`);
      unitsCreated++;
    } else {
      console.log(`  - ${unit.name} (já existe)`);
    }
  }
  console.log(`  Total: ${unitsCreated} novas unidades criadas`);

  // 3. Users
  console.log('\n👤 Criando usuários...');
  let usersCreated = 0;
  let usersSkipped = 0;
  for (const user of USERS) {
    const id = crypto.randomUUID();
    const result = await client.query(
      `INSERT INTO users (id, email, password_hash, full_name, role, company_id, productive_unit_id, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'user', $5, $6, true, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING
       RETURNING email, full_name`,
      [id, user.email, passwordHash, user.full_name, COMPANY_ID, user.unit_id],
    );
    if (result.rows[0]) {
      console.log(`  ✓ ${result.rows[0].full_name} <${result.rows[0].email}>`);
      usersCreated++;
    } else {
      console.log(`  - ${user.full_name} <${user.email}> — já existe, ignorado`);
      usersSkipped++;
    }
  }

  console.log(`\n✅ Concluído!`);
  console.log(`   Usuários criados: ${usersCreated}`);
  console.log(`   Usuários ignorados (já existiam): ${usersSkipped}`);
  console.log(`   Senha padrão: ${DEFAULT_PASSWORD}`);
} finally {
  await client.end();
}
