# Docker Setup Design — LabQuest

**Date:** 2026-05-22  
**Status:** Approved

## Objetivo

Containerizar a aplicação LabQuest com Docker para:
- Desenvolvimento local: banco de dados PostgreSQL isolado em Docker, app rodando localmente com hot reload
- Produção (VPS): app + postgres + nginx em Docker Compose, pronto para deploy

## Arquivos a criar

```
Dockerfile              ← multi-stage build (builder + production)
docker-compose.yml      ← produção: app + postgres + nginx
docker-compose.dev.yml  ← dev: só postgres
nginx/
  nginx.conf            ← reverse proxy HTTP → app:4004
.dockerignore           ← exclui node_modules, dist, .env, etc.
```

## Dockerfile (multi-stage)

### Stage `builder` — Node 20 Alpine
- `WORKDIR /app`
- Copia `package*.json`, `prisma/`, `scripts/`, arquivos de config (`tsconfig*`, `vite.config.ts`, `eslint.config.js`, `index.html`)
- `npm ci` (todas as deps)
- Copia `src/` e `server/`
- `npm run build` — produz `dist/` com frontend (Vite) + backend (tsc)

### Stage `production` — Node 20 Alpine slim
- `WORKDIR /app`
- Copia do stage `builder`: `dist/`, `prisma/`, `scripts/`, `package*.json`
- Copia `node_modules/` inteiro do stage `builder` (inclui Prisma CLI necessário para `db:push` no startup)
- Expõe porta `4004`
- `CMD ["node", "dist/server/index.mjs"]`

> **Nota:** Copiar `node_modules` completo aumenta o tamanho da imagem (~500MB), mas garante que `prisma` CLI esteja disponível para sincronizar o schema no startup. Alternativa futura: mover `prisma` de devDependencies para dependencies e usar `npm ci --omit=dev`.

## docker-compose.yml (produção)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
    healthcheck:
      test: pg_isready -U ${POSTGRES_USER}
      interval: 5s / timeout: 5s / retries: 5

  app:
    build: .
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      PORT: 4004
    command: sh -c "npm run db:push && node dist/server/index.mjs"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app

volumes:
  postgres_data:
```

Variáveis sensíveis (`POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.) são fornecidas via arquivo `.env` na raiz (não commitado).

## docker-compose.dev.yml (desenvolvimento)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

volumes:
  postgres_dev_data:
```

Uso em dev:
1. `docker compose -f docker-compose.dev.yml up -d` — sobe só o banco
2. Atualizar `.env` local: `DATABASE_URL=postgresql://usuario:senha@localhost:5432/labquest`
3. `npm run dev:full` — app roda normalmente com hot reload

## nginx/nginx.conf

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://app:4004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Para HTTPS na VPS: instalar Certbot no host e adicionar blocos `ssl_certificate` + redirect 80→443.

## .dockerignore

```
node_modules/
dist/
.env
.env.local
.env.*.local
.claude/
docs/
*.md
.git/
```

## Deploy na VPS

1. Instalar Docker + Docker Compose na VPS
2. Clonar o repositório
3. Criar `.env` com as variáveis de produção
4. `docker compose up -d --build`
5. Acessar via IP da VPS na porta 80

## Variáveis de ambiente necessárias (.env em produção)

```env
POSTGRES_USER=labquest
POSTGRES_PASSWORD=<senha-forte>
POSTGRES_DB=labquest
PORT=4004
AUTH_SECRET=<segredo-forte>
```
