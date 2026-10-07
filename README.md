# LabQuest

Sistema de gestão da qualidade gamificado: colaboradores ganham selos por conquistas de qualidade e desempenho, com níveis, ranking, solicitações/aprovações e atribuição em massa via planilha Excel.

React 19 + Vite no frontend, Express 4 + Prisma/PostgreSQL no backend.

## Rodar localmente

Pré-requisitos: Node.js 20–22 e Docker (para o Postgres local — veja [docs/docker.md](docs/docker.md)).

```bash
npm install
cp .env.example .env      # ajuste DATABASE_URL etc.
npm run db:migrate        # aplica as migrations
npm run db:seed -- --demo # conta developer + dados de demonstração
npm run dev:full          # frontend :3000 + backend :4004
```

`npm run dev:client` e `npm run dev:server` sobem cada lado separadamente. A lista completa de comandos (testes, E2E, lint) está em [CLAUDE.md](CLAUDE.md).

## Deploy

Produção: app Node.js no Hostinger Business + Supabase (Postgres e Storage). O passo a passo está em [docs/deploy.md](docs/deploy.md).

O workflow `.github/workflows/deploy.yml` valida (lint, testes, build) todo push e PR. Em push na `main`, o job `release` aplica `prisma migrate deploy` e o seed no Supabase e, em seguida, avança a branch `production`, que o Hostinger observa.

Secrets do GitHub (environment `production`):

| Secret | Valor |
|---|---|
| `PROD_DATABASE_URL` | Pooler de transação do Supabase (porta 6543, `?pgbouncer=true&connection_limit=1`) |
| `PROD_DIRECT_URL` | Session pooler do Supabase (porta 5432), usado pelo Prisma Migrate |
| `PROD_DEVELOPER_INITIAL_PASSWORD` | Senha da conta developer embutida (o seed a regrava a cada release) |

Variáveis obrigatórias em produção (veja `.env.example`): `DATABASE_URL`, `AUTH_SECRET`, `DEVELOPER_INITIAL_PASSWORD`, `STORAGE_DRIVER=supabase`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — o servidor não sobe sem elas.

## Documentação

Arquitetura (frontend, backend, banco, autorização, importação Excel, rotas da API) em [`docs/`](docs/). O schema está em [`prisma/schema.prisma`](prisma/schema.prisma).
