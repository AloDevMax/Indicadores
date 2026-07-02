# Docker

O LabQuest usa Docker para dois contextos: desenvolvimento local (só o banco) e produção na VPS (stack completo).

## Arquivos

```
Dockerfile                  ← build multi-stage da aplicação
docker-compose.yml          ← produção: app + postgres + nginx
docker-compose.dev.yml      ← dev: só postgres
nginx/nginx.conf            ← reverse proxy HTTP → app:4004
```

## Desenvolvimento local

Sobe apenas o PostgreSQL em container, enquanto a aplicação roda localmente com hot reload.

```bash
# 1. Subir o banco
docker compose -f docker-compose.dev.yml up -d

# 2. Rodar a aplicação (hot reload normal)
npm run dev:full

# 3. Derrubar o banco quando terminar
docker compose -f docker-compose.dev.yml down
```

O banco fica disponível em `localhost:5432` com as credenciais padrão `labquest:labquest`. O `.env` local precisa ter `DATABASE_URL` apontando para esse endereço:

```env
DATABASE_URL=postgresql://labquest:labquest@localhost:5432/labquest?sslmode=disable
```

Os dados persistem no volume `postgres_dev_data` entre reinicializações.

## Produção (VPS)

Sobe o stack completo: PostgreSQL + Express + Nginx.

```bash
# 1. Copiar e preencher variáveis de ambiente
cp .env.example .env
# editar .env com senhas fortes (ver seção Variáveis)

# 2. Build e start
docker compose up -d --build

# 3. Verificar status
docker compose ps
docker compose logs app
```

Acesso via `http://<IP-da-VPS>:8081` (portas 80 e 8080 reservadas para outras aplicações na VPS).

### Fluxo de inicialização

```
postgres (healthcheck) → app (db:push + node) → nginx (porta 80)
```

O container `app` aguarda o healthcheck do postgres antes de iniciar. No startup, roda `npm run db:push` para sincronizar o schema Prisma, depois inicia o servidor Express.

## Variáveis de ambiente

O arquivo `.env` na raiz configura o stack. Copie `.env.example` como ponto de partida.

| Variável | Usado por | Descrição |
|----------|-----------|-----------|
| `POSTGRES_USER` | postgres, app | Usuário do banco |
| `POSTGRES_PASSWORD` | postgres, app | Senha do banco |
| `POSTGRES_DB` | postgres, app | Nome do banco |
| `PORT` | app | Porta interna do Express (padrão: 4004) |
| `AUTH_SECRET` | app | Segredo para assinar tokens de sessão |

Em produção, use senhas fortes para `POSTGRES_PASSWORD` e `AUTH_SECRET`. O `DATABASE_URL` é **gerado automaticamente** pelo compose a partir das variáveis acima — não precisa defini-lo no `.env` para o stack Docker.

## Dockerfile

Build multi-stage com duas etapas:

- **`builder`** — Node 20 Alpine. Instala todas as dependências (`npm ci`), compila frontend (Vite) e backend (tsc) via `npm run build`. O `db:push` durante o build é ignorado graciosamente sem banco disponível.
- **`production`** — Node 20 Alpine. Copia apenas os artefatos compilados (`dist/`, `prisma/`, `scripts/`, `node_modules/`). Roda como usuário não-root `labquest`. Expõe a porta 4004.

O `node_modules` inteiro é copiado do builder (incluindo devDependencies) para garantir que o `prisma` CLI esteja disponível no comando de startup (`npm run db:push`).

## Uploads

Arquivos enviados pelos usuários são salvos em `dist/public/uploads/` dentro do container. O volume `uploads_data` garante que esses arquivos persistam entre redeploys:

```yaml
volumes:
  - uploads_data:/app/dist/public/uploads
```

## HTTPS na VPS

O setup atual serve HTTP na porta 80. Para adicionar HTTPS com certificado gratuito (Let's Encrypt):

```bash
# Na VPS, com o stack rodando
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

O Certbot edita o `nginx.conf` automaticamente e configura o redirect 80 → 443.

## Comandos úteis

```bash
# Ver logs em tempo real
docker compose logs -f app

# Acessar o banco diretamente
docker compose exec postgres psql -U labquest -d labquest

# Rebuild apenas do app (sem recriar o banco)
docker compose up -d --build app

# Parar tudo (mantém volumes)
docker compose down

# Parar tudo e apagar dados
docker compose down -v
```

## Troubleshooting

**App não conecta ao banco:**
```bash
docker compose logs postgres   # verificar se o healthcheck passou
docker compose logs app        # procurar "FALLBACK EM MEMÓRIA" nos logs
```

Se aparecer `FALLBACK EM MEMÓRIA`, o banco não está acessível. Verifique se as variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` no `.env` batem com as configuradas no container postgres.

**Porta 80 ocupada:**
```bash
ss -tlnp | grep :80            # identificar o processo
```
Mude a porta do nginx no `docker-compose.yml` (`"8080:80"`) ou pare o processo que ocupa a porta 80.

**Imagem desatualizada após mudança de código:**
```bash
docker compose up -d --build   # força rebuild da imagem
```
