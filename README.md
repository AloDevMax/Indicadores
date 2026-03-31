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

## API scaffold

The project now includes a minimal Node API for Render in `server/`.

- health check: `GET /api/health`
- bootstrap data: `GET /api/bootstrap`
- auth register: `POST /api/auth/register`
- auth login: `POST /api/auth/login`
- auth me: `GET /api/auth/me`
- auth logout: `POST /api/auth/logout`
- create submission: `POST /api/submissions`
- review submission: `POST /api/submissions/:id/review`

Start it with:

`node server/index.mjs`

If `VITE_API_BASE_URL` is configured in the frontend, the app will try to load initial operational data from the API before falling back to local seed data.

The frontend now uses the API authentication flow when `VITE_API_BASE_URL` is configured.

## PostgreSQL

The initial schema is in [`server/db/schema.sql`](server/db/schema.sql).

Recommended next step:

1. Create the PostgreSQL instance on Render
2. Run the schema
3. Set `DATABASE_URL` in the API service
4. Set `AUTH_SECRET` in the API service
5. Set `VITE_API_BASE_URL` in the frontend service
