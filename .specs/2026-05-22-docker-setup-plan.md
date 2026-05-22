# Docker Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Containerizar o LabQuest com Docker — PostgreSQL + app + Nginx para produção, e Postgres isolado para desenvolvimento local.

**Architecture:** Multi-stage Dockerfile (build + production slim), `docker-compose.yml` com três serviços (postgres, app, nginx) para produção na VPS, e `docker-compose.dev.yml` com apenas postgres para dev local. O Express serve o frontend estático e a API na porta 4004; Nginx faz reverse proxy na porta 80.

**Tech Stack:** Docker, Docker Compose, Node 20 Alpine, PostgreSQL 16 Alpine, Nginx Alpine, Prisma, Vite, Express.

---

## Arquivos

| Ação | Arquivo |
|------|---------|
| Criar | `.dockerignore` |
| Criar | `Dockerfile` |
| Criar | `nginx/nginx.conf` |
| Criar | `docker-compose.dev.yml` |
| Criar | `docker-compose.yml` |
| Modificar | `.env.example` |

---

### Task 1: Criar `.dockerignore`

**Files:**
- Create: `.dockerignore`

- [ ] **Step 1: Criar o arquivo**

```
# .dockerignore
node_modules/
dist/
.env
.env.local
.env.*.local
.claude/
docs/
.specs/
*.md
.git/
.gitignore
generated/uploads/
```

- [ ] **Step 2: Verificar que o arquivo existe**

```bash
cat .dockerignore
```

Esperado: conteúdo do arquivo exibido sem erros.

- [ ] **Step 3: Commit**

```bash
git add .dockerignore
git commit -m "chore: add .dockerignore for Docker build context"
```

---

### Task 2: Criar `Dockerfile`

**Files:**
- Create: `Dockerfile`

> **Nota:** `npm run build` chama internamente `node scripts/build.mjs`, que roda `npm install`, `prisma generate`, `vite build` e `tsc`. Sem banco disponível no build, o `db:push` é ignorado graciosamente pelo script. Na imagem de produção, copiamos o `node_modules` inteiro do builder para garantir que `prisma` CLI esteja disponível no startup.

- [ ] **Step 1: Criar o Dockerfile**

```dockerfile
# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
COPY scripts/ ./scripts/
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY index.html ./

RUN npm ci

COPY src/ ./src/
COPY server/ ./server/
COPY public/ ./public/

RUN npm run build

# Stage 2: production
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p dist/public/uploads

EXPOSE 4004

CMD ["node", "dist/server/index.mjs"]
```

- [ ] **Step 2: Build da imagem e verificar que não há erros**

```bash
docker build -t labquest:test .
```

Esperado: output finaliza com `Successfully built` ou similar. Sem erros de `COPY` ou compilação.

- [ ] **Step 3: Verificar que o binário Prisma está disponível na imagem**

```bash
docker run --rm labquest:test npx prisma --version
```

Esperado: versão do Prisma exibida (ex: `prisma: 6.x.x`).

- [ ] **Step 4: Remover imagem de teste**

```bash
docker rmi labquest:test
```

- [ ] **Step 5: Commit**

```bash
git add Dockerfile
git commit -m "chore: add multi-stage Dockerfile for LabQuest"
```

---

### Task 3: Criar `nginx/nginx.conf`

**Files:**
- Create: `nginx/nginx.conf`

- [ ] **Step 1: Criar o diretório e o arquivo**

```bash
mkdir -p nginx
```

```nginx
# nginx/nginx.conf
server {
    listen 80;
    server_name _;

    client_max_body_size 20M;

    location / {
        proxy_pass         http://app:4004;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_read_timeout 60s;
    }
}

# Para adicionar HTTPS na VPS com Certbot:
# 1. Instalar certbot no host: sudo apt install certbot python3-certbot-nginx
# 2. sudo certbot --nginx -d seu-dominio.com
# 3. Certbot edita este arquivo automaticamente
```

- [ ] **Step 2: Verificar sintaxe do nginx.conf com Docker**

```bash
docker run --rm -v "$(pwd)/nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t
```

Esperado: `syntax is ok` e `test is successful`.

- [ ] **Step 3: Commit**

```bash
git add nginx/nginx.conf
git commit -m "chore: add nginx reverse proxy config"
```

---

### Task 4: Criar `docker-compose.dev.yml`

**Files:**
- Create: `docker-compose.dev.yml`

- [ ] **Step 1: Criar o arquivo**

```yaml
# docker-compose.dev.yml
# Uso: docker compose -f docker-compose.dev.yml up -d
# Sobe apenas o PostgreSQL para desenvolvimento local.
# O app continua rodando com: npm run dev:full

services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-labquest}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-labquest}
      POSTGRES_DB: ${POSTGRES_DB:-labquest}
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-labquest}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_dev_data:
```

- [ ] **Step 2: Validar sintaxe do Compose**

```bash
docker compose -f docker-compose.dev.yml config
```

Esperado: YAML expandido sem erros.

- [ ] **Step 3: Subir o banco e verificar conectividade**

```bash
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml ps
```

Esperado: serviço `postgres` com status `healthy` ou `running`.

```bash
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U labquest
```

