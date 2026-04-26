# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LabQuest** is a gamified quality management system. Organizations reward employees with digital badges (selos) for quality/performance achievements. It features user progression (XP/levels), admin dashboards, badge submissions/approvals, and bulk assignment via Excel imports.

## Commands

```bash
# Development (frontend + backend concurrently)
npm run dev:full          # Frontend :3000 + Backend :4004

# Individual services
npm run dev:client        # Frontend only (Vite, port 3000)
npm run dev:server        # Backend only (port 4004) — requires prior build

# Build & production
npm run build             # install → db:diagnose → db:push → prisma generate → vite build → tsc
npm start                 # Production Express server

# Database
npm run db:push           # Sync Prisma schema to PostgreSQL
npm run db:check          # Verify DB connection
npm run db:diagnose       # Diagnose DB/module issues

# Code quality
npm run lint              # ESLint
```

## Architecture

### Frontend

- **Entry**: `index.html` → `index.tsx` → `App.tsx` (HashRouter)
- **State**: Lifted to `App.tsx` root; passed down via props. No external state manager.
- **Bootstrap**: App fetches `/api/bootstrap` on load to hydrate badges, companies, users, and settings.
- **Auth**: JWT stored in `localStorage` as `quest_auth_token`.
- **Pages** (`/pages/`): 16 pages. `AdminPanel.tsx` is the largest (~124 KB) and handles all admin workflows.
- **API calls**: All via `/utils/api.ts` helper functions.
- **Routing**: Vite dev proxy forwards `/api/*` to `localhost:4004`.

### Backend

- **Entry**: `/server/index.mjs` — Express app on `PORT` env var (default 4004). Serves static frontend in production.
- **Module system**: ES modules (`.mjs` files) throughout the server.
- **Layers**:
  - `server/auth/` — login, register, logout, session validation, password hashing
  - `server/admin/` — CRUD for badges, companies, productive units, users, bulk invites, import sources
  - `server/operations/` — badge award logic, badge submissions (create/review), notifications
  - `server/db/` — PostgreSQL client, schema.sql, bootstrap loader
  - `server/data/` — in-memory fallback store + seed data

### Database

- **ORM**: Prisma 6 with schema at `/prisma/schema.prisma`. Generated client at `/generated/`.
- **Fallback**: If `DATABASE_URL` is missing or PostgreSQL is unavailable, the app falls back to an in-memory store (`server/data/memoryStore.mjs`). Data is **not persisted** in fallback mode.
- **Key models**: `Users`, `Companies`, `ProductiveUnits`, `Badges`, `UserBadges` (earned badges with tone: bronze/silver/gold/loss_1/loss_2), `BadgeSubmissions`, `ImportSources`, `ImportRuns`.

### Authorization

- **Roles**: `user` (regular employee), `admin` (manages their own company), `developer` (global access).
- Admins are scoped to their `company_id`; they cannot access other companies' data.
- Built-in developer account (`alo.de.castro@hotmail.com`) has role normalized to `developer` automatically.

### Excel Import System

The bulk badge assignment flow: `ImportSources` (templates) → `ImportRuns` (execution) → `ImportRunRows` (individual rows). The `xlsx` library parses uploads; the frontend `AdminPanel.tsx` contains the KPI selector and column-mapping UI.

### Key API Routes

```
POST /api/auth/login|register|logout
GET  /api/auth/me
GET  /api/bootstrap
GET  /api/health

POST /api/submissions                   # User requests a badge
POST /api/submissions/:id/review        # Admin approves/rejects

POST /api/admin/badges
POST /api/admin/companies
POST /api/admin/productive-units
POST /api/admin/users
POST /api/admin/users/bulk-invite
POST /api/admin/award-badges
POST /api/admin/import-sources
POST /api/admin/import-runs
PUT  /api/user/profile
```
