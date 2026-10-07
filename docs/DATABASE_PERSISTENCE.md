# Troubleshooting: conexão com o banco em produção

O servidor **não sobe** sem `DATABASE_URL` (em qualquer ambiente). Em produção (`NODE_ENV=production`) também são
obrigatórias `AUTH_SECRET` e `DEVELOPER_INITIAL_PASSWORD`: o processo termina com `Variáveis de ambiente inválidas:`
listando o que falta. Corrija o `.env` da VPS e reinicie (`docker compose up -d`).

## Banco inacessível

Não existe fallback em memória. Se o banco não responde no boot, o log mostra
`[STARTUP] Não foi possível conectar ao banco de dados` e o processo sai com código 1 (o compose reinicia o
container). Com o servidor no ar, `/api/health` responde `503 { status: 'unavailable' }` quando o banco cai.

Diagnóstico:

```bash
# Na máquina de dev (lê .env)
npm run db:check

# Dentro do container de produção
docker compose exec app node scripts/dbCheck.mjs
```

Saída esperada: `✅ Conectado: PostgreSQL 16.x` e a lista de tabelas. Em caso de falha, a mensagem do Prisma
(`Can't reach database server`, `Authentication failed`, `Database "x" does not exist`, ...) indica a causa.

## Migrations

O schema evolui só por migrations versionadas em `prisma/migrations/`:

1. Em dev, altere `prisma/schema.prisma` e rode `npm run db:migrate` (cria e aplica a migration no banco local).
2. Faça commit da pasta da migration junto com o schema.
3. No deploy, o container roda `npx prisma migrate deploy` antes do seed e do servidor, aplicando só o que falta.

`npx prisma migrate status` mostra o estado de um banco. Um banco criado com o antigo `db push` não tem a tabela
`_prisma_migrations` e precisa de baseline antes do primeiro `migrate deploy` (ver o checklist de deploy da Fase 2 em
`.specs/2026-10-06-arquitetura-prod-fase2-plan.md`).

## Checklist

- `DATABASE_URL` no formato `postgresql://usuario:senha@host:porta/banco`, com caracteres especiais da senha URL-encoded
- SSL configurado na própria URL: `?sslmode=disable` para o Postgres do compose, `?sslmode=require` para bancos gerenciados
- `DIRECT_URL` definida para o Prisma Migrate (mesmo valor de `DATABASE_URL` quando há um banco só)
- Schema aplicado: `db:check` lista as tabelas (`users`, `badges`, ..., `_prisma_migrations`); se vier vazio, as migrations não rodaram
