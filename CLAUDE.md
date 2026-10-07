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
npm run dev:server        # Backend only (port 4004) — requires the database (DATABASE_URL)

# Build & production
npm run build             # prisma generate → vite build → tsc
npm start                 # Production Express server

# Database
npm run db:migrate        # prisma migrate dev — create/apply migrations on the local database
npm run db:seed           # Idempotent seed: built-in developer account (add -- --demo for demo data)
npm run db:check          # Verify DB connection (version + tables)
npm run db:seed:badges    # Seed indicator badges (requires prior build)

# Code quality
npm run lint              # ESLint

# Testing
npm test                  # Vitest — unit/component/integration, watch mode
npm run test:run          # Vitest — single run (CI)
npm run test:coverage     # Vitest — single run with V8 coverage report
npm run test:db:create    # Create the labquest_test database (once) in the docker-compose.dev.yml Postgres
npm run test:e2e          # Playwright — end-to-end (spins up client :3000 + server :4004)
npm run test:e2e:ui       # Playwright — E2E in interactive UI mode
```

## Testing Policy

Every implementation (new feature, bug fix, or behavior-changing refactor) must ship with automated tests covering it, with clearly stated expected results — assert the actual expected value/state/response, not just "it didn't throw."

- Frontend logic/components → Vitest + React Testing Library (`*.test.ts(x)`, colocated with the source file)
- Backend routes/services → Vitest (`// @vitest-environment node`) + Supertest (`server/**/*.test.mjs`, colocated). Backend tests run against the real Postgres test database `labquest_test` (dev compose up + `npm run test:db:create` once); repositories have `*.integration.test.mjs` files, and `server/test/` holds `resetDatabase` and fixtures
- Critical user flows (login, submission/approval, award, Excel import) → Playwright (`e2e/*.spec.ts`)

See `vitest.config.ts` / `playwright.config.ts` for setup, and the existing `*.test.*` files for the expected pattern.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 6 |
| Styling | Tailwind CSS + CSS custom properties (`src/index.css`) |
| Routing | react-router-dom 7 (HashRouter) |
| Backend | Express 4 (ESM `.mjs`, no transpiler) |
| Database | PostgreSQL + Prisma 6 ORM |
| Validation | Zod |
| Testing | Vitest + React Testing Library (unit/component/integration), Playwright (E2E) |
| Deploy | VPS via Docker Compose (GitHub Actions → SSH) |

## Architecture

Full-stack monolith: Express serves both the REST API and the static React bundle (in production). In development, Vite runs at `:3000` and Express at `:4004`.

**Data access:** PostgreSQL through a single Prisma Client (`server/shared/db/prisma.mjs`); there is no in-memory fallback. `DATABASE_URL` is required, and the server exits at boot if the database is unreachable. The schema changes only through migrations in `prisma/migrations` (`prisma migrate deploy` on deploy).

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
├── db/                  # bootstrap loader, resource listings, seed
├── shared/db/           # prisma.mjs — the single PrismaClient
├── test/                # test-only helpers (globalSetup, resetDatabase, fixtures)
└── uploads/             # File upload routes (badge images, avatars)
```

### Detailed architecture documentation lives in `/docs/`:

- [Frontend](docs/architecture-frontend.md) — entry point, state, routing, auth, pages
- [Backend](docs/architecture-backend.md) — Express server, module layout, layers
- [Database](docs/architecture-database.md) — Prisma ORM, migrations, seed, key models
- [Authorization](docs/architecture-authorization.md) — roles, scoping, developer account
- [Excel Import System](docs/architecture-excel-import.md) — bulk badge assignment flow
- [Key API Routes](docs/architecture-api-routes.md) — auth, submissions, admin endpoints

## Docker

- [Docker](docs/docker.md) — desenvolvimento local com banco em container, deploy na VPS com stack completo (app + postgres + nginx)

## Troubleshooting

- [Database Persistence](docs/DATABASE_PERSISTENCE.md) — diagnosing database connection issues in production

## Specs & Plans

Design specs and implementation plans live in `.specs/`:

- Specs: `.specs/YYYY-MM-DD-<topic>-design.md`
- Plans: `.specs/YYYY-MM-DD-<topic>-plan.md`
