# Banco local para desenvolvimento

Em dev e nos testes, o PostgreSQL roda em um container definido em `docker-compose.dev.yml`. A aplicação roda
fora do Docker, com hot reload. Produção não usa Docker (ver [deploy.md](deploy.md)).

```bash
# 1. Subir o banco
docker compose -f docker-compose.dev.yml up -d

# 2. Rodar a aplicação
npm run dev:full

# 3. Derrubar o banco quando terminar (os dados ficam no volume)
docker compose -f docker-compose.dev.yml down
```

O banco fica em `localhost:5432` com as credenciais `labquest:labquest`. O `.env` local aponta para ele:

```env
DATABASE_URL=postgresql://labquest:labquest@localhost:5432/labquest?sslmode=disable
DIRECT_URL=postgresql://labquest:labquest@localhost:5432/labquest?sslmode=disable
STORAGE_DRIVER=local
```

Na primeira vez, aplique as migrations e o seed (`--demo` grava badges, unidades e uma fonte de importação de exemplo):

```bash
npm run db:migrate
npm run db:seed -- --demo
```

Os dados persistem no volume `postgres_dev_data` entre reinicializações. Para apagar tudo:
`docker compose -f docker-compose.dev.yml down -v`.

Com `STORAGE_DRIVER=local`, os uploads vão para `public/uploads/` e são servidos em `/uploads`.

## Banco de testes

Os testes de backend rodam contra um banco separado, `labquest_test`, no mesmo container. Crie-o uma vez com
`npm run test:db:create`; o `npm run test:run` aplica as migrations nele automaticamente.

## Comandos úteis

```bash
# Acessar o banco
docker compose -f docker-compose.dev.yml exec postgres psql -U labquest -d labquest

# Conferir conexão e tabelas (lê .env)
npm run db:check
```
