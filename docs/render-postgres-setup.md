# Render + PostgreSQL setup

## Objetivo

Separar a aplicação em duas partes:

- frontend Vite/React publicado no Render
- API Node publicada no Render
- PostgreSQL como fonte oficial dos dados operacionais

## Estrutura adicionada

- `server/index.mjs`: API HTTP mínima para health check e bootstrap inicial
- `server/db/schema.sql`: modelo inicial do banco
- `server/db/bootstrapRepository.mjs`: leitura do bootstrap via PostgreSQL com fallback para seed
- `utils/api.ts`: cliente do frontend para consumir a API

## Variáveis de ambiente

Frontend:

- `VITE_API_BASE_URL=https://sua-api.onrender.com`

API:

- `PORT=4000`
- `DATABASE_URL=postgresql://...`
- `DATABASE_SSL=true`
- `AUTH_SECRET=troque-por-um-segredo-forte`

## Ordem recomendada no Render

1. Criar o banco PostgreSQL.
2. Executar o conteúdo de `server/db/schema.sql`.
3. Subir a API com `node server/index.mjs`.
4. Configurar `VITE_API_BASE_URL` no frontend.
5. Publicar o frontend.

## Próxima evolução recomendada

- adicionar endpoints de autenticação e sessão
- mover cadastro/login para a API
- persistir submissões, rankings e importações pelo backend
- trocar o fallback seed por leitura completa do banco

## Endpoints de autenticação

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Formato esperado em `register`:

```json
{
  "email": "novo@empresa.com",
  "password": "segredo123",
  "full_name": "Novo Usuario"
}
```

Formato esperado em `login`:

```json
{
  "email": "novo@empresa.com",
  "password": "segredo123"
}
```

Os endpoints autenticados usam `Authorization: Bearer <token>`.
