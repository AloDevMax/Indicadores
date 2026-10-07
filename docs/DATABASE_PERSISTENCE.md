# Troubleshooting: conexão com o banco em produção

O servidor **não sobe** sem `DATABASE_URL` (em qualquer ambiente). Em produção (`NODE_ENV=production`) também são
obrigatórias `AUTH_SECRET`, `DEVELOPER_INITIAL_PASSWORD`, `STORAGE_DRIVER=supabase`, `SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY`: o processo termina com `Variáveis de ambiente inválidas:` listando o que falta. Corrija as variáveis no painel do Hostinger e refaça o deploy (ver [deploy.md](deploy.md)).

## Banco inacessível

Não existe fallback em memória. Se o banco não responde no boot, o log mostra
`[STARTUP] Não foi possível conectar ao banco de dados` e o processo sai com código 1. Com o servidor no ar, `/api/health` responde `503 { status: 'unavailable' }` quando o banco cai.

Diagnóstico:

```bash
# Na máquina de dev (lê .env)
npm run db:check

# Contra o Supabase, da máquina local, com as URLs de produção em .env.production
node --env-file=.env.production scripts/dbCheck.mjs
```

Saída esperada: `✅ Conectado: PostgreSQL 16.x` e a lista de tabelas. Em caso de falha, a mensagem do Prisma
(`Can't reach database server`, `Authentication failed`, `Database "x" does not exist`, ...) indica a causa.

## Migrations

O schema evolui só por migrations versionadas em `prisma/migrations/`:

1. Em dev, altere `prisma/schema.prisma` e rode `npm run db:migrate` (cria e aplica a migration no banco local).
2. Faça commit da pasta da migration junto com o schema.
3. No push na `main`, o job `migrate` do CI roda `npx prisma migrate deploy` e o seed no Supabase antes de liberar a
   branch `production` para o Hostinger.

`npx prisma migrate status` mostra o estado de um banco. Um banco criado com o antigo `db push` não tem a tabela
`_prisma_migrations` e precisa de baseline antes do primeiro `migrate deploy` (ver o checklist de deploy da Fase 2 em
`.specs/2026-10-06-arquitetura-prod-fase2-plan.md`).

## Supabase: pooler e conexões

- `DATABASE_URL` usa o pooler em **modo transação** (porta 6543) com `?pgbouncer=true&connection_limit=1`.
  - Sem `pgbouncer=true`, o Prisma usa prepared statements, que o pooler em modo transação não suporta. O erro
    típico, intermitente e em queries comuns, é `prepared statement "s0" already exists` (ou `does not exist`).
  - `connection_limit=1` evita que cada instância do app abra várias conexões no pooler.
- `DIRECT_URL` usa o **session pooler** (porta 5432). É a conexão do `prisma migrate deploy`; pelo pooler de
  transação, as migrations falham ou travam.
- `too many connections` / `max clients reached`: confira o `connection_limit=1` e se não há instâncias antigas do
  app ainda no ar.
- O Supabase exige SSL; as connection strings do painel já vêm assim.

## Checklist

- `DATABASE_URL` no formato `postgresql://usuario:senha@host:porta/banco`, com caracteres especiais da senha URL-encoded
- SSL configurado na própria URL: `?sslmode=disable` para o Postgres local do compose de dev, `?sslmode=require` para bancos gerenciados
- `DIRECT_URL` definida para o Prisma Migrate (mesmo valor de `DATABASE_URL` quando há um banco só)
- Schema aplicado: `db:check` lista as tabelas (`users`, `badges`, ..., `_prisma_migrations`); se vier vazio, as migrations não rodaram
