# Deploy: Hostinger Business + Supabase

Produção é um app Node.js no **Hostinger Business** (deploy a partir do GitHub) com **Supabase** para o Postgres e
para os arquivos enviados (Storage). O app não guarda estado em disco.

## Fluxo

```
push na main → CI: validate (lint, testes, build) e e2e (Playwright), em paralelo
             → release (environment "production"): prisma migrate deploy + seed no Supabase,
               depois git push HEAD:refs/heads/production (só fast-forward)
             → Hostinger detecta o push em "production" → build + deploy
```

O Hostinger observa a branch `production`, e só o CI a avança. Crie a branch `production` a partir da `main`
antes do primeiro release e antes de conectar o app no Hostinger, que precisa dela para o primeiro deploy. Assim o schema já está migrado quando o código novo
sobe. Ninguém faz push manual em `production`.

O workflow é `.github/workflows/deploy.yml`. Os Secrets (environment `production` no GitHub) estão listados no
README: `PROD_DATABASE_URL`, `PROD_DIRECT_URL` e `PROD_DEVELOPER_INITIAL_PASSWORD`. O job `release` falha se algum
estiver vazio. No environment dá para exigir aprovação manual antes da migration.

## Hostinger (hPanel → Node.js)

| Campo | Valor |
|---|---|
| Repositório / branch | este repositório, branch `production` |
| Build command | `npm run build` (precisa das devDependencies: vite, typescript, prisma) |
| Entry file | `dist/server/start.mjs` (sobe o servidor sem guarda de `argv`: o Hostinger carrega o entry por um wrapper e exige `listen()` em até 3 s) |
| Node | 20 ou 22 (`engines` no `package.json`) |

O servidor lê a porta de `PORT`; o default 4004 só vale localmente. O mesmo app serve a API e o frontend.

### Deploy manual por .zip (enquanto o deploy via GitHub estiver desligado)

Pelo acesso de "client management" o deploy via GitHub não fica disponível, então o código sobe por upload de um
.zip no hPanel. Depois que o CI terminar o `release` (a `production` avança para o commit da `main`):

```bash
npm run release:zip   # → releases/labquest-<data>-<sha>.zip (pasta ignorada pelo git)
```

O script faz `git fetch`, recusa se `origin/production` for diferente de `origin/main` (o release ainda não
migrou o Supabase) e empacota o commit da `production` com `git archive`. Envie o zip no hPanel e confira no log
do deploy a linha `Entry file:` (`dist/server/start.mjs`).

### Variáveis de ambiente

| Variável | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | pooler de transação do Supabase, porta 6543, com `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | session pooler do Supabase, porta 5432 |
| `AUTH_SECRET` | segredo das sessões, com pelo menos 32 caracteres e diferente do `.env.example` (trocá-lo derruba as sessões ativas). Gere com `openssl rand -hex 32` |
| `DEVELOPER_INITIAL_PASSWORD` | senha da conta developer **só na criação** (o seed não regrava a senha de uma conta que já existe). Em produção, pelo menos 12 caracteres e diferente do `.env.example`, senão o boot falha |
| `STORAGE_DRIVER` | `supabase` (o boot recusa `local` em produção) |
| `SUPABASE_URL` | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | chave service role. Só no servidor: nunca com prefixo `VITE_`, nunca no frontend |
| `SUPABASE_STORAGE_BUCKET` | opcional, default `uploads` |
| `ALLOWED_ORIGINS` | domínio final (só importa para chamadas vindas de outra origem) |
| `TRUST_PROXY` | número de proxies reversos à frente do app (default `0`). Na Hostinger o app roda atrás de um proxy reverso: use `1`. Valor baixo demais faz o limite de login por endereço tratar todos os clientes como um só; o `express-rate-limit` avisa no log com `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` |

Se faltar alguma variável obrigatória, o processo termina no boot com `Variáveis de ambiente inválidas:` e a lista.

## Supabase

- Região `sa-east-1` (São Paulo).
- **Storage:** bucket **público** `uploads`. As URLs gravadas no banco são as URLs públicas do bucket.
- **Banco:** o app usa o pooler em modo transação (6543), e as migrations usam `DIRECT_URL` (5432). Sem
  `pgbouncer=true` na `DATABASE_URL`, o Prisma usa prepared statements e falha no pooler (ver
  [DATABASE_PERSISTENCE.md](DATABASE_PERSISTENCE.md)).

## Recuperar a conta developer

O seed preserva a senha que o developer escolheu. Para voltar à `DEVELOPER_INITIAL_PASSWORD`, rode uma vez,
com as variáveis do banco de produção:

```bash
node dist/server/db/seed.mjs --reset-developer-password
```

## Rollback

- **Código:** reverter na `main` (`git revert`) e deixar o CI liberar. Não reescrever `production`: o release só faz
  fast-forward e falharia.
- **Migration:** o Prisma não desfaz migrations. Uma migration com problema se corrige com outra migration.
- **Plataforma (durante a janela da migração da VPS):** ver o runbook em
  `.specs/2026-10-06-arquitetura-prod-fase2.5-plan.md`. Enquanto a VPS estiver ligada, volte o DNS para ela e rode
  `docker compose start app` lá. Dados escritos no Supabase depois do corte não voltam sozinhos.

## Migração dos uploads da VPS

Na VPS, os uploads ficavam no volume `uploads_data`, montado em `/app/dist/public/uploads` no container `app`.
Para copiá-los para o bucket:

```bash
docker compose cp app:/app/dist/public/uploads/. ./uploads-vps   # na VPS; o "/." copia o conteúdo sem aninhar a pasta
node --env-file=.env.production scripts/migrateUploadsToStorage.mjs --dir ./uploads-vps           # dry-run
node --env-file=.env.production scripts/migrateUploadsToStorage.mjs --dir ./uploads-vps --apply
```

O `.env.production` usado pelo script precisa de `DATABASE_URL`, `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Se
ele também tiver `NODE_ENV=production`, a validação do boot passa a exigir `AUTH_SECRET` e
`DEVELOPER_INITIAL_PASSWORD`. Com `STORAGE_DRIVER=supabase`, o `AUTH_SECRET` é exigido mesmo sem
`NODE_ENV=production` (o segredo de desenvolvimento só vale com storage local): use o mesmo valor da produção.

O script reescreve os valores de `users.avatar_url`, `badges.image_url` e `badge_submissions.proof_url` que começam
com `/uploads/`, e pode ser rodado de novo com segurança. O resumo final mostra `migrados / pulados / ausentes /
falhas`, e o script sai com código 1 se houver falha de upload.
