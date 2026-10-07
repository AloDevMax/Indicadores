<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Development with API

To run both frontend and backend together:

1. Configure your database in `.env.local`
2. Run: `npm run dev:full`

This will start:
- Frontend (Vite): http://localhost:3000 (with API proxy to http://localhost:4001)
- Backend API: http://localhost:4001

**Note:** The frontend uses Vite's proxy during development, so API calls are automatically routed to the backend server. In production, configure `VITE_API_BASE_URL` to point to your deployed API.

### Individual Development

- Frontend only: `npm run dev:client`
- Backend only: `npm run dev:server` (requires build first: `npm run build`)

## Deploy

Produção: app Node.js no Hostinger Business + Supabase (Postgres e Storage). O passo a passo está em [docs/deploy.md](docs/deploy.md).

O workflow `.github/workflows/deploy.yml` valida (lint, testes, build) todo push e PR. Em push na `main`, o job `release` aplica `prisma migrate deploy` e o seed no Supabase e, em seguida, avança a branch `production`, que o Hostinger observa.

Secrets do GitHub (environment `production`):

| Secret | Valor |
|---|---|
| `PROD_DATABASE_URL` | Pooler de transação do Supabase (porta 6543, `?pgbouncer=true&connection_limit=1`) |
| `PROD_DIRECT_URL` | Session pooler do Supabase (porta 5432), usado pelo Prisma Migrate |
| `PROD_DEVELOPER_INITIAL_PASSWORD` | Senha da conta developer embutida (o seed a regrava a cada release) |

## Stability Fixes

The application includes several stability improvements to prevent white screen crashes:

- **Error Boundary**: Catches React errors and displays a user-friendly error page
- **State Safety**: Ensures all state variables have fallback values
- **Hot Reload**: Improved Vite HMR configuration for better development experience
- **API Fallbacks**: Graceful degradation when API is unavailable

If you encounter a white screen:
1. Check the browser console for errors
2. The Error Boundary will show error details in development mode
3. Refresh the page to recover from transient errors

## Testing the Application

### Login Credentials (Development)

Use these credentials to test the login functionality:

- **Email:** `admin@test.com`
- **Password:** `any password` (development mode accepts any password for this email)

### API Endpoints

- Health check: `GET /api/health`
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Bootstrap: `GET /api/bootstrap`

### Troubleshooting

If you get "Failed to fetch" errors:
1. Ensure both frontend and backend servers are running
2. Check that the Vite proxy is configured correctly
3. Verify the API base URL in `.env.local`

The application includes error boundaries and graceful fallbacks for better development experience.

## PostgreSQL

The schema lives in [`prisma/schema.prisma`](prisma/schema.prisma) (migrations in `prisma/migrations/`).

- Local database: see [`docs/docker.md`](docs/docker.md). Production deploy: see [`docs/deploy.md`](docs/deploy.md)
- Check the connection: `npm run db:check`
- Required in production (see `.env.example`): `DATABASE_URL`, `AUTH_SECRET`, `DEVELOPER_INITIAL_PASSWORD`, `STORAGE_DRIVER=supabase`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — the server refuses to start without them
