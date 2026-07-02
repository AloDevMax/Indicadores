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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS + CSS custom properties (`src/index.css`) |
| Routing | react-router-dom 7 (HashRouter) |
| Backend | Express 4 (ESM `.mjs`, no transpiler) |
| Database | PostgreSQL + Prisma 6 ORM |
| Validation | Zod |
| Deploy | Render.com (`render.yaml`), Docker available |

## Architecture

Full-stack monolith: Express serves both the REST API and the static React bundle (in production). In development, Vite runs at `:3000` and Express at `:4004`.

**Dual data mode:** on startup the server tries to connect to PostgreSQL. If it fails, it falls back to an in-memory store (`server/data/memoryStore.mjs`) — useful for offline dev but **data does not persist** across restarts in that mode.

**State management:** `App.tsx` owns all global state (no Redux/Zustand/Context). Everything is loaded once via `GET /api/bootstrap` and passed down as props.

### Roles

| Role | Access |
|------|--------|
| `user` | Personal dashboard, own badges, ranking |
| `supervisor` | Admin access scoped to own productive unit |
| `admin` | Full access: manage badges, users, award, Excel import |
| `developer` | Same as admin (dev account) |

### Key Entry Points

| What | Where |
|------|-------|
| Frontend SPA | `src/main.tsx` → `src/App.tsx` |
| Backend Express | `server/index.mjs` (port 4004) |
| All API calls | `src/shared/api.ts` |
| Shared types | `src/shared/types.ts` |
| Database schema | `prisma/schema.prisma` |

### Directory Map

```
src/
├── App.tsx              # Global state, routes, event handlers
├── features/
│   ├── auth/            # Login, Register, Landing
│   ├── admin/           # AdminPanel, AwardBadges, Requests, Explorers, Library, UnitsPage
│   ├── badges/          # UserBadgesPage, SolicitationModal
│   ├── dashboard/       # Dashboard, Overview
│   ├── ranking/         # Ranking, GlobalRanking
│   └── settings/        # Settings
└── shared/
    ├── api.ts           # All fetch calls to the backend
    ├── types.ts         # Shared TypeScript types
    ├── components/      # Navbar, Sidebar, BottomNav, ToastContainer
    └── lib/             # Shared utilities

server/
├── index.mjs            # Express entry: routes, middleware, bootstrap
├── auth/                # Login/register/session service + repository + crypto
├── admin/               # CRUD for badges, users, units, import sources
├── operations/          # awardBadges, reviewSubmission, persistImportRun
├── db/                  # Prisma client, bootstrap loader, connection check
├── data/                # memoryStore.mjs (in-memory fallback)
└── uploads/             # File upload routes (badge images, avatars)
```

### Detailed architecture documentation lives in `/docs/`:

- [Frontend](docs/architecture-frontend.md) — entry point, state, routing, auth, pages
- [Backend](docs/architecture-backend.md) — Express server, module layout, layers
- [Database](docs/architecture-database.md) — Prisma ORM, fallback store, key models
- [Authorization](docs/architecture-authorization.md) — roles, scoping, developer account
- [Excel Import System](docs/architecture-excel-import.md) — bulk badge assignment flow
- [Key API Routes](docs/architecture-api-routes.md) — auth, submissions, admin endpoints

## Docker

- [Docker](docs/docker.md) — desenvolvimento local com banco em container, deploy na VPS com stack completo (app + postgres + nginx)

## Troubleshooting

- [Database Persistence](docs/DATABASE_PERSISTENCE.md) — diagnosing the in-memory fallback in production and fixing `DATABASE_URL` issues on Render

## Specs & Plans

Design specs and implementation plans live in `.specs/`:

- Specs: `.specs/YYYY-MM-DD-<topic>-design.md`
- Plans: `.specs/YYYY-MM-DD-<topic>-plan.md`
