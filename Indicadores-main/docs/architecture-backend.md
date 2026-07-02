# Backend

- **Entry**: `server/index.mjs` — Express app on `PORT` env var (default 4004). In production runs from `dist/server/index.mjs` (built by `tsc` via `scripts/build.mjs`).
- **Module system**: ES modules (`.mjs`) throughout the server. No bundler — Node executes the files directly.
- **TypeScript**: `tsconfig.json` covers only `server/` (`allowJs: true`, output to `dist/server`). The frontend has its own `tsconfig.app.json`.
- **Static serving**: Serves the built frontend from the repo root (`frontendPath = ..`) and `/uploads` from `public/uploads/`. SPA fallback (`app.get('*')`) returns `index.html`.
- **Persistence**: PostgreSQL via `pg`. On startup, retries the connection 3× (2s backoff); if unreachable, falls back to an in-memory store. Health endpoint at `/api/health` reports DB status.
- **Validation**: Zod schemas in `auth/service.mjs`. A global error handler converts `ZodError` to `400 { error, details }`.
- **CORS**: Wide-open (`Access-Control-Allow-Origin: *`) on all routes.

## Layout

```
server/
├── index.mjs                   # Express app: routes, auth guards, scope checks
├── auth/
│   ├── service.mjs             # login/register/logout, session validation, Zod schemas
│   ├── repository.mjs          # users + sessions persistence
│   └── crypto.mjs              # password hashing, session token signing
├── admin/
│   └── repository.mjs          # CRUD for badges, companies, units, users, import sources
├── operations/
│   └── repository.mjs          # badge awards, submissions (create/review), monthly imports
├── db/
│   ├── client.mjs              # createPgClient() — returns null when pg/DATABASE_URL missing
│   ├── checkConnection.mjs     # startup probe (3 retries, 2s backoff)
│   ├── bootstrapRepository.mjs # /api/bootstrap loader (scoped to current user)
│   └── schema.sql              # canonical schema (applied via scripts/dbPush.mjs)
├── data/
│   ├── memoryStore.mjs         # in-memory fallback used when pg unavailable
│   └── seed.mjs                # default badges/companies/users for the memory store
└── uploads/
    ├── uploadRoutes.mjs        # /api/upload router (multipart receive)
    ├── uploadService.mjs       # write to public/uploads/, return URL
    └── multipartParser.mjs     # Busboy wrapper
```

## Request flow

1. **Auth gate** — every protected route starts with `requireAuthenticatedUser(req.headers.authorization)` (or `getAuthenticatedUser` when auth is optional, e.g. `/api/bootstrap`). The session token is a signed string in the `Authorization` header.
2. **Role check** — helpers in `index.mjs` (`isAdminOrDeveloper`, `isDeveloper`, `isManager`, `isSupervisor`, `canManageUnit`) gate by role.
3. **Scope check** — for routes that touch users/submissions, `ensureUsersWithinScope` and `ensureSubmissionWithinScope` confirm the actor's company/unit covers the target. See `docs/architecture-authorization.md` for the role + scoping rules.
4. **Repository call** — the relevant `repository.mjs` performs the SQL (or memory-store fallback).
5. **Response** — JSON; errors bubble to the global handler.

## Routes (overview)

All API routes are declared inline in `server/index.mjs` — there is no route module yet. Major groups:

- `/api/auth/*` — login, register, logout, me
- `/api/bootstrap` — hydrates the client (scoped by current user)
- `/api/health` — DB connectivity report
- `/api/admin/*` — badges, companies, productive-units, users, bulk-invite, import-sources, import-runs, seed-indicator-badges, import-monthly-badges, award-badges, user-badges/remove
- `/api/submissions`, `/api/submissions/:id/review`
- `/api/user/profile`
- `/api/companies/:companyId/productive-units`
- `/api/upload/*` (delegated to `uploads/uploadRoutes.mjs`)

For the full inventory and request/response shapes, see `docs/architecture-api-routes.md`.

## Notable files

- **`server/index.mjs`** (~730 lines, ~500 active + ~230 of commented-out experiments at the bottom) — every route lives here. Good candidate for splitting into `server/routes/*.mjs` once the dust settles.
- **`server/admin/repository.mjs`** (~580 lines) and **`server/operations/repository.mjs`** (~510 lines) — largest data-access modules.
- **`server/auth/repository.mjs`** (~500 lines) — users, sessions, the built-in developer account.
- **`server/db/schema.sql`** — canonical schema; `npm run db:push` applies it.

## Memory fallback

When `createPgClient()` returns `null` (no `pg`, no `DATABASE_URL`, or connection refused), repository functions read/write `server/data/memoryStore.mjs` instead. This keeps the app usable for local development without Postgres, but **data does not persist across restarts** — the startup banner shouts about this, and `/api/health` reports `database.connected = false`. See `docs/DATABASE_PERSISTENCE.md` for the production gotcha on Render.