Esperado: `/var/run/postgresql:5432 - accepting connections`

- [ ] **Step 4: Derrubar o banco de dev**

```bash
docker compose -f docker-compose.dev.yml down
```

- [ ] **Step 5: Commit**

```bash
git add docker-compose.dev.yml
git commit -m "chore: add docker-compose.dev.yml for local postgres"
```

---

### Task 5: Criar `docker-compose.yml` (produção)

**Files:**
- Create: `docker-compose.yml`

> **Nota de uploads:** Arquivos enviados pelos usuários são salvos em `dist/public/uploads` dentro do container. O volume `uploads_data` garante persistência entre redeploys.

- [ ] **Step 1: Criar o arquivo**

```yaml
# docker-compose.yml
# Uso em produção: docker compose up -d --build

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  app:
    build: .
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?sslmode=disable
      PORT: 4004
      AUTH_SECRET: ${AUTH_SECRET}
      NODE_ENV: production
    volumes:
      - uploads_data:/app/dist/public/uploads
    command: sh -c "npm run db:push && node dist/server/index.mjs"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  uploads_data:
```

- [ ] **Step 2: Validar sintaxe**

```bash
docker compose config
```

Esperado: YAML expandido sem erros. Vai pedir variáveis de ambiente — é esperado avisar que estão vazias se não houver `.env`.

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "chore: add docker-compose.yml for production stack"
```

---

### Task 6: Atualizar `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Atualizar o arquivo com todas as variáveis necessárias**

```env
# Banco de dados (local sem Docker)
DATABASE_URL=postgresql://labquest:labquest@localhost:5432/labquest?sslmode=disable

# Banco de dados via Docker Compose (dev)
# DATABASE_URL=postgresql://labquest:labquest@localhost:5432/labquest?sslmode=disable

# Variáveis do PostgreSQL (usadas pelo Docker Compose)
POSTGRES_USER=labquest
POSTGRES_PASSWORD=labquest
POSTGRES_DB=labquest

# Servidor
PORT=4004

# Autenticação
AUTH_SECRET=troque-por-um-segredo-forte-em-producao
```

- [ ] **Step 2: Verificar que o `.env` local está funcional para dev sem Docker**

```bash
cat .env
```

Confirmar que `DATABASE_URL` aponta para onde o banco local ou Docker dev estiver rodando.

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: update .env.example with Docker Compose variables"
```

---

### Task 7: Smoke test do stack de produção

> Este task valida que tudo funciona junto antes do deploy na VPS.

**Pré-requisito:** Ter um arquivo `.env` na raiz com as variáveis de produção preenchidas (pode usar valores de dev para o teste local).

- [ ] **Step 1: Criar `.env` local com valores para teste (se ainda não existir)**

Verificar o `.env` atual e garantir que tem:
```env
POSTGRES_USER=labquest
POSTGRES_PASSWORD=labquest
POSTGRES_DB=labquest
AUTH_SECRET=segredo-de-teste-local
PORT=4004
```

- [ ] **Step 2: Build e start do stack completo**

```bash
docker compose up -d --build
```

Esperado: build da imagem, start de postgres → app → nginx sem erros.

- [ ] **Step 3: Verificar status dos containers**

```bash
docker compose ps
```

Esperado: todos os três serviços (`postgres`, `app`, `nginx`) com status `running` ou `healthy`.

- [ ] **Step 4: Verificar logs do app**

```bash
docker compose logs app
```

Esperado: mensagens de conexão ao banco bem-sucedida, sem `FALLBACK EM MEMÓRIA`.

- [ ] **Step 5: Smoke test HTTP**

```bash
curl -I http://localhost
```

Esperado: `HTTP/1.1 200 OK` com headers do nginx.

- [ ] **Step 6: Verificar que o frontend carrega**

```bash
curl -s http://localhost | grep -o "<title>.*</title>"
```

Esperado: tag `<title>` do HTML da aplicação.

- [ ] **Step 7: Derrubar o stack após validação**

```bash
docker compose down
```

---

### Task 8: Commit final e documentação de uso

**Files:**
- Modify: `CLAUDE.md` (se necessário)

- [ ] **Step 1: Verificar git status — garantir que todos os arquivos foram commitados**

```bash
git status
```

Esperado: working tree limpo (todos os arquivos já commitados nos tasks anteriores).

- [ ] **Step 2: Se houver arquivos pendentes, commitar**

```bash
git add -A
git commit -m "chore: finalize Docker setup for LabQuest"
```

---

## Guia rápido de uso

### Desenvolvimento local

```bash
# Subir só o banco
docker compose -f docker-compose.dev.yml up -d

# Rodar a app normalmente (hot reload)
npm run dev:full

# Derrubar o banco
docker compose -f docker-compose.dev.yml down
```

### Deploy na VPS

```bash
# 1. Clonar o repo na VPS
git clone <repo-url> && cd Indicadores

# 2. Criar .env com variáveis de produção
cp .env.example .env
nano .env  # preencher POSTGRES_PASSWORD, AUTH_SECRET com valores fortes

# 3. Subir o stack
docker compose up -d --build

# 4. Verificar
docker compose ps
docker compose logs app
```
