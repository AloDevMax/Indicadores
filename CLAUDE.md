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

Detailed architecture documentation lives in `/docs/`:

- [Frontend](docs/architecture-frontend.md) — entry point, state, routing, auth, pages
- [Backend](docs/architecture-backend.md) — Express server, module layout, layers
- [Database](docs/architecture-database.md) — Prisma ORM, fallback store, key models
- [Authorization](docs/architecture-authorization.md) — roles, scoping, developer account
- [Excel Import System](docs/architecture-excel-import.md) — bulk badge assignment flow
- [Key API Routes](docs/architecture-api-routes.md) — auth, submissions, admin endpoints
