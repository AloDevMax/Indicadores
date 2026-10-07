# Backend

- **Entry**: `server/index.mjs` — Express app on `PORT` env var (default 4004). In production runs from `dist/server/index.mjs` (built by `tsc` in `npm run build`).
- **Module system**: ES modules (`.mjs`) throughout the server. No bundler — Node executes the files directly.
- **TypeScript**: `tsconfig.json` covers only `server/` (`allowJs: true`, output to `dist/server`). The frontend has its own `tsconfig.app.json`.
- **Static serving**: Serves the built frontend from the repo root (`frontendPath = ..`). With `STORAGE_DRIVER=local`, `/uploads` is served from `public/uploads/`; with `supabase`, files live in Supabase Storage and `/uploads/*` returns 404. SPA fallback (`app.get('*')`) returns `index.html`.
- **Persistence**: PostgreSQL via Prisma Client (`server/shared/db/prisma.mjs`). On startup the server runs `prisma.$connect()` and exits with code 1 if the database is unreachable; `SIGTERM` closes the server and disconnects. `/api/health` runs `select 1` and answers 200 `{ status: 'ok' }` or 503 `{ status: 'unavailable' }`. See `docs/architecture-database.md`.
- **Validation**: Zod schemas in `auth/service.mjs`. A global error handler converts `ZodError` to `400 { error, details }`.
- **CORS**: Wide-open (`Access-Control-Allow-Origin: *`) on all routes.

## Layout

```
server/
├── index.mjs                   # Express app: routes, auth guards, scope checks, boot
├── config/
│   └── env.mjs                 # Zod-validated environment
├── shared/db/
│   └── prisma.mjs              # the single PrismaClient (connection pool)
├── auth/
│   ├── service.mjs             # login/register/logout, session validation, Zod schemas
│   ├── repository.mjs          # users + sessions, the built-in developer account
│   └── crypto.mjs              # password hashing, session token signing
├── admin/
│   └── repository.mjs          # CRUD for badges, units, users; bulk invite
├── operations/
│   └── repository.mjs          # badge awards, submissions (create/review), imports
├── db/
│   ├── resourceRepository.mjs  # per-route listings (badges, units, legends, ...)
│   └── seed.mjs                # idempotent seed (developer account; --demo data)
├── test/                       # test-only helpers: globalSetup, resetDatabase, fixtures
└── uploads/
    ├── uploadRoutes.mjs        # /api/upload router (multipart receive)
    ├── uploadService.mjs       # validate image, name it, hand it to the storage driver
    ├── storage/                # driver by STORAGE_DRIVER: localStorage (public/uploads) | supabaseStorage (bucket)
    └── multipartParser.mjs     # Busboy wrapper
```

## Request flow

1. **Auth gate** — every protected route starts with `requireAuthenticatedUser(req.headers.authorization)` (or `getAuthenticatedUser` when auth is optional, e.g. `/api/auth/me`). The session token is a signed string in the `Authorization` header.
2. **Role check** — helpers in `index.mjs` (`isAdminOrDeveloper`, `isDeveloper`, `isManager`, `isSupervisor`, `canManageUnit`) gate by role.
3. **Scope check** — for routes that touch users/submissions, `ensureUsersWithinScope` and `ensureSubmissionWithinScope` confirm the actor's company/unit covers the target. See `docs/architecture-authorization.md` for the role + scoping rules.
4. **Repository call** — the relevant repository runs the query through Prisma.
5. **Response** — JSON; errors bubble to the global handler.

## Routes (overview)

All API routes are declared inline in `server/index.mjs` — there is no route module yet. Major groups:

- `/api/auth/*` — login, register, logout, me
- `/api/health` — DB connectivity report
- `/api/admin/*` — badges, companies, productive-units, users, bulk-invite, seed-indicator-badges, import-monthly-badges, award-badges, user-badges/remove
- `/api/submissions`, `/api/submissions/:id/review`
- `/api/user/profile`
- `/api/companies/:companyId/productive-units`
- `/api/upload/*` (delegated to `uploads/uploadRoutes.mjs`)

For the full inventory and request/response shapes, see `docs/architecture-api-routes.md`.

## Notable files

- **`server/index.mjs`** — every route lives here. Splitting it into modules is Fase 3 of `.specs/2026-10-06-arquitetura-prod-design.md`.
- **`server/admin/repository.mjs`** and **`server/operations/repository.mjs`** — the largest data-access modules.
- **`server/auth/repository.mjs`** — users, sessions, the built-in developer account.
- **`prisma/schema.prisma`** and **`prisma/migrations/`** — the schema and its versioned migrations.
