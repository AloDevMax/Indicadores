# Database

- **ORM**: Prisma 6, schema at `prisma/schema.prisma`. The client is generated into `node_modules/.prisma` (`npx prisma generate`, also run by `npm run build`).
- **Client**: a single `PrismaClient` per process in `server/shared/db/prisma.mjs`, which owns the connection pool. Repositories import it; nothing else opens connections.
- **Queries**: plain reads and writes use the Prisma API with explicit `select`s (so `password_hash` never leaks). Queries with joins, aliases (`badge_name`, `user_name`) or `on conflict` use `prisma.$queryRaw` with the template tag, which is parameterized. In raw SQL, cast parameters compared with `uuid` columns (`${id}::uuid`) and enum columns read back (`role::text`).
- **Transactions**: `prisma.$transaction(async (tx) => ...)`; every query inside goes through `tx`.
- **No fallback**: `DATABASE_URL` is required. If the database is unreachable at boot, the server exits with code 1; `/api/health` answers 503 when a query fails.
- **Timestamps**: columns are `timestamp(6)` without time zone and hold UTC wall-clock values; Prisma reads them as UTC.
- **Schema changes**: versioned migrations in `prisma/migrations`. Locally, `npm run db:migrate` (`prisma migrate dev`) creates and applies them; deploys run `prisma migrate deploy`. `DIRECT_URL` is the direct connection Prisma Migrate uses (same as `DATABASE_URL` when there is a single database).
- **Seed**: `server/db/seed.mjs` (`npm run db:seed`) is idempotent and runs on every deploy. It ensures the built-in developer account; `npm run db:seed -- --demo` also writes demo badges and units for local use.
- **Key models**: `User`, `AuthSession`, `ProductiveUnit`, `Badge`, `UserBadge` (earned badges with tone: bronze/silver/gold/loss_1/loss_2), `BadgeSubmission`, `Notification`, `BadgeLegendSetting`. `ImportSource`, `ImportRun` and `ImportRunRow` are legacy tables nothing uses.
